// Usage: node show-switcher.cjs "D · Inside About=mock-d-inside-about.js" "E · By place=mock-e-by-place.js"
// Each argument is "label=path". A "Current" tab (no mock, the live register) is always added.
const { chromium } = require('/Users/lance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const mocks = {};
const labels = {};
process.argv.slice(2).forEach((arg, i) => {
  const [label, file] = arg.split('=');
  const k = `m${i}`;
  labels[k] = label;
  mocks[k] = fs.readFileSync(file, 'utf8');
});
labels.cur = 'Current';
mocks.cur = "'current register'";
const first = Object.keys(labels)[0];
const SWITCHER = (cur, labels) => {
  document.getElementById('xswitch')?.remove();
  const bar = document.createElement('div');
  bar.id = 'xswitch';
  bar.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:9999;display:flex;gap:2px;padding:4px;background:#1b2a33;font:500 13px/1 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25)';
  for (const k of Object.keys(labels)) {
    const b = document.createElement('button');
    b.textContent = labels[k];
    b.style.cssText = `padding:10px 12px;cursor:pointer;border:0;color:${k === cur ? '#1b2a33' : '#fbf6ec'};background:${k === cur ? '#fbf6ec' : 'transparent'}`;
    b.onclick = () => { sessionStorage.setItem('xmock', k); location.reload(); };
    bar.appendChild(b);
  }
  document.body.appendChild(bar);
  document.title = labels[cur];
};
(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: false, args: ['--window-size=1440,960'] });
  const ctx = await browser.newContext({ viewport: null });
  await ctx.route('**/*execute-api*/**', r => r.request().method() === 'GET' ? r.continue() : r.abort());
  const page = await ctx.newPage();
  for (const p of ctx.pages()) if (p !== page) await p.close();
  page.on('load', async () => {
    try {
      await page.waitForTimeout(1500);
      const stored = await page.evaluate(() => sessionStorage.getItem('xmock'));
      const k = stored in mocks ? stored : first;
      console.log(k, await page.evaluate(mocks[k]));
      await page.evaluate(`(${SWITCHER})(${JSON.stringify(k)}, ${JSON.stringify(labels)})`);
      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        document.querySelector('#about').scrollIntoView({ block: 'start' });
      });
    } catch (e) { console.log('apply failed', e.message); }
  });
  await page.goto('http://127.0.0.1:5197/#about', { waitUntil: 'networkidle' });
  await page.bringToFront();
  console.log('ready');
  await new Promise(r => browser.on('disconnected', r));
})();
