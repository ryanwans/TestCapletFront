// bruh

exports.Fetch = async (endpoint, method, query, data) => {
    const fetch = require('electron-fetch').default;
    let now;
    let QueryPromise = new Promise((resolve, reject) => {
        return resolve((async () => {

            const res = await fetch(endpoint+query, {
                method: method,
                body: ("POST" == method) ? data : null,
                headers: { 'Content-Type': 'application/json' },
            });

            now = await res.json();
        })());
    });

    await QueryPromise;
    return now;
}