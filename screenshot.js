const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log('Iniciando puppeteer...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set viewport for standard 16:9 laptop size
    await page.setViewport({ width: 1440, height: 900 });

    const baseUrl = 'https://devbyte-labs.vercel.app';
    const pages = [
        { url: '/portfolio-dashboard.html', output: 'dashboard-mockup.jpg' },
        { url: '/portfolio-ecommerce.html', output: 'ecommerce-mockup.jpg' },
        { url: '/portfolio-landing.html', output: 'landing-mockup.jpg' }
    ];

    for (const p of pages) {
        console.log(`Tirando print de ${p.url}...`);
        await page.goto(baseUrl + p.url, { waitUntil: 'networkidle0' });
        // wait extra 2s for animations
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: p.output, quality: 90, type: 'jpeg' });
        console.log(`Salvo: ${p.output}`);
    }

    await browser.close();
    console.log('Pronto!');
})();
