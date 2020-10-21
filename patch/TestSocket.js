let Export = (Key, Value) => {
    window[Key] = Value;
    return !!window[Key]
}
!function() {
    // anonymize everything for now
    let obj = new Object();
    obj.Portal = {
        start: (Authentication) => {
            var key = {
                raw: btoa(window.TV.meta.studentName.replaceAll(' ', '').toLowerCase()),
                full: 'tcio-stu'+Math.floor((Math.random()*10))+'-'+btoa(window.TV.meta.studentName.replaceAll(' ', '').toLowerCase())
            };
            obj.key = key;
            obj.status = {
                testing: false,
                activeQ: null,
                answers: null,
                elapsed: null,
                wpFire: false,
                submit: false,
                score: null
            }
            Authentication.routing.id = key.raw;
            Authentication.return = key.full;
            obj.routing = Authentication.routing;
            obj.socket = io("https://caplet.ryanwans.com/a3/sockets/sss");
            obj.socket.on(key.full, (importData) => {
                obj.onData(importData)
            });
            obj.socket.on('tcio-all', (importData) => {
                obj.onData(importData);
            })
            obj.socket.emit('approval-request', Authentication);
        }
    }
    obj.Emit = (a) => {
        obj.socket.emit(a);
    }
    obj.onData = (data) => {
        // parse code first
        if(data.code == 'xx1') {
            TestWorker.alert("Test Caplet Alert", "The test administrator has not opened live testing yet. You must wait for your administrator to unlock the test to begin.");
        } else if(data.code == 'xx3') {
            window.TV.enableStart();
            TestWorker.alert("Test Caplet Alert", "Your teacher has unlocked the test and you may now begin by pressing the start button.");
        } else if(data.code == 'xx2') {
            TestWorker.alert("Test Caplet Alert", "The test is currently locked and you must await your administrator to unlock it.")
        }
    }
    obj.statusUpd = () => {
        obj.status.testing = (TV.state == "testing") ? true : false;
        obj.status.activeQ = TestWorker.active; 
        obj.status.answers = TestWorker.AnswerBank;
        obj.status.elapsed = (Date.now() - TestWorker.startTime);
        obj.status.wpFire = TestWorker.wpFire;
        obj.status.score = null;
        obj.status.submit = false;
        obj.socket.emit('tcio-data', {
            purpose: 'status-update',
            routing: obj.routing,
            status: obj.status
        })
    }
    obj.testSubmit = (a) => {
        obj.status.testing = false;
        obj.status.activeQ = TestWorker.active; 
        obj.status.answers = TestWorker.AnswerBank;
        obj.status.elapsed = (Date.now() - TestWorker.startTime);
        obj.status.wpFire = TestWorker.wpFire;
        obj.status.score = null;
        obj.status.submit = true;
        obj.socket.emit('tcio-data', {
            purpose: 'status-update',
            routing: obj.routing,
            status: obj.status
        });
        // depart socket
        if(a == 'locked') {
            // listen for an unlock from admin
        } else {
            obj.socket.disconnect();
        }
    }
    Export("SocketPatch", obj);
}();
