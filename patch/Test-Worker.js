window.TestWorker = {
    active: 0,
    wpFire: false,
    submit: false,
    begin: (Test) => {
        window.TestWorker.QuestionBank = Test.shuffle(Test.bank);
        window.TestWorker.pro = Test.metadata.meta.meta.wProtect
        window.TestWorker.total = Test.count;
        window.TestWorker.startTime = Test.metadata.start;
        if(Test.endTime) {
            window.TestWorker.endTime = Test.endTime;
        }
        var Addition = (Test.metadata.meta.meta.wProtect) ? "This test uses Window Protection. Once you start, you cannot click away until you submit or your test will be locked.<br><br>": ""
        window.TestWorker.alert(
            "Test Caplet Alert",
            Addition+"Are you sure you want to start this test? Once you start this test, you cannot start it again unless your teacher unlocks it for you.",
            window.TestWorker.start,
            "Start"
        );
    },
    start: () => {
        window.TV.state = "testing";
        SocketPatch.statusUpd();
        window.FAR.selfClose();
        var Prot = new Protector((json) => {
            try {
                clearInterval(window.TIMER);
            } catch(e) {}
            TestWorker.lockTest();
        })
        Prot.start();
        if(TestWorker.endTime) {
            clearInterval(window.CLOCK);
            TestWorker.startTimer();
        }
        TestWorker.showFooter();
        TestWorker.setHeader();
        $('.repl-target').html("");
        window.TestWorker.displayQuestion(TestWorker.active);
    },
    next: function() {
        TestWorker.active++;
        TestWorker.displayQuestion(TestWorker.active);
        SocketPatch.statusUpd();
    },
    prev: function() {
        TestWorker.active--;
        TestWorker.displayQuestion(TestWorker.active);
        SocketPatch.statusUpd();
    },
    displayQuestion: (targetIndex) => {
        if(targetIndex >= window.TestWorker.QuestionBank.length || targetIndex < 0) {
            if(targetIndex < 0) {
                TestWorker.active = 0;
            } else {
                TestWorker.active = window.TestWorker.QuestionBank.length-1;
            }
            return false;
        } else {
            TestWorker.setHeader();
            var q = window.TestWorker.QuestionBank[targetIndex];
            var qHead = "<QuestionHead>"+q.questionValue+"</QuestionHead>";
            var qType = "<QuestionType>Response Type: "+TestWorker.qtype.split("!!")[q.questionType]+"</QuestionType>";

            var finalQuestionHTML = qHead+qType;
            $('.repl-target').html(finalQuestionHTML);
        }
    },
    alert: (title, text, bypass, btxt) => {
        window.TestWorker.ALERT_TEMP_FUNCTION = bypass;
        var buttons;
        if(bypass) {
            buttons = [
                {
                    name: btxt,
                    func:  "window.TestWorker.ALERT_TEMP_FUNCTION()"
                },
                {
                    name: 'Cancel',
                    func: "window.FAR.selfClose()"
                }
            ]
        } else {
            buttons = [
                {
                    name: 'Cancel',
                    func: "window.FAR.selfClose()"
                }
            ]
        }
        var options = {
            moveable: false,
            title: title,
            html: text,
            jQuery: false,
            pageBlur: true,
            escapeKey: false,
            buttons: buttons
        }
        var Alert = new FAR.popup(options);
        Alert.hoist();
    },
    setHeader: () => {
        $('.x-n-center').text("Question "+ (TestWorker.active+1) +" of " + TestWorker.total);
    },
    showFooter: () => {
        $('.x-foot').removeClass('x-o-block');
    },
    qtype: "Multiple Choice, Single Answer!!Matching!!Fill In The Blank!!True or False!!Multiple Choise, Multiple Answers!!Choice Slider!!Table Selection",
    timeExpired: () => {
        clearInterval(window.TIMER);
        clearInterval(window.UpdatePolling);
        TestWorker.submitTest();
        TestWorker.alert("Test Caplet Alert", "Your test has been automatically submitted because the alotted testing time has expired.");
    },
    submitTest: () => {
        TestWorker.submitTime = Date.now();
        clearInterval(window.TIMER);
        clearInterval(window.UpdatePolling);
        SocketPatch.testSubmit();
        $('.dateNow').html("test was submitted");
        $('.x-n-center').text("Completed");
        $('.x-foot').addClass('x-o-block');
        $('.repl-target').html("<x-t-big>Your Test Has Been Submitted</x-t-big><x-t-sub>You may now quit the application</x-t-sub><br><table class='x-pre-table'><tr><th>Your Grade</th><td id='hot-grade'><i>Grading Disabled</i></td></tr><tr><th>Questions Answered&nbsp;&nbsp;&nbsp;</th><td id='hot-qs'>loading...</td></tr><tr><th>Time Spent</th><td id='hot-time'>loading...</td></tr></table><x-informatic class='x-i-live x-i-noset'><b>TESTING INFORMATION</b><ixr> </ixr>If your teacher has immediate grading enable, your grade should appear here.</x-informatic>")
        $('#hot-time').text((((TestWorker.submitTime - TestWorker.startTime)/1000)<<0) + " seconds");
    },
    lockTest: () => {
        TestWorker.submitTime = Date.now();
        clearInterval(window.TIMER);
        clearInterval(window.UpdatePolling);
        SocketPatch.testSubmit('locked');
        TestWorker.wpFire = true;
        $('.dateNow').html("test was locked");
        $('.x-n-center').text("Locked");
        $('.x-foot').addClass('x-o-block');
        $('.repl-target').html("<x-t-big>Your Test Has Been Locked</x-t-big><x-t-sub>You clicked away from the window during the test</x-t-sub><br><table class='x-pre-table'><tr><th>Lock Status</th><td id='hot-grade'><i>null</i></td></tr><tr><th>Test Progress&nbsp;&nbsp;&nbsp;</th><td id='hot-qs'>progress stored</td></tr><tr><th>Time Spent</th><td id='hot-time'>loading...</td></tr></table><x-informatic class='x-i-live x-i-noset'><b>TESTING INFORMATION</b><ixr> </ixr>Your teacher has the availability to unlock your test and they can see that you have been locked out.</x-informatic>")
        $('#hot-time').text((((TestWorker.submitTime - TestWorker.startTime)/1000)<<0) + " seconds");

    },
    startTimer: () => {
        window.TIMER = setInterval(function() {
            time = (((TestWorker.endTime - Date.now())/1000)<<0);
            if(time == 0) { TestWorker.timeExpired();} else {
                if(time > 60) {time = Math.round(time/60) + " minutes </b>"} else {time = time + " seconds </b>"}
                $('.dateNow').html("Time Remaining: <b>" + time);
            }
        }, 1000);
    }
}