exports.DataFlushing = {
    RFWR: (BANK) => {
        const fetch = require('electron-fetch').default

        const endpoint = "https://caplet.ryanwans.com/a3/edge/enco/realtime-data-stream";
        const query    = "?now="+Date.now()+"&encoded=hi7634i8e763wi487i8736wi7";
        const HIT      = endpoint+query;

        // typeof BANK should be an array in format [meta, bank, auth]
        if("object" != typeof BANK && BANK.length != 3) {
            return "Invalid Parameter.";
        } else {
            !(function(){
                "use strict";

                var RESP = fetch(HIT, {
                    method: 'POST', 
                    body: JSON.stringify(BANK),
                    headers: { 
                        'Content-Type': 'application/json' 
                    }
                });
                console.debug("Dispatched FETCH request: flushing stream now");

                // remember; response does not matter here, so we can purge
                // any async or await functionalities previously used

                return true;
            }())
        }
    }
};