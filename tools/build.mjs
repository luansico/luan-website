import {readFileSync,writeFileSync,mkdirSync,rmSync,cpSync,readdirSync,lstatSync,existsSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>JSON.parse(readFileSync(join(root,'data',name+'.json'),'utf8'));
const site={...read('site'),projects:read('projects'),testimonials:read('reviews')};
const copy=read('copy'),services=read('services');
const context={window:{},URL};vm.createContext(context);
vm.runInContext(readFileSync(join(root,'app.js'),'utf8'),context);
context.window.LuanValidation.validateSite(site);
const languages=['sq','en'];
for(const key of JSON.parse(readFileSync(join(root,'tools/required-copy.json'),'utf8')))for(const language of languages)assert.ok(copy[language]?.[key],`Missing required ${language}.${key}`);
assert.deepEqual(Object.keys(copy.sq).sort(),Object.keys(copy.en).sort(),'Translation keys must match');
for(const language of languages)for(const [key,value] of Object.entries(copy[language]))assert.ok(typeof value==='string'&&value.trim(),`Missing ${language}.${key}`);
const html=readFileSync(join(root,'index.html'),'utf8');
const keys=new Set([...html.matchAll(/data-i18n(?:-aria|-alt|-placeholder)?="([^"]+)"/g)].map(m=>m[1]));
for(const m of readFileSync(join(root,'app.js'),'utf8').matchAll(/(?:t\(|[?:]\s*)"([A-Za-z]+)"/g))if(Object.hasOwn(copy.en,m[1]))keys.add(m[1]);
for(const key of ['formWhatsappIntro','resultWhatsappInstruction','openWhatsapp','whatsappGreeting','enquirySource','formInvalid'])keys.add(key);
for(const key of keys)for(const language of languages)assert.ok(copy[language][key],`Missing ${language}.${key}`);
assert.deepEqual(services.map(s=>s.id).sort(),['cameras','computers','electrical','network']);
for(const service of services){
  assert.ok(['bolt','camera','computer','network'].includes(service.icon));
  for(const language of languages){for(const key of ['title','description'])assert.ok(typeof service[key]?.[language]==='string'&&service[key][language].trim());assert.ok(Array.isArray(service.items?.[language])&&service.items[language].length&&service.items[language].every(v=>typeof v==='string'&&v.trim()));}
}
for(const project of site.projects)assert.ok(existsSync(join(root,project.image)),`Missing project image: ${project.image}`);
function auditAssets(folder){for(const name of readdirSync(folder)){const path=join(folder,name),info=lstatSync(path);assert.ok(!info.isSymbolicLink(),'Public assets cannot be symlinks');if(info.isDirectory())auditAssets(path);else{assert.ok(/\.(jpe?g|png|webp|svg|ttf|txt)$/.test(name),'Unsupported public asset: '+name);assert.ok(info.size<=5*1024*1024,'Public asset exceeds 5 MB: '+name);}}}
auditAssets(join(root,'assets'));
const generated='/* Generated from data/*.json by tools/build.mjs. Edit through Pages CMS. */\n'+[['LUAN_SITE',site],['LUAN_TRANSLATIONS',copy],['LUAN_SERVICES',services]].map(([name,value])=>'window.'+name+' = '+JSON.stringify(value,null,2)+';').join('\n')+'\n';
// No runtime API, tokens or content-fetch service is needed on GitHub Pages.
writeFileSync(join(root,'content.js'),generated);
const output=join(root,'_site');rmSync(output,{recursive:true,force:true});mkdirSync(output);
for(const name of ['index.html','styles.css','app.js','content.js','.nojekyll','assets','admin'])cpSync(join(root,name),join(output,name),{recursive:true});
const version=createHash('sha256').update(generated).update(readFileSync(join(root,'app.js'))).update(readFileSync(join(root,'styles.css'))).digest('hex').slice(0,12);
writeFileSync(join(output,'index.html'),html.replace(/(src|href)="(app.js|content.js|styles.css)"/g,(_,attr,name)=>attr+'="'+name+'?v='+version+'"'));
for(const match of readFileSync(join(root,'styles.css'),'utf8').matchAll(/url\(['"]?(assets\/[^)'"]+)/g))assert.ok(existsSync(join(root,match[1])), 'Missing font or CSS asset: '+match[1]);
console.log('Validated CMS content and built _site/ with public files only.');
