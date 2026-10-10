import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const context = { window: {}, URL };
vm.createContext(context);
for (const file of ['content.js', 'app.js']) vm.runInContext(readFileSync(join(root, file), 'utf8'), context);
const { LUAN_SITE: site, LUAN_TRANSLATIONS: translations, LUAN_SERVICES: services, LuanValidation: validation } = context.window;
let count = 0;
function check(name, fn) { fn(); count++; console.log('PASS ' + name); }
const fixtureProject = {id:'synthetic-test',category:'electrical',kind:'example',image:'assets/electrical-work.jpg',title:{sq:'Test sintetik',en:'Synthetic test'},summary:{sq:'Test',en:'Test'},detail:{sq:'Test',en:'Test'},items:{sq:['Test'],en:['Test']},links:[]};
const clone = () => ({...JSON.parse(JSON.stringify(site)),projects:[structuredClone(fixtureProject),{...structuredClone(fixtureProject),id:'synthetic-test-2'}]});
check('Current CMS configuration is valid', () => {
  assert.equal(validation.validateSite(site), site);
});
check('Both languages cover all template strings', () => {
  assert.deepEqual(Object.keys(translations.sq).sort(), Object.keys(translations.en).sort());
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  for (const match of html.matchAll(/data-i18n(?:-aria|-alt|-placeholder)?="([^"]+)"/g)) {
    for (const lang of ['sq', 'en']) assert.equal(typeof translations[lang][match[1]], 'string', match[1]);
  }
  for (const service of services) for (const lang of ['sq', 'en']) {
    assert.ok(service.title[lang]); assert.ok(service.description[lang]); assert.ok(service.items[lang].length);
  }
});
check('All sample scopes are visibly classified as examples', () => {
  assert.ok(site.projects.every(p => ['example','project'].includes(p.kind)));
  assert.match(translations.en.exampleDisclaimer, /not a completed project/);
  assert.match(translations.sq.exampleDisclaimer, /jo një projekt i realizuar/);
});
check('Missing language, duplicate ID and missing approval are rejected', () => {
  const a = clone(); delete a.projects[0].title.en; assert.throws(() => validation.validateSite(a));
  const b = clone(); b.projects[1].id = b.projects[0].id; assert.throws(() => validation.validateSite(b));
  const c = clone(); c.projects[0].kind = 'project'; assert.throws(() => validation.validateSite(c));
  c.projects[0].approved = true; c.projects[0].source = 'Synthetic validation fixture, not published'; assert.doesNotThrow(() => validation.validateSite(c));
});
check('Unsafe protocols, external image paths and invalid contacts are rejected', () => {
  const badLinks = ['javascript:alert(1)', 'http://example.invalid/', 'data:text/html,test', 'https://user:secret@example.invalid/'];
  for (const url of badLinks) {
    assert.equal(validation.httpsUrl(url), false);
    const test = clone(); test.contact.socials = [{label:'Synthetic',url}]; assert.throws(() => validation.validateSite(test));
  }
  for (const image of ['../private.jpg', 'https://example.invalid/a.jpg', 'assets/../private.jpg']) assert.equal(validation.localAsset(image), false);
  const a = clone(); a.contact.email = 'owner@example.invalid?body=bad'; assert.throws(() => validation.validateSite(a));
  const b = clone(); b.contact.phone = '+355 123 456'; assert.throws(() => validation.validateSite(b));
});
check('Unapproved or incomplete client references are rejected', () => {
  const test = clone(); test.testimonials = [{name:'Synthetic reviewer',quote:{sq:'Shembull',en:'Example'},context:{sq:'Test',en:'Test'},approved:false,source:'Synthetic validation'}];
  assert.throws(() => validation.validateSite(test));
  test.testimonials[0].approved = true; assert.doesNotThrow(() => validation.validateSite(test));
});
check('Enquiries reject blanks, invalid emails, unknown services and oversized content', () => {
  const data = {name:'Synthetic Review',email:'synthetic@example.invalid',phone:'',location:'Synthetic area',service:'electrical',message:'Synthetic verification enquiry.'};
  assert.equal(validation.validateEnquiry(data), true);
  assert.equal(validation.validateEnquiry({...data,email:''}),true);
  for (const change of [{name:'  '},{email:'invalid'},{service:'unknown'},{message:'short'},{message:'x'.repeat(2501)},{location:'\n'},{name:'A\nB'}]) assert.equal(validation.validateEnquiry({...data,...change}), false);
  assert.equal(validation.validateEnquiry({...data,message:'<script>synthetic payload</script>'}),true); // Data remains plain text; browser check verifies rendering.
});
check('WhatsApp URLs preserve enquiry text and reject invalid numbers', () => {
  const message='Synthetic enquiry: + & ? #\nPërshëndetje';
  const url=new URL(validation.whatsappUrl('+355123456789',message));
  assert.equal(url.pathname,'/355123456789');assert.equal(url.searchParams.get('text'),message);
  for(const number of ['355123456789','+355 1234','javascript:alert(1)'])assert.throws(()=>validation.whatsappUrl(number,message));
});
check('Local publication assets exist and no remote script/font/image is required', () => {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  for (const match of html.matchAll(/(?:src|href)="(assets\/[^"#]+|styles\.css|content\.js|app\.js)"/g)) assert.ok(existsSync(join(root, match[1])), match[1]);
  for (const project of site.projects) assert.ok(existsSync(join(root, project.image)), project.image);
  assert.ok(existsSync(join(root, '.nojekyll')));
  assert.equal(/<script[^>]+src="https?:/i.test(html), false);
  assert.equal(/url\(['"]?https?:/i.test(readFileSync(join(root,'styles.css'),'utf8')), false);
  assert.equal(readdirSync(join(root,'assets')).some(name=>name.toLowerCase().endsWith('.pdf')), false);
});
console.log('\n' + count + ' grouped checks passed. Browser validation is recorded separately in docs/VALIDATION.md.');
