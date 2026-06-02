
const urls = [
    "https://example.com/#/lp/slug?src=test",
    "https://example.com/#/lp/slug/?src=test",
    "https://example.com/?src=test#/lp/slug",
];

urls.forEach(urlStr => {
    const url = new URL(urlStr);
    console.log(`URL: ${urlStr}`);
    console.log(`  Search: ${url.search}`);
    console.log(`  Hash: ${url.hash}`);
    
    let src = new URLSearchParams(url.search).get('src');
    if (!src && url.hash.includes('?')) {
        const hashQuery = url.hash.split('?')[1];
        src = new URLSearchParams(hashQuery).get('src');
    }
    console.log(`  Extracted SRC: ${src}`);
});
