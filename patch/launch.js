// INIT SCRIPT

// init process goes here
-function() {
    document.title = "Test Caplet - Live";
    $('.xx2-error-t').hide();
    $('.xx2-error-s').hide();

    const makeid = length => {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
    window.Login['errPassT'] = () => {
        $('.xx2-error-t').attr("id", "xx2-priority");
    }
    window.Login['errPassS'] = () => {
        $('.xx2-error-s').attr('id', 'xx2-priority');
    }
    window.Login['attempt'] = (method, target1, target2) => {
        var username, password, code, form;
        if("teacher" == method) {
            username = $(target1).val(), password = btoa($(target2).val());
            form = {
                u: username,
                p: password,
                stamp: Date.now(),
                m: "teacher",
                license: window.license
            };
        } else {
            code = $(target1).val();
            form = {
                c: code,
                stamp: Date.now(),
                m: "student",
                license: window.license
            }
        }
        (async () => {
            let { remote, ipcRenderer, ipcMain } = require('electron');
            let RemotePortal = remote.require('./remote/login.js');
            let ReturnPromise = new Promise((reslove, reject) => {
                reslove(RemotePortal.Attempt(btoa(JSON.stringify(form))))
            });
            let Return = await ReturnPromise;
            let Login = Return.auth;
            if(!Login) {
                if("teacher" == method) {
                    $('#t-l-u').val('');
                    $('#t-l-p').val('');
                    window.Login['errPassT']();
                    if(Return.serr) {
                        $('.xx2-error-t').html("<b>CRITICAL:</b> The login database / web server is currently down.");
                    }
                } else {
                    $('#s-t').val('');
                    window.Login['errPassS']();
                    if(Return.serr) {
                        $('.xx2-error-s').html("<b>CRITICAL:</b> The login database / web server is currently down.");
                    }
                }
            } else {
                if(method == "student") { Return.studentName = $('#s-n').val() }
                $('.xx2-m-'+method).remove();
                $('.xx2-b-'+method).remove();
                $('.xx2-w-'+method).text("Loading...");
                setTimeout(function() {
                    ipcRenderer.send('set-test-meta', Return);
                    ipcRenderer.send('win-raster-'+method, {
                        k: '9q2837492387423897q4o937h49q23747q23896wey',
                        push: {index: Return.use, auth: Return.address}
                    });
                }, 500);
            }
        })();
        
    }
}()
// post init goes here
-function() {
    console.log("init process has finished");
    setTimeout(function() {
        fifo('#xx2-fadeout', '#xx2-fadein');
    }, 3000)
}();