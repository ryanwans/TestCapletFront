// ah shit, here we go again... 

// run off da bat!
!(function(bindr) {

    window.TestMaker = window.TestMaker || new Object();

    if(Object.keys(TestMaker).length > 0) {
        console.debug("Test Maker objec already exists. Call .new() to draft a new one");
    } else {
        TestMaker = {
            new: function() {
                TestMaker = new Object();
                // proceed to initialize again
            },
            tips: [
                "Start making the test",
                "Name of the test",
                "Amount students will see",
                "add a time limit",
                "use live testing",
                "use anti-cheating",
                "view this question",
                "add a new question",
                "change test settings",
                "delete question"
            ],
            frames: [
                "<h1 class='x-title'>Draft a New Test</h1><h1 class='x-subtitle'>LOADING TEST MAKER...</h1><div class=\"text-make-form\"> <h3 class=\"xx2-form-above\">TEST NAME</h3> <input onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(1)\" required maxlength=\"32\" class=\"xx2-form-input\" id=\"test-name\" /> <h3 class=\"xx2-form-above\">SHOWN TEST QUESTIONS *</h3> <input onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(2)\" required class=\"xx2-form-input\" type=\"number\" max=\"100\" id=\"test-max\" placeholder=\"\" /> <h3 class=\"xx2-form-above\">TIME LIMIT (MINUTES) (IF NONE, DO NOT TOUCH)</h3> <input onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(3)\" required class=\"xx2-form-input\" id=\"text-time\" type=\"number\" value=\"0\" /> <h3 onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(4)\" class=\"xx2-form-above\">LIVE TESTING</h3> <input id=\"live-on\" name=\"uselive\" value=\"1\" type=\"radio\"> <label value=\"1\" for=\"live-on\">YES</label> <input id=\"live-off\" value=\"0\" name=\"uselive\" type=\"radio\"> <label value=\"0\" for=\"live-off\">NO</label><h3 class=\"xx2-form-above\" onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(5)\">WINDOW PROTECTION</h3> <input  value=\"1\" id=\"wp-on\" name=\"usewp\" type=\"radio\"> <label value=\"1\" for=\"wp-on\">YES</label> <input value=\"0\" id=\"wp-off\" name=\"usewp\" type=\"radio\"> <label value=\"0\" for=\"wp-off\">NO</label><xbt onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(0)\" onclick=\"TestMaker.beginMaker()\">START CREATING TEST</xbt><finetext>* This is the amount of questions the students will be shown<br>&nbsp;&nbsp;&nbsp;Can't be greater than 100</finetext></div>"
            ],
            footer: "<tmfoot><b>Autosave Status</b>: <span autosave>Waiting</span><tooltip><b>TIP: </b><tip></tip></tooltip></tmfoot>",
            start: () => {
                showLoading(800);
                $('.x-main').html("<div class='testmaker'></div>");
                TestMaker.frame(0);
                $('.MASTER').append(TestMaker.footer);
                setTimeout(function() {
                    TestMaker.ID = TestMaker.makeID(20);
                    $('.x-subtitle').text("UNIQUE ID: "+TestMaker.ID);
                },2500);
            },
            frame: (a) => {$('.testmaker').html(TestMaker.frames[a])},
            showTip: (n) => {
                $('tip').text(TestMaker.tips[n]);
            },
            notip: () => {$('tip').text("");},
            makeID: (length) => {
                var result           = '';
                var characters       = 'abcdef1234567890';
                var charactersLength = characters.length;
                for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            },
            beginMaker: () => {
                var con = true;
                var Test_Name = $('#test-name').val();
                if(Test_Name.length < 5) {con=false;TestMaker.notification("The test name should be longer than 5 characters.");}
                var Test_Max = parseInt($('#text-max').val());
                if(Test_Name < 1 || Test_Name > 51) {con=false;TestMaker.notification("Show questions should be between 1 and 50");}
                var Test_Time = parseInt($('#text-time').val());
                Test_Time = (Test_Time == 0) ? null : Test_Time;
                var Test_Live = ($('input[name="uselive"]:checked').val() == "1") ? true : false;
                var Test_WP = ($('input[name="usewp"]:checked').val() == "1") ? true : false;
                if(con) {
                    window.TestMakerData = {
                        name: Test_Name,
                        max: Test_Max,
                        time: Test_Time,
                        live: Test_Time,
                        wp: Test_WP,
                        id: TestMaker.ID,
                        auth: window.F.auth,
                        created: Date.now()
                    };
                    showLoading(1500);
                    $('[autosave]').text("waiting");
                    $('tip').text("");
                    $('.testmaker').html("");
                    TestMaker.LAUNCH_MAKER(window.TestMakerData);
                }
            },
            notification: (a) => {window.alert("Note from TestMaker: " + a);},
            LAUNCH_MAKER: (STATE) => {
                $('.tmn').attr('style', 'display: block;');
                TestMaker.TEST = new Object();
                TestMaker.TEST.meta = STATE;
                TestMaker.TEST.bank = new Array();
                TestMaker.ActiveQ = 0;
                TestMaker.renderQuestionMaker(TestMaker.ActiveQ);
            }
        }
    }

})(() => {
    console.debug("Test Maker is (hopefully) running...!");
});