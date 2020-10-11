var _ = new Object();

exports.Attempt = async (FormData) => {
    const fetch = require('electron-fetch').default

    var endpoint = "https://caplet.ryanwans.com/a3/l/q/a/l?form=js&stamp="+Date.now();

    var WINDOW = new Object();

    var toSend = {
        data: FormData
    };

    let QueryPromise = new Promise((resolve, reject) => {
        return resolve((async () => {

            const res = await fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(toSend),
                headers: { 'Content-Type': 'application/json' },
            });

            const response = await res;
            let json;

            if(200 <= response.status && response.status < 400) {
                json = response.json();
            } else {
                json = {auth: false, serr: true};
            }

            return json;
        })());
    });

    let Ret = await QueryPromise;

    if("object" != typeof Ret) {
        Ret = {auth: 0};
    }

    if(Ret.auth) {
        _.Continue(Ret.method);
    }

    return Ret;
}
_['Continue'] = (method) => {
    // push the window resterization to a later process time
}