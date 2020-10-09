exports.Attempt = async (FormData) => {
    const fetch = require('electron-fetch').default

    var endpoint = "https://caplet.ryanwans.com/a3/l/q/a/l?form=js&stamp="+Date.now();

    var WINDOW = new Object();

    var toSend = {
        data: FormData
    };

    let QueryPromise = new Promise((resolve, reject) => {
        resolve((() => {
            let f;
            fetch(endpoint, { 
                    method: 'POST',
                    body:    toSend,
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(res => res.json())
                .then(json => f=json);
            console.log("Fetch Request Completed.");
            return f;
        })());
    });

    let AuthTrue = await QueryPromise;

    if("undefined" == typeof AuthTrue) {
        AuthTrue = new Object();
        AuthTrue.auth = 0;
    }
    if("object" != typeof AuthTrue) {
        AuthTrue = JSON.parse(AuthTrue);
    }

    return AuthTrue.auth;
}