exports.Attempt = async (FormData) => {
    import fetch from 'electron-fetch';

    var endpoint = "https://caplet.ryanwans.com/a3/l/q/a/l?form=js&stamp="+Date.now();

    var toSend = {
        data: FormData
    };

    let QueryPromise = new Promise((resolve, reject) => {
        resolve((() => {
            return fetch(endpoint, { 
                    method: 'POST',
                    body:    toSend,
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(res => res.json())
                .then(json => {return json;});
        })());
    });

    let AuthTrue = await QueryPromise;
    if("object" != typeof AuthTrue) {
        AuthTrue = JSON.parse(AuthTrue);
    }
    return AuthTrue.auth;
}