const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

// List your static routes here
const links = [
    { url: '/', changefreq: 'daily', priority: 0.7 },
    // Add more routes here
];

// Create a stream to write to
const sitemapStream = new SitemapStream({ hostname: 'https://nabeelthotti.co' });

// Write our sitemap
streamToPromise(sitemapStream)
    .then(data => {
        // data is the XML sitemap as a string
        const filePath = path.resolve(__dirname, 'public', 'sitemap.xml');
        const writeStream = createWriteStream(filePath);
        writeStream.write(data.toString());
        console.log(`Sitemap written to ${filePath}`);
    })
    .catch(e => console.error('Sitemap generation failed', e));

links.forEach(link => sitemapStream.write(link));
sitemapStream.end();
