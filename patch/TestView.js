// TEST VIEWER
let { remote, ipcRenderer, ipcMain } = require('electron');
let Overwatch = remote.require('./remote/Overwatch.js');

window.TV = new Object();

!function() {
    // Set Necessary Values
    window.TV.state = 'pre';

    console.debug("Testing file initializing...")

    // Get Test Meta Data
    var setTestData = async (data) => {
        $('#hot-testName').text(data.name);
        $('#hot-testQs').text(data.meta.count + " Questions");
        $('#hot-testTime').text((data.meta.time == null) ? "No Time Limit" : data.meta.time/60000 + " Minutes");
        $('#hot-testWin').text(data.meta.wProtect);
        $('#hot-testLive').text(data.meta.useLive);
        if(data.meta.wProtect) {
            $('.x-i-noset').addClass('x-o-block');
            $('.x-i-wp').removeClass('x-o-hide');
        } 
        if(data.meta.useLive) {
            $('.x-i-noset').addClass('x-o-block');
            $('.x-i-liv').removeClass('x-o-block')
        }
        window.CLOCK = setInterval(function() {
            $('.dateNow').text(moment().format('MMM Do YYYY, h:mm:ss a'));
            try {
                TestWorker.ifFinish();
            } catch(e) {}
        }, 1000);

        window.TV.Test = await window.TV.renderTestBank(data.tuid);
        
        // Establish socket if needed here
        if(data.meta.useLive) {
            setTimeout(function() {
                window.SocketPatch.Portal.start({
                    purpose: 'routing',
                    routing: {
                        target: window.TV.meta.tuid,
                        name: window.TV.meta.studentName,
                        stage: window.TV.state,
                        time: Date.now(),
                        id: null
                    },
                    return: null
                });
            }, 200)
        } else if(data.meta.open) {
            window.TV.enableStart();
        } else {
            console.debug("Testing locked.");
            $('.repl-target').remove();
            var alert = new FAR.popup({
                moveable: false,
                title: "Test Caplet Alert",
                html: "This test is currently locked and you cannot access it until your administrator unlocks it.<br><br><b>Test Caplet Will Automatically Close</b>",
                jQuery: false,
                pageBlur: true,
                escapeKey: false,
                buttons: [
                    {
                        name: 'Close',
                        func: 'window.closeNow()'
                    }
                ]
            }).hoist();
            window.TV = null;
        }

        setTimeout(function() {
            $('.xs-load').html("<b>STATE: </b> Ready");
            $('.xs-load').addClass("xs-ready");
            $('.xs-ready').removeAttr("xs-load");
        }, 1200)
        
    }
    ipcRenderer.on("return-meta", (event, arg) => {
        window.TV.meta = arg;
        setTestData(arg);
    })
    ipcRenderer.send('get-test-meta');

    window.TV.enableStart = () => {
        console.debug("Client has been authorized to begin the test.")
        $('.x-t-start').removeClass('disable');
        $('.x-t-start').removeAttr('disabled');
        $('.x-t-start').text('Start This Test');
        try {
            SocketPatch.statusUpd();
        } catch(e) {}
    };
    window.TV.beginStartQue = (time) => {
        console.debug("Creating an instance of Test object")
        let TestBank = window.TV.Test;
        console.debug("Running OVERWATCH initialization");
        let TestState = Overwatch.test(time, window.TV.meta, TestBank);
        window.TestWorker.begin(TestState);
    };
    window.TV.renderTestBank = async (TestCode) => {
        return await Overwatch.Fetch("https://caplet.ryanwans.com/a3/ported/t/gTD/a", "GET", "?testCode="+TestCode);
    }
    window.closeNow = () => {
        var remote = require('electron').remote;
        var w = remote.getCurrentWindow();
        w.close();
    }
}()

$(document).ready(() => {
    document.title = "Test Caplet - Live Viewer";
})