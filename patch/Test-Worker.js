window.TestWorker = {
    active: 0,
    wpFire: false,
    submit: false,
    hintShown: false,
    AnswerBank: new Object(),
    begin: (Test) => {
        window.TestWorker.QuestionBank = Test.shuffle(Test.bank);
        window.TestWorker.pro = Test.metadata.meta.meta.wProtect
        window.TestWorker.total = Test.count;
        window.TestWorker.useWP = Test.metadata.meta.meta.wProtect;
        window.TestWorker.live = Test.metadata.meta.meta.useLive;
        window.TestWorker.startTime = Test.metadata.start;
        if(Test.endTime) {
            window.TestWorker.endTime = Test.endTime;
        }
        var Addition = (Test.metadata.meta.meta.wProtect) ? "This test uses Window Protection. Once you start, you cannot click away until you submit or your test will be locked.<br><br>": ""
        console.debug("Prompting user for start...")
        window.TestWorker.alert(
            "Test Caplet Alert",
            Addition+"Are you sure you want to start this test? Once you start this test, you cannot start it again unless your teacher unlocks it for you.",
            window.TestWorker.start,
            "Start"
        );
    },
    start: () => {
        console.debug("Starting test! Yay!!!!");
        window.TV.state = "testing";
        if(TestWorker.live) {
            SocketPatch.statusUpd();
        }
        window.FAR.selfClose();
        var Prot = new Protector((json) => {
            try {
                clearInterval(window.TIMER);
            } catch(e) {}
            TestWorker.lockTest();
        })
        if(TestWorker.useWP) {
            Prot.start();
            window.TestWorker.breaker = Prot.break;
            console.debug("Window Protection has started");
        } else {
            console.debug("Bypassing window protection (disabled?)");
        }
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
        if(TestWorker.live) {
            SocketPatch.statusUpd();
        }
    },
    prev: function() {
        TestWorker.active--;
        TestWorker.displayQuestion(TestWorker.active);
        if(TestWorker.live) {
            SocketPatch.statusUpd();
        }
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
            TestWorker.displayAnswers(q);
            TestWorker.RefAnswer(q.questionIndex, (q.questionType == 4));

        }
    },
    displayAnswers: (q) => {
        console.debug("Drafting new Answer HTML for type: " + TestWorker.qtype.split("!!")[q.questionType]);
        var Q = "<AnswerBank>";

        var qType = q.questionType, qOpts = q.questionOptions, qInd = q.questionIndex;
        var mChoice = 'A B C D E F G H I J K L M N O P';

        if(qType == 0) {
            // multiple choice, single answer
            // max answer length: 110 characters total
            Q = Q + "<MultipleChoice class='x-own' singleanswer xl='"+Object.keys(qOpts).length+"'>"
            for(let i=0; i < Object.keys(qOpts).length; i++) {
                Q = Q + "<mchoice class='x-opt' onclick='window.TestWorker.dispatchAnswer("+qInd+", "+i+")' id='index"+i+"'><mind>"+mChoice.split(" ")[i]+"</mind><mans>"+Object.values(qOpts)[i]+"</mans></mchoice>";
            }
            Q = Q + "</MultipleChoice>"
        } else if(qType == 1) {
            // matching
            Q = Q + "This question type is no longer supported, please skip this question.<br>You will be awarded a full point for this question.";
            TestWorker.AnswerBank[qInd] = true;
        } else if(qType == 2) {
            // fill in the blank
            Q = Q + "<FillBlank ind='"+qInd+"'>"
            // set word bank - field set
            Q = Q + "<fieldset><legend>WORD BANK</legend>"
            for(let i=0; i<qOpts.values.length; i++) {
                Q = Q + "<xword draggable='true' ondragstart='TestWorker.onDrag(event, "+i+")' class='word noselect' id='drag"+i+"' index='"+i+"' value='"+qOpts.values[i]+"'>"+qOpts.values[i]+"</xword>";
            }
            Q = Q + "</fieldset>"
            // set fillable sentences
            Q = Q + "<fillable>"
            for(let i=0; i<qOpts.keys.length; i++) {
                var f = qOpts.keys[i];
                f = f.replace('::$', '<filler ondrop="TestWorker.onDrop(event, '+i+')" ondragover="TestWorker.allowDrop(event)" index="'+i+'"></filler>');
                f = (i+1) + ". "+f;
                Q = Q + "<fillSent class='noselect'>"+f+"</fillSent>";
            }
            Q = Q + "</fillable>"

            Q = Q + "</FillBlank>"
        } else if(qType == 3) {
            // true or false
            Q = Q + "<MultipleChoice class='x-own' singleanswer xl='2'><mtf class='x-opt' onclick='window.TestWorker.dispatchAnswer("+qInd+", 1)' id='index1'><mid>TRUE</mid></mtf><mtf class='x-opt' onclick='window.TestWorker.dispatchAnswer("+qInd+", 0)' id='index0'><mid>FALSE</mid></mtf></MultipleChoice>"
        } else if(qType == 4) {
            // multiple choice, mulitple answers
            // max answer length: 110 characters total
            Q = Q + "<MultipleChoice class='x-own' multianswer xl='"+Object.keys(qOpts).length+"'>"
            for(let i=0; i < Object.keys(qOpts).length; i++) {
                Q = Q + "<mchoice class='x-opt' onclick='window.TestWorker.dispatchAnswer("+qInd+", "+i+", true)' id='index"+i+"'><mind>"+mChoice.split(" ")[i]+"</mind><mans>"+Object.values(qOpts)[i]+"</mans></mchoice>";
            }
            Q = Q + "</MultipleChoice>"
        } else if(qType == 5) {
            // choice slider
            // max answer length: 15 characters total
            Q = Q + "<Slider><SlideText>"+qOpts[0]+"</SlideText><SlideText>"+qOpts[1]+"</SlideText><SlideText>"+qOpts[2]+"</SlideText><SlideText>"+qOpts[3]+"</SlideText><br><input ind="+qInd+" type='range' class='x-slide' step='33.3'></Slider>"
        } else if(qType == 6) {
            // table selection ;(
            Q = Q + "<SelectTable><table class='x-table' ind='"+qInd+"' len='"+qOpts.R.length+"'>"
            // table headers
            Q = Q + "<tr><th class='x-td'></th>";
            for(let i=0; i<qOpts.C.length; i++) {
                Q = Q + "<th class='x-td'>"+qOpts.C[i]+"</th>"
            }
            Q = Q + "</tr>";
            // table rows
            for(let i=0; i<qOpts.R.length; i++) {
                Q = Q + "<tr>";
                Q = Q + "<td class='x-td'>"+qOpts.R[i]+"</td>";
                for(let r=0; r<qOpts.C.length; r++) {
                    Q = Q + "<td class='x-td'><input rwx='test' type='radio' class='x-row-input' name='row"+i.toString()+"' value='__"+r.toString()+"'><span class='x-radio'></td>";
                }
                Q = Q + "</tr>";
            }
            Q = Q + "</table></SelectTable>"
        }
        

        Q = Q + "</AnswerBank>"
        console.debug("Answer HTML Created");
        $('.repl-target').append(Q);
        if(qType == 5) {
            var index = $('.x-slide').attr('ind');
            TestWorker.AnswerBank[index] = TestWorker.AnswerBank[index] || 2;
            $(".x-slide").attr('value',Math.floor(TestWorker.AnswerBank[index]*33.3));
            console.log(TestWorker.AnswerBank)
            $(".x-slide").change(function() {
                var ans = $(this).val();
                ans = Math.floor((ans/100)*4);
                var index = $('.x-slide').attr('ind');
                TestWorker.AnswerBank[index] = ans;
                console.log(TestWorker.AnswerBank);
            });
        } else if (qType == 6) {
            var index = $('.x-table').attr('ind');
            var length = $('.x-table').attr('len');
            if(TestWorker.AnswerBank[index]) {
                for(let g=0; g<TestWorker.AnswerBank[index].length; g++) {
                    $('input[name=row'+g+"][value=__"+TestWorker.AnswerBank[index][g]+"]").prop("checked", true);
                }
            }
            TestWorker.AnswerBank[index] = TestWorker.AnswerBank[index] || new Array(length).fill(0) 
            console.log(TestWorker.AnswerBank);
            $('input[type=radio][rwx=test]').change((elm) => {
                var ans = $(elm.target).val();
                ans = parseInt(ans.split("__")[1]);

                var ind = $(elm.target).attr('name');
                ind = parseInt(ind.split("row")[1]);
                
                TestWorker.AnswerBank[index][ind] = ans;
                console.log(TestWorker.AnswerBank);
            });
        } else if(qType == 2) {
            var index = $('fillblank').attr('ind');
            TestWorker.AnswerBank[index] = TestWorker.AnswerBank[index] || {};
        }
    },
    removeValue: function(arr, v) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax= arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    },
    dispatchAnswer: (QuestionIndex, AnswerIndex, UseMult) => {
        if(!UseMult) {
            TestWorker.AnswerBank[QuestionIndex] = AnswerIndex;
        } else {
            TestWorker.AnswerBank[QuestionIndex] = TestWorker.AnswerBank[QuestionIndex] || [];
            if(TestWorker.AnswerBank[QuestionIndex].includes(AnswerIndex)) {
                var index = TestWorker.AnswerBank[QuestionIndex].indexOf(AnswerIndex);
                TestWorker.AnswerBank[QuestionIndex].splice(index, 1);
            } else {
                TestWorker.AnswerBank[QuestionIndex].push(AnswerIndex);
            }
        }
        console.log(TestWorker.AnswerBank);
        TestWorker.RefAnswer(QuestionIndex, UseMult);
    },
    RefAnswer: (Index, MULT) => {
        try {
            $('.x-own .x-opt').removeClass('x-a-selected')
            if(!MULT) {
                var ans = TestWorker.AnswerBank[Index];
                $('#index'+ans).addClass('x-a-selected');
            } else {
                var ans = TestWorker.AnswerBank[Index];
                for(let i=0; i<ans.length; i++) {
                    $('#index'+ans[i]).addClass('x-a-selected');
                }
            }
            
        } catch(e) {

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
    qtype: "Multiple Choice, Single Answer!!Matching!!Fill In The Blank!!True or False!!Multiple Choice, Multiple Answers!!Choice Slider!!Table Selection",
    timeExpired: () => {
        clearInterval(window.TIMER);
        clearInterval(window.UpdatePolling);
        TestWorker.submitTest();
        TestWorker.alert("Test Caplet Alert", "Your test has been automatically submitted because the alotted testing time has expired.");
    },
    submitTest: async () => {
        TestWorker.submitTime = Date.now();
        // window.TestWorker.breaker();
        TestWorker.submit = true;
        console.debug("Test is being submitted...");
        clearInterval(window.TIMER);
        clearInterval(window.UpdatePolling);
        if(TestWorker.live) {
            TV.state = "submitted";
            SocketPatch.statusUpd();
            SocketPatch.close();
            console.debug("Socket has been closed. Test submitted successfully.");
        }
        $('.dateNow').html("test was submitted");
        $('.x-n-center').text("Completed");
        $('.x-foot').addClass('x-o-block');
        $('.repl-target').html("<x-t-big>Your Test Has Been Submitted</x-t-big><x-t-sub>The application will close in 60 seconds</x-t-sub><br><table class='x-pre-table'><tr><th>Your Grade</th><td id='hot-grade'>Grading Test...</td></tr><tr><th>Questions Answered&nbsp;&nbsp;&nbsp;</th><td id='hot-qs'>loading...</td></tr><tr><th>Time Spent</th><td id='hot-time'>loading...</td></tr></table><x-informatic class='x-i-live x-i-noset'><b>TESTING INFORMATION</b><ixr> </ixr>If your teacher has immediate grading enable, your grade should appear above.</x-informatic>")
        $('#hot-time').text((((TestWorker.submitTime - TestWorker.startTime)/1000)<<0) + " seconds");
        $('#hot-qs').text(Object.keys(TestWorker.AnswerBank).length +" of "+TestWorker.total+" Answered");
        TestWorker.SCORE = await TestWorker.grabGrade(TestWorker.AnswerBank);
        $('#hot-grade').text(TestWorker.SCORE.formatted);
        setTimeout(function() {
            var remote = require('electron').remote;
            var w = remote.getCurrentWindow();
            w.close();
        }, 60000);
    },
    lockTest: () => {
        TestWorker.wpFire = true;
        TestWorker.submitTime = Date.now();
        console.debug("Test has been locked. Beginning lock que...")
        clearInterval(window.TIMER);
        clearInterval(window.UpdatePolling);
        if(TestWorker.live) {
            TV.state = "locked";
            SocketPatch.statusUpd();
        }
        TestWorker.wpFire = true;
        $('.dateNow').html("test was locked");
        $('.x-n-center').text("Locked");
        $('.x-foot').addClass('x-o-block');
        $('.repl-target').html("<x-t-big>Your Test Has Been Locked</x-t-big><x-t-sub>You clicked away from the window during the test</x-t-sub><br><table class='x-pre-table'><tr><th>Lock Status</th><td id='hot-grade'><i>null</i></td></tr><tr><th>Test Progress&nbsp;&nbsp;&nbsp;</th><td id='hot-qs'>progress stored</td></tr><tr><th>Time Spent</th><td id='hot-time'>loading...</td></tr></table><x-informatic class='x-i-live x-i-noset'><b>TESTING INFORMATION</b><ixr> </ixr>Your teacher has the availability to unlock your test and they can see that you have been locked out.</x-informatic>")
        $('#hot-time').text((((TestWorker.submitTime - TestWorker.startTime)/1000)<<0) + " seconds");
        $('#hot-qs').text(Object.keys(TestWorker.AnswerBank).length +" of "+TestWorker.total+" Answered");
        // pain, i live in pain, this is pain. pain.
        // a short poem, by ryan wans :( 
    },
    startTimer: () => {
        window.TIMER = setInterval(function() {
            TestWorker.ifFinish();
            time = (((TestWorker.endTime - Date.now())/1000)<<0);
            if(time == 0) { TestWorker.timeExpired();} else {
                if(time > 60) {time = Math.round(time/60) + " minutes </b>"} else {time = time + " seconds </b>"}
                $('.dateNow').html("Time Remaining: <b>" + time);
            }
        }, 1000);
    },
    allowDrop: (event) => {
        event.preventDefault();
    },
    onDrag: (event, ind) => {
        event.dataTransfer.setData("Value",event.target.id);
        event.dataTransfer.setData("Index", ind)
    },
    onDrop: (event, ind) => {
        event.preventDefault();
        var index = $('fillblank').attr('ind');
        var data = event.dataTransfer.getData("Value");
        event.target.parentNode.replaceChild(document.getElementById(data), event.target);
        document.getElementById(data).className = "";
        TestWorker.AnswerBank[index][ind] = event.dataTransfer.getData("Index");
        console.log(TestWorker.AnswerBank)
    },
    ifFinish: () => {
        if(Object.keys(TestWorker.AnswerBank).length == TestWorker.total && !TestWorker.hintShown) {
            console.debug("All questions answered, unlocked submit button");
            $('.x-t-submit').removeClass('disable');
            $('.x-t-submit').removeAttr('disabled');
                $('.x-hint').removeClass('x-o-block');
                setTimeout(function() {
                    $('.x-hint').addClass('x-o-block');
                    
                }, 10000);
            TestWorker.hintShown = true;
        } 
        return !1;
    },
    userSubmit: () => {
        TestWorker.tempBank = TestWorker.AnswerBank;
        clearInterval(window.TIMER);
        clearInterval(window.CLOCK);
        TestWorker.submitTest();
    },
    grabGrade: async (Answers) => {
        Answers = btoa(JSON.stringify(Answers));
        let FetchHead = remote.require('./remote/Overwatch.js');

        var final = {
            tuid: window.TV.meta.tuid,
            name: btoa(window.TV.meta.studentName.replaceAll(' ', '').toLowerCase()),
            now: Date.now(),
            data: Answers
        }

        var backwards = await FetchHead.Fetch('https://caplet.ryanwans.com/a3/ported/qgr/enco/new/now/result=json', 'POST', '', JSON.stringify(final));
        backwards = backwards[0]
        var ret = {
            percent: (Math.round((parseInt(backwards)/TestWorker.total)*100)),
            raw: parseInt(backwards),
        };
        ret['formatted'] = backwards + " of " + TestWorker.total + " Correct ("+ret.percent+"%)";

        await TestWorker.wait(1000);

        return ret;
    },
    wait: async (a) => {setTimeout(()=>{}, a)}
}