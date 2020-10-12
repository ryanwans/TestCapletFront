// TEST VIEWER
let { remote, ipcRenderer, ipcMain } = require('electron');
let Overwatch = remote.require('./remote/Overwatch.js');

window.TV = new Object();

!function() {
    // Set Necessary Values
    window.TV.state = 'pre';

    // Get Test Meta Data
    var setTestData = (data) => {
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
        }, 1000)
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
    };
    window.TV.beginStartQue = (time) => {
        let TestBank = [];
        let TestState = Overwatch.test(time, window.TV.meta, TestBank);
        window.TestWorker.begin(TestState);
    }
}()

$(document).ready(() => {
    document.title = "Test Caplet - Live Viewer"
    setTimeout(() => {
        window.TV.enableStart();
    }, 5000);
})