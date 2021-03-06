let Export = (Key, Value) => {
    window[Key] = Value;
    return !!window[Key]
}
!function() {
    // anonymize everything for now
    let obj = new Object();
    obj.Portal = {
        start: (Authentication) => {
            console.debug("Hoisting web socketing pipe...")
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
            console.debug("Unique Listener: "+key.full);
            obj.socket.on(key.full, (importData) => {
                console.debug("Socket Unique Received");
                obj.onData(importData)
            });
            obj.socket.on('tcio-all', (importData) => {
                obj.onData(importData);
            })
            obj.socket.emit('approval-request', Authentication);
            window.SOCKET_AUTH = Authentication;
            console.debug("Hoisted. Running on ID "+btoa(Date.now())+"XX");
        }
    }
    obj.Emit = (a) => {
        obj.socket.emit(a);
    }
    obj.onData = (data) => {
        // parse code first
        console.debug("Socket Dialog Received");
        if(data.code == 'xx1') {
            TestWorker.alert("Test Caplet Alert", "The test administrator has not opened live testing yet. You must wait for your administrator to unlock the test to begin.");
        } else if(data.code == 'xx3') {
            window.TV.enableStart();
            TestWorker.alert("Test Caplet Alert", "Your teacher has unlocked the test and you may now begin by pressing the start button.");
        } else if(data.code == 'xx2') {
            TestWorker.alert("Test Caplet Alert", "Live testing has been opened but the test is currently locked and you must await your administrator to unlock it.")
        } else if(data.code == 'xx6') {
            console.debug("Received reconnection code; attempting to reconnect...");
            obj.socket.emit('approval-request', window.SOCKET_AUTH);
        } else if(data.code == 'xx7') {
            TestWorker.alert("Test Caplet Alert", "The test administrator has stopped the test, you will now return to the waiting screen. Your progress has been stored.");
        } else if(data.code == 'xx8') {
            TestWorker.alert("Test Capler Alert", "An administrator has unlocked your test and you are authorized to begin again",
            () => {
                window.TestWorker.start();        
                TestWorker.wpFire = false;        
            }, "Begin");
        }
    }
    obj.statusUpd = () => {
        console.debug("Socketing new status...");
        obj.status.testing = (TV.state == "testing") ? true : false;
        obj.status.activeQ = TestWorker.active; 
        obj.status.answers = TestWorker.AnswerBank;
        obj.status.elapsed = (Date.now() - TestWorker.startTime);
        obj.status.wpFire = TestWorker.wpFire;
        obj.status.score = null;
        obj.status.submit = TestWorker.submit;
        obj.socket.emit('tcio-data', {
            purpose: 'status-update',
            routing: obj.routing,
            status: obj.status
        })
    }
    obj.testSubmit = (a) => {
        console.debug("Socketing submission state...");
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
            console.debug("Socket will remain open for an unlock event");
        } else {
            console.debug("Closing socketing pipe; test completed.");
            console.debug("Test file destroyed, ready to close.");
            obj.socket.disconnect();
        }
    },
    obj.close = () => {
        obj.socket.disconnect();
    }
    Export("SocketPatch", obj);
}();
