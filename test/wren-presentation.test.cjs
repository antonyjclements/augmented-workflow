const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
for(const name of ['index.html','technical.html','usage-guide.html'])test(`${name} anchors Wren in its page position and references existing assets`,()=>{
 const html=fs.readFileSync(path.join(root,name),'utf8');
 assert.match(html,/wren-idle\.js/);
 assert.match(html,/data-wren-pose=/);
 assert.match(html,/class="wren-hero"/);
 for(const [,src] of html.matchAll(/src="(assets\/[^"]+)"/g))assert.ok(fs.existsSync(path.join(root,src)),src);
});
test('paper styling retains texture without mascot animation rules',()=>{
 const css=fs.readFileSync(path.join(root,'assets/wren-paper.css'),'utf8');
 assert.match(css,/paper-grain\.svg/);assert.ok(fs.existsSync(path.join(root,'assets/paper-grain.svg')));
 assert.doesNotMatch(css,/@keyframes wren|wren-idle-gesture/);
});
