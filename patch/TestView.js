// TEST VIEWER
let { remote, ipcRenderer, ipcMain } = require('electron');
let Overwatch = remote.require('./remote/Overwatch.js');

window.TV = new Object();

!function() {
    // Set Necessary Values
    window.TV.state = 'pre';

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
            $('.x-i-live').removeClass('x-o-hide')
        }
        window.CLOCK = setInterval(function() {
            $('.dateNow').text(moment().format('MMM Do YYYY, h:mm:ss a'));
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
        } else {}

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
        console.log("Test -> Main: test is now unlocked.")
        $('.x-t-start').removeClass('disable');
        $('.x-t-start').removeAttr('disabled');
        $('.x-t-start').text('Start This Test');
        SocketPatch.statusUpd();
    };
    window.TV.beginStartQue = (time) => {
        let TestBank = window.TV.Test;
        let TestState = Overwatch.test(time, window.TV.meta, TestBank);
        window.TestWorker.begin(TestState);
    };
    window.TV.renderTestBank = async (TestCode) => {
        return await Overwatch.Fetch("https://caplet.ryanwans.com/a3/ported/t/gTD/a", "GET", "?testCode="+TestCode);
    }
}()

$(document).ready(() => {
    document.title = "Test Caplet - Live Viewer";
})