// INIT SCRIPT

// init process goes here
-function() {
    document.title = "Test Caplet - Live";
    $('.xx2-error-t').hide();
    $('.xx2-error-s').hide();

    const makeid = length => {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789--";
    
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
    
        return text;
    }

    window.license = makeid(20);

    window.Login = new Object();
    window.Login['teacher'] = () => {
        $('.xx2temp').attr('id', 'xx2-fadeout')
        $('.xx2teacher').attr('id', 'xx2-fadein');
        $('.xx2delete').remove();
        setTimeout(function() {
            fifo('#xx2-fadeout', '#xx2-fadein', false);
        }, 100)
    }
    window.Login['student'] = () =>  {
        $('.xx2temp').attr('id', 'xx2-fadeout')
        $('.xx2student').attr('id', 'xx2-fadein');
        $('.xx2delete').remove();
        setTimeout(function() {
            fifo('#xx2-fadeout', '#xx2-fadein', false);
        }, 100)
    }
    window.Login['attempt'] = (method, target1, target2, useFool) => {
        var username = $(target1).val(), password = btoa($(target2).val());
        const t = "https://caplet.ryanwans.com/api3/login/q/attempt/login?form=js&stamp="+Date.now();
        const form = {
            u: username,
            p: password,
            stamp: Date.now(),
            license: window.license
        };
        const parse = btoa(JSON.stringify(form));
        var xhr = new XMLHttpRequest();
        function callback(response) {
            callback = JSON.parse(callback) || callback;

        }
    }
}()
// post init goes here
-function() {
    console.log("init process has finished");
    setTimeout(function() {
        fifo('#xx2-fadeout', '#xx2-fadein');
    }, 3000)
}();