#!/usr/bin/env python3
"""Acceptance-first install/retirement/rollback checks, isolated from real HOME."""
import hashlib
import json
import os
import runpy
from pathlib import Path
import shutil
import subprocess
import tempfile
import tarfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
HELPER = ROOT / 'skills/aw-init/scripts/migrate-skills.py'
FIXTURE_SHA256 = '7821364a2ad30e5c80666758afda812c75e4ede7e069513e95feabddc5726789'
PHASE1_FIXTURE_SHA256 = '0a31ff8677359ecbaff1ec5026fa6b149fd1db7b8d656ab03485c71b25304697'


def snapshot(path):
    if not path.exists():
        return None
    return {str(p.relative_to(path)): (p.read_bytes() if p.is_file() else None)
            for p in sorted(path.rglob('*')) if not p.is_symlink()}


class SkillMigrationTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='aw-skill-migration-')
        self.root = Path(self.tmp.name)
        self.source = self.root / 'source'
        self.target = self.root / 'skills'
        self.source.mkdir()
        self.target.mkdir()
        self.skill(self.source, 'aw-spec', 'bundled spec')
        self.skill(self.source, 'aw-work', 'bundled work')
        self.version = 'phase1-test'

    def tearDown(self):
        self.tmp.cleanup()

    def skill(self, root, name, content):
        (root / name).mkdir(parents=True, exist_ok=True)
        (root / name / 'SKILL.md').write_text(content)

    def run_helper(self, *args, ok=True):
        result = subprocess.run(['python3', str(HELPER), '--source', str(self.source),
                                 '--target', str(self.target), '--version', self.version,
                                 *args], text=True, capture_output=True)
        if ok:
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        else:
            self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
        return result.stdout + result.stderr

    def baseline_skill(self, name):
        fixture = ROOT / 'test/installer/fixtures/aw-upgrade-legacy-0.15.0.tar.gz'
        self.assertEqual(hashlib.sha256(fixture.read_bytes()).hexdigest(), FIXTURE_SHA256)
        with tarfile.open(fixture, 'r:gz') as archive:
            members = [member for member in archive.getmembers()
                       if member.isfile() and member.name.startswith(f'skills/{name}/')]
            self.assertTrue(members)
            for member in members:
                dest = self.target / Path(member.name).relative_to('skills')
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes(archive.extractfile(member).read())
                dest.chmod(member.mode)

    def backup(self):
        return next((self.target / '.augmented-workflow-backups').glob('*/transaction.json')).parent

    def baseline_repo(self, *paths):
        repo = self.root / 'repo'
        with tarfile.open(ROOT / 'test/installer/fixtures/aw-upgrade-legacy-0.15.0.tar.gz', 'r:gz') as archive:
            for path in paths:
                member = archive.getmember(path)
                dest = repo / path
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes(archive.extractfile(member).read())
                dest.chmod(member.mode)
        return repo


    def phase1_fixture(self, *paths):
        fixture = ROOT / 'test/installer/fixtures/aw-upgrade-phase1.tar.gz'
        self.assertEqual(hashlib.sha256(fixture.read_bytes()).hexdigest(), PHASE1_FIXTURE_SHA256)
        repo = self.root / 'repo'
        with tarfile.open(fixture, 'r:gz') as archive:
            for member in archive.getmembers():
                if not member.isfile() or not any(member.name == path or member.name.startswith(path + '/') for path in paths):
                    continue
                relative = Path(member.name)
                dest = (self.target / relative.relative_to('skills') if relative.parts[0] == 'skills'
                        else repo / relative)
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes(archive.extractfile(member).read())
                dest.chmod(member.mode)
        return repo

    def run_installer(self, *args, ok=True):
        (self.root / 'bin').mkdir(exist_ok=True)
        shim = self.root / 'bin/aw'
        shim.write_text('#!/bin/sh\nexit 0\n')
        shim.chmod(0o755)
        env = dict(os.environ, HOME=str(self.root / 'home'), PATH=str(self.root / 'bin') + os.pathsep + os.environ['PATH'])
        result = subprocess.run(['bash', str(ROOT / 'skills/aw-init/scripts/install.sh'),
                                 '--repo', str(self.root / 'repo'), '--skills-dir', str(self.target),
                                 '--learnings-dir', str(self.root / 'learnings'), '--skip-skill-links', *args],
                                text=True, capture_output=True, stdin=subprocess.DEVNULL, env=env)
        self.assertEqual(result.returncode == 0, ok, result.stdout + result.stderr)
        return result.stdout + result.stderr

    def test_default_upgrade_refreshes_verified_helper_and_routing_with_backups(self):
        paths = ['.scripts/aw-gate.js', 'AGENTS.md', 'docs/workflow/README.md',
                 'docs/workflow/field-guide.md', 'docs/workflow/tracking.md', 'docs/standards/e2e-coverage.md']
        repo = self.baseline_repo(*paths)
        self.baseline_skill('aw-brainstorm')
        originals = {path: (repo / path).read_bytes() for path in paths}
        config = repo / 'docs/workflow/config.yml'
        config.write_text('tracking:\n  enabled: true\n')
        self.run_installer()
        self.assertEqual((repo / '.scripts/aw-gate.js').read_bytes(), (ROOT / 'skills/aw-init/artifacts/aw-gate.js').read_bytes())
        for path in paths:
            current = (repo / path).read_bytes()
            if current != originals[path]:
                backups = list((repo / path).parent.glob((repo / path).name + '.bak-*'))
                self.assertTrue(backups, path)
                self.assertEqual(backups[0].read_bytes(), originals[path])
        self.assertNotIn('`aw-brainstorm`', (repo / 'docs/workflow/field-guide.md').read_text())
        self.assertTrue((self.target / 'aw-spec/SKILL.md').exists())
        self.assertFalse((self.target / 'aw-brainstorm').exists())
        if shutil.which('node'):
            for event in ('invocation', 'stage'):
                subprocess.run(['node', '.scripts/aw-gate.js', 'track', 'aw-spec',
                                '--stage', 'create_spec', '--mode', 'direct', '--event', event,
                                '--invocation-id', 'upgrade-fixture'], cwd=repo, check=True)
            rows = [json.loads(line) for path in (repo / 'docs/metrics').glob('skills*.jsonl')
                    for line in path.read_text().splitlines()]
            self.assertEqual([row.get('event') for row in rows], ['invocation', 'stage'])
            self.assertTrue(all(row.get('schema_version') == 2 for row in rows))

    def test_custom_helper_blocks_upgrade_and_custom_routing_is_reported(self):
        repo = self.baseline_repo('.scripts/aw-gate.js', 'docs/workflow/field-guide.md')
        helper = repo / '.scripts/aw-gate.js'
        helper.write_text(helper.read_text() + '\n// local helper customization\n')
        before = snapshot(repo)
        self.baseline_skill('aw-brainstorm')
        skills_before = snapshot(self.target)
        out = self.run_installer(ok=False)
        self.assertIn('helper compatibility review required', out)
        self.assertEqual(snapshot(repo), before)
        self.assertEqual(snapshot(self.target), skills_before)
        helper.unlink()
        guide = repo / 'docs/workflow/field-guide.md'
        guide.write_text(guide.read_text() + '\nlocal routing customization\n')
        custom_guide = guide.read_bytes()
        out = self.run_installer()
        self.assertIn('routing review required:', out)
        self.assertEqual(guide.read_bytes(), custom_guide)

    def test_skill_collision_precedes_helper_refresh_and_force_backups_custom_helper(self):
        repo = self.baseline_repo('.scripts/aw-gate.js')
        helper = repo / '.scripts/aw-gate.js'
        self.skill(self.target, 'aw-spec', 'private provider')
        before = snapshot(repo)
        self.assertIn('collision: aw-spec', self.run_installer(ok=False))
        self.assertEqual(snapshot(repo), before)
        shutil.rmtree(self.target / 'aw-spec')
        helper.write_text(helper.read_text() + '\n// private customization\n')
        original = helper.read_bytes()
        self.run_installer('--with-gates', '--force')
        backups = list(helper.parent.glob('aw-gate.js.bak-*'))
        self.assertEqual(len(backups), 1)
        self.assertEqual(backups[0].read_bytes(), original)
        self.assertEqual(helper.read_bytes(), (ROOT / 'skills/aw-init/artifacts/aw-gate.js').read_bytes())

    def test_installed_bootstrap_can_rollback_without_source_checkout(self):
        self.run_installer()
        backup = self.backup()
        result = subprocess.run(['bash', str(self.target / 'aw-init/scripts/install.sh'),
                                 '--skills-dir', str(self.target), '--rollback-skills', str(backup)],
                                text=True, capture_output=True, cwd=self.root,
                                env=dict(os.environ, HOME=str(self.root / 'home')))
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertFalse((self.target / 'aw-spec').exists())

    def test_clean_dry_run_then_repeated_install(self):
        before = snapshot(self.target)
        out = self.run_helper('--dry-run')
        self.assertIn('Mode: dry-run', out)
        self.assertIn('install: aw-spec', out)
        self.assertEqual(snapshot(self.target), before)
        self.run_helper('--apply')
        manifest = json.loads((self.target / '.augmented-workflow-skills.json').read_text())
        self.assertEqual(set(manifest['skills']), {'aw-spec', 'aw-work'})
        self.assertEqual((self.target / '.augmented-workflow-skills').read_text(), 'aw-spec\naw-work\n')
        before = snapshot(self.target)
        self.run_helper('--apply')
        self.assertEqual(snapshot(self.target), before)

    def test_manifest_and_premanifest_retire_only_verified_legacy(self):
        for with_manifest in (False, True):
            with self.subTest(with_manifest=with_manifest):
                shutil.rmtree(self.target)
                self.target.mkdir()
                self.baseline_skill('aw-brainstorm')
                self.baseline_skill('aw-create-spec')
                if with_manifest:
                    (self.target / '.augmented-workflow-skills').write_text('aw-brainstorm\naw-create-spec\n')
                self.skill(self.target, 'aw-user-custom', 'keep this')
                out = self.run_helper('--apply')
                self.assertIn('retire: aw-brainstorm', out)
                self.assertFalse((self.target / 'aw-brainstorm').exists())
                self.assertFalse((self.target / 'aw-create-spec').exists())
                self.assertEqual((self.target / 'aw-user-custom/SKILL.md').read_text(), 'keep this')

    def test_modified_legacy_and_unverified_names_survive(self):
        self.baseline_skill('aw-brainstorm')
        (self.target / 'aw-brainstorm/references/local.md').write_text('custom addition')
        self.skill(self.target, 'aw-create-spec', 'private provider')
        self.skill(self.target, 'ce-brainstorm', 'unverified former name')
        (self.target / '.augmented-workflow-skills').write_text('aw-brainstorm\naw-create-spec\n')
        out = self.run_helper('--apply')
        self.assertIn('preserve unresolved: aw-brainstorm', out)
        self.assertIn('preserve unresolved: aw-create-spec', out)
        self.assertEqual((self.target / 'aw-create-spec/SKILL.md').read_text(), 'private provider')
        self.assertTrue((self.target / 'ce-brainstorm/SKILL.md').exists())
        self.assertNotIn('aw-create-spec', json.loads((self.target / '.augmented-workflow-skills.json').read_text())['skills'])

    def test_owned_customization_is_preserved_and_not_reowned(self):
        self.run_helper('--apply')
        self.skill(self.target, 'aw-work', 'custom work')
        out = self.run_helper('--apply')
        self.assertIn('preserve unresolved: aw-work', out)
        self.assertEqual((self.target / 'aw-work/SKILL.md').read_text(), 'custom work')
        self.assertNotIn('aw-work', json.loads((self.target / '.augmented-workflow-skills.json').read_text())['skills'])

    def test_aw_spec_name_collision_and_symlink_stop_before_writes(self):
        self.skill(self.target, 'aw-spec', 'my own spec tool')
        before = snapshot(self.target)
        self.assertIn('collision: aw-spec', self.run_helper('--apply', ok=False))
        self.assertEqual(snapshot(self.target), before)
        shutil.rmtree(self.target / 'aw-spec')
        outside = self.root / 'outside'
        self.skill(self.root, 'outside', 'external tool')
        (self.target / 'aw-spec').symlink_to(outside, target_is_directory=True)
        self.assertIn('collision: aw-spec', self.run_helper('--apply', ok=False))
        self.assertEqual((outside / 'SKILL.md').read_text(), 'external tool')

    def test_bad_manifest_and_metadata_symlink_fail_closed(self):
        (self.target / '.augmented-workflow-skills').write_text('../outside\n')
        before = snapshot(self.target)
        self.assertIn('invalid skill name', self.run_helper('--apply', ok=False))
        self.assertEqual(snapshot(self.target), before)
        (self.target / '.augmented-workflow-skills').unlink()
        external = self.root / 'manifest'
        external.write_text('{}')
        (self.target / '.augmented-workflow-skills.json').symlink_to(external)
        self.assertIn('symlink', self.run_helper('--apply', ok=False))
        self.assertEqual(external.read_text(), '{}')

    def test_rollback_restores_pinned_bundle_and_rejects_later_customization(self):
        self.baseline_skill('aw-brainstorm')
        self.baseline_skill('aw-create-spec')
        (self.target / 'aw-version.txt').write_text('0.15.0\n')
        (self.target / '.augmented-workflow-skills').write_text('aw-brainstorm\naw-create-spec\n')
        before = snapshot(self.target)
        self.run_helper('--apply')
        backup = self.backup()
        self.skill(self.target, 'aw-spec', 'customized after install')
        self.assertIn('rollback collision', self.run_helper('--rollback', str(backup), ok=False))
        self.assertFalse((self.target / 'aw-brainstorm').exists())
        shutil.copyfile(self.source / 'aw-spec/SKILL.md', self.target / 'aw-spec/SKILL.md')
        self.run_helper('--rollback', str(backup))
        restored = snapshot(self.target)
        restored = {k: v for k, v in restored.items() if not k.startswith('.augmented-workflow-backups')}
        self.assertEqual(restored, before)

    def test_rollback_rejects_foreign_identity_symlink_and_changed_backup(self):
        self.baseline_skill('aw-brainstorm')
        self.run_helper('--apply')
        backup = self.backup()
        journal_path = backup / 'transaction.json'
        journal_original = journal_path.read_bytes()
        journal = json.loads(journal_original)
        journal['target'] = str(self.root / 'another-target')
        journal_path.write_text(json.dumps(journal))
        self.assertIn('identity', self.run_helper('--rollback', str(backup), ok=False))
        journal_path.write_bytes(journal_original)
        saved = self.root / 'saved-journal'
        journal_path.rename(saved)
        journal_path.symlink_to(saved)
        self.assertIn('symlink', self.run_helper('--rollback', str(backup), ok=False))
        journal_path.unlink()
        saved.rename(journal_path)
        prior = backup / 'before/aw-brainstorm/SKILL.md'
        prior.write_text('changed backup')
        self.assertIn('backup content changed', self.run_helper('--rollback', str(backup), ok=False))
        self.assertFalse((self.target / 'aw-brainstorm').exists())

    def test_rollback_cannot_follow_predictable_journal_temp_symlink(self):
        self.run_helper('--apply')
        backup = self.backup()
        victim = self.root / 'unrelated-user-file'
        victim.write_text('KEEP')
        (backup / 'transaction.json.tmp').symlink_to(victim)
        self.run_helper('--rollback', str(backup))
        self.assertEqual(victim.read_text(), 'KEEP')

    def test_malformed_journal_or_symlinked_backup_root_stops_before_writes(self):
        self.run_helper('--apply')
        backup = self.backup()
        journal = backup / 'transaction.json'
        journal.write_text('not json')
        before = snapshot(self.target)
        self.run_helper('--apply', ok=False)
        self.assertEqual(snapshot(self.target), before)
        root = self.target / '.augmented-workflow-backups'
        outside = self.root / 'external-backups'
        root.rename(outside)
        root.symlink_to(outside, target_is_directory=True)
        self.assertIn('symlink', self.run_helper('--apply', ok=False))
        self.assertIn('symlink', self.run_helper('--rollback', str(backup), ok=False))

    def test_incomplete_transaction_blocks_install_and_can_be_rolled_back(self):
        self.skill(self.source, 'aw-ship', 'bundled shipping')
        for retired in ('aw-brainstorm', 'aw-create-spec', 'aw-commit', 'aw-commit-push-pr'):
            with self.subTest(retired=retired):
                shutil.rmtree(self.target)
                self.target.mkdir()
                self.baseline_skill(retired)
                before = snapshot(self.target)
                # Kill the real apply path after its retirement rename, not after a fake
                # successful transaction. No production failure-injection flag is needed.
                code = """
import importlib.util, os, pathlib, sys
helper, source, target, retired = sys.argv[1:]
spec = importlib.util.spec_from_file_location('migration', helper)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
original = pathlib.Path.replace
def interrupted(path, destination):
    result = original(path, destination)
    if str(path) == str(pathlib.Path(target) / retired):
        os._exit(97)
    return result
pathlib.Path.replace = interrupted
sys.argv = [helper, '--source', source, '--target', target, '--version', 'phase1-test', '--apply']
module.main()
"""
                result = subprocess.run(['python3', '-B', '-c', code, str(HELPER), str(self.source), str(self.target), retired],
                                        text=True, capture_output=True)
                self.assertEqual(result.returncode, 97, result.stdout + result.stderr)
                backup = self.backup()
                self.assertEqual(json.loads((backup / 'transaction.json').read_text())['state'], 'applying')
                self.assertIn('unfinished migration', self.run_helper('--apply', ok=False))
                self.run_helper('--rollback', str(backup))
                restored = {k: v for k, v in snapshot(self.target).items() if not k.startswith('.augmented-workflow-backups')}
                self.assertEqual(restored, before)


    def test_aw_ship_collision_rejects_unowned_identical_content_and_symlinks(self):
        self.skill(self.source, 'aw-ship', 'bundled shipping')
        for content in ('private shipping provider', 'bundled shipping'):
            with self.subTest(content=content):
                self.skill(self.target, 'aw-ship', content)
                before = snapshot(self.target)
                self.assertIn('collision: aw-ship', self.run_helper('--apply', ok=False))
                self.assertEqual(snapshot(self.target), before)
        shutil.rmtree(self.target / 'aw-ship')
        self.skill(self.root, 'external-ship', 'private external shipping')
        (self.target / 'aw-ship').symlink_to(self.root / 'external-ship', target_is_directory=True)
        self.assertIn('collision: aw-ship', self.run_helper('--apply', ok=False))
        self.assertEqual((self.root / 'external-ship/SKILL.md').read_text(), 'private external shipping')

    def test_shipping_legacy_retirement_and_rollback_with_and_without_manifest(self):
        self.skill(self.source, 'aw-ship', 'bundled shipping')
        for with_manifest in (False, True):
            with self.subTest(with_manifest=with_manifest):
                shutil.rmtree(self.target)
                self.target.mkdir()
                for name in ('aw-commit', 'aw-commit-push-pr'):
                    self.baseline_skill(name)
                if with_manifest:
                    (self.target / '.augmented-workflow-skills').write_text('aw-commit\naw-commit-push-pr\n')
                before = snapshot(self.target)
                out = self.run_helper('--apply')
                for name in ('aw-commit', 'aw-commit-push-pr'):
                    self.assertIn(f'retire: {name}', out)
                    self.assertFalse((self.target / name).exists())
                self.assertIn('Use aw-ship', out)
                self.assertTrue((self.target / 'aw-ship/SKILL.md').exists())
                installed = snapshot(self.target)
                self.run_helper('--apply')
                self.assertEqual(snapshot(self.target), installed)
                self.run_helper('--rollback', str(self.backup()))
                restored = {k: v for k, v in snapshot(self.target).items()
                            if not k.startswith('.augmented-workflow-backups')}
                self.assertEqual(restored, before)

    def test_modified_retired_shipping_providers_are_preserved(self):
        self.skill(self.source, 'aw-ship', 'bundled shipping')
        self.baseline_skill('aw-commit')
        (self.target / 'aw-commit/local.txt').write_text('user addition')
        self.skill(self.target, 'aw-commit-push-pr', 'private PR provider')
        (self.target / '.augmented-workflow-skills').write_text('aw-commit\naw-commit-push-pr\n')
        out = self.run_helper('--apply')
        for name in ('aw-commit', 'aw-commit-push-pr'):
            self.assertIn(f'preserve unresolved: {name}', out)
            self.assertTrue((self.target / name).is_dir())
            self.assertNotIn(name, json.loads((self.target / '.augmented-workflow-skills.json').read_text())['skills'])

    def test_shipping_config_preserves_independent_providers_and_reports_legacy_names(self):
        repo = self.root / 'repo'
        config = repo / 'docs/workflow/config.yml'
        config.parent.mkdir(parents=True)
        original = ('workflow:\n  steps:\n    commit:\n      skill: custom-local-commit\n'
                    '    commit_push_pr:\n      skill: aw-commit-push-pr\n')
        config.write_text(original)
        upgrade = ROOT / 'skills/aw-init/scripts/upgrade-config.rb'
        for mode in ('--dry-run', '--apply'):
            result = subprocess.run(['ruby', str(upgrade), '--repo', str(repo), mode],
                                    text=True, capture_output=True)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertIn('workflow.steps.commit.skill="custom-local-commit" preserved independently', result.stdout)
            self.assertIn('workflow.steps.commit_push_pr.skill="aw-commit-push-pr" preserved: retired bundled name', result.stdout)
            self.assertIn('choose aw-ship', result.stdout)
            if mode == '--dry-run':
                self.assertEqual(config.read_text(), original)
        self.assertIn('skill: custom-local-commit', config.read_text())
        self.assertIn('skill: aw-commit-push-pr', config.read_text())
        self.assertEqual(next(config.parent.glob('config.yml.bak-*')).read_text(), original)

    def test_shipping_legacy_git_override_is_migrated_but_not_renamed(self):
        repo = self.root / 'repo'
        config = repo / 'docs/workflow/config.yml'
        config.parent.mkdir(parents=True)
        config.write_text('git:\n  commit:\n    skill: aw-commit\n')
        result = subprocess.run(['ruby', str(ROOT / 'skills/aw-init/scripts/upgrade-config.rb'),
                                 '--repo', str(repo), '--apply'], text=True, capture_output=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn('workflow.steps.commit.skill="aw-commit" preserved: retired bundled name', result.stdout)
        self.assertIn('skill: aw-commit', config.read_text())

    def test_shipping_routing_reports_customized_config_and_tracking(self):
        repo = self.root / 'repo'
        config = repo / 'docs/workflow/config.yml'
        config.parent.mkdir(parents=True)
        config.write_text('workflow:\n  steps:\n    commit_push_pr:\n      skill: aw-commit-push-pr\n')
        tracking = repo / 'docs/workflow/tracking.md'
        tracking.write_text('Private routing: aw-commit and aw-commit-push-pr\n')
        before = snapshot(repo)
        out = self.run_installer('--dry-run')
        self.assertIn(f'routing review required: {config}', out)
        self.assertIn(f'routing review required: {tracking}', out)
        self.assertIn('commit/commit_push_pr remain independent', out)
        self.assertEqual(snapshot(repo), before)


    def test_phase1_owned_spec_survives_shipping_upgrade_and_rollback(self):
        self.phase1_fixture('skills/aw-spec')
        for name in ('aw-commit', 'aw-commit-push-pr'):
            self.baseline_skill(name)
        fingerprint = runpy.run_path(str(HELPER))['fingerprint']
        names = ('aw-spec', 'aw-commit', 'aw-commit-push-pr')
        manifest = {'schema': 1, 'version': 'phase1-checkpoint',
                    'skills': {name: fingerprint(self.target / name) for name in names}}
        (self.target / '.augmented-workflow-skills.json').write_text(json.dumps(manifest))
        (self.target / '.augmented-workflow-skills').write_text(''.join(name + '\n' for name in names))
        (self.target / 'aw-version.txt').write_text('phase1-checkpoint\n')
        before = snapshot(self.target)
        self.skill(self.source, 'aw-ship', 'bundled shipping')
        out = self.run_helper('--apply')
        self.assertIn('update: aw-spec', out)
        self.assertIn('retire: aw-commit', out)
        self.assertTrue((self.target / 'aw-ship/SKILL.md').exists())
        current = json.loads((self.target / '.augmented-workflow-skills.json').read_text())
        self.assertEqual(set(current['skills']), {'aw-spec', 'aw-ship', 'aw-work'})
        self.run_helper('--rollback', str(self.backup()))
        restored = {k: v for k, v in snapshot(self.target).items()
                    if not k.startswith('.augmented-workflow-backups')}
        self.assertEqual(restored, before)

    def test_phase1_helper_and_routing_refresh_are_verified_and_backed_up(self):
        paths = ['AGENTS.md', '.scripts/aw-gate.js', 'docs/workflow/README.md',
                 'docs/workflow/field-guide.md', 'docs/workflow/tracking.md']
        repo = self.phase1_fixture(*paths)
        originals = {path: (repo / path).read_bytes() for path in paths}
        self.run_installer()
        helper = repo / '.scripts/aw-gate.js'
        self.assertEqual(helper.read_bytes(), (ROOT / 'skills/aw-init/artifacts/aw-gate.js').read_bytes())
        for path in paths:
            current = (repo / path).read_bytes()
            if current != originals[path]:
                backup = next((repo / path).parent.glob((repo / path).name + '.bak-*'))
                self.assertEqual(backup.read_bytes(), originals[path])
        self.assertNotIn('`aw-commit`', (repo / 'docs/workflow/field-guide.md').read_text())
        self.assertNotIn('`aw-commit-push-pr`', (repo / 'docs/workflow/field-guide.md').read_text())
        if shutil.which('node'):
            before = snapshot(repo)
            result = subprocess.run(['node', '.scripts/aw-gate.js', 'shipping-tracking-schema'],
                                    cwd=repo, text=True, capture_output=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(result.stdout.strip(), '2')
            self.assertEqual(snapshot(repo), before)

    def test_custom_phase1_helper_stops_shipping_install_before_writes(self):
        repo = self.phase1_fixture('.scripts/aw-gate.js')
        helper = repo / '.scripts/aw-gate.js'
        helper.write_text(helper.read_text() + '\n// user shipping hook\n')
        before = snapshot(repo)
        skills_before = snapshot(self.target)
        self.assertIn('helper compatibility review required', self.run_installer(ok=False))
        self.assertEqual(snapshot(repo), before)
        self.assertEqual(snapshot(self.target), skills_before)

    def test_aw_ship_force_collision_precedes_repo_and_helper_writes(self):
        repo = self.phase1_fixture('.scripts/aw-gate.js')
        self.skill(self.target, 'aw-ship', 'private shipping provider')
        before, skills_before = snapshot(repo), snapshot(self.target)
        self.assertIn('collision: aw-ship', self.run_installer('--with-gates', '--force', ok=False))
        self.assertEqual(snapshot(repo), before)
        self.assertEqual(snapshot(self.target), skills_before)


    def test_owned_aw_ship_repeat_is_safe_but_local_changes_stop_install(self):
        self.skill(self.source, 'aw-ship', 'bundled shipping')
        self.run_helper('--apply')
        before = snapshot(self.target)
        self.run_helper('--apply')
        self.assertEqual(snapshot(self.target), before)
        self.skill(self.target, 'aw-ship', 'locally edited shipping')
        customized = snapshot(self.target)
        self.assertIn('collision: aw-ship', self.run_helper('--apply', ok=False))
        self.assertEqual(snapshot(self.target), customized)


if __name__ == '__main__':
    unittest.main()
