// ah shit, here we go again... 

let Packer = remote.require('./remote/Packer.js');

// run off da bat!
!(function(bindr) {

    window.TestMaker = window.TestMaker || new Object();

    if(0) {
        console.debug("Test Maker objec already exists. Call .new() to draft a new one");
    } else {
        TestMaker = {
            new: function() {
                TestMaker = new Object();
                // proceed to initialize again
            },
            letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
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
                "delete question",
                "enter prompt for this question",
                "quick save current test"
            ],
            frames: [
                "<h1 class='x-title'>Draft a New Test</h1><h1 class='x-subtitle'>LOADING TEST MAKER...</h1><div class=\"text-make-form\"> <h3 class=\"xx2-form-above\">TEST NAME</h3> <input onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(1)\" required maxlength=\"32\" class=\"xx2-form-input\" id=\"test-name\" /> <h3 class=\"xx2-form-above\">SHOWN TEST QUESTIONS *</h3> <input onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(2)\" required class=\"xx2-form-input\" type=\"number\" max=\"100\" id=\"test-max\" placeholder=\"\" /> <h3 class=\"xx2-form-above\">TIME LIMIT (MINUTES) (IF NONE, DO NOT TOUCH)</h3> <input onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(3)\" required class=\"xx2-form-input\" id=\"text-time\" type=\"number\" value=\"0\" /> <h3 onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(4)\" class=\"xx2-form-above\">LIVE TESTING</h3> <input noshow id=\"live-on\" name=\"uselive\" value=\"1\" type=\"radio\"> <label value=\"1\" for=\"live-on\">YES</label> <input noshow id=\"live-off\" value=\"0\" name=\"uselive\" type=\"radio\"> <label value=\"0\" for=\"live-off\">NO</label><h3 class=\"xx2-form-above\" onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(5)\">WINDOW PROTECTION</h3> <input noshow value=\"1\" id=\"wp-on\" name=\"usewp\" type=\"radio\"> <label value=\"1\" for=\"wp-on\">YES</label> <input noshow value=\"0\" id=\"wp-off\" name=\"usewp\" type=\"radio\"> <label value=\"0\" for=\"wp-off\">NO</label><xbt onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(0)\" onclick=\"TestMaker.beginMaker()\">START CREATING TEST</xbt><finetext>* This is the amount of questions the students will be shown<br>&nbsp;&nbsp;&nbsp;Can't be greater than 100</finetext></div>"
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
                $(window).keypress(function(event) {
                    if((event.ctrlKey || event.metaKey) && event.which == 83) {
                        window.alert("Saved!");
                        event.preventDefault();
                        return false;
                    };
                });
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
            makeCode: (length) => {
                var result           = '';
                var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWRXYZ1234567890';
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
                var Test_Max = parseInt($('#test-max').val());
                if(Test_Name < 1 || Test_Name > 51) {con=false;TestMaker.notification("Show questions should be between 1 and 50");}
                var Test_Time = parseInt($('#text-time').val());
                Test_Time = (Test_Time == 0) ? null : Test_Time;
                var Test_Live = ($('input[name="uselive"]:checked').val() == "1") ? true : false;
                var Test_WP = ($('input[name="usewp"]:checked').val() == "1") ? true : false;
                if(con) {
                    var ttt = TestMaker.makeCode(8);
                    window.TestMakerData = new Object();
                    window.TestMakerData[ttt] = {
                        name: Test_Name,
                        tuid: TestMaker.ID,
                        "meta": {
                            "count": Test_Max,
                            "total": 0,
                            "randomOrder": true,
                            "randomQs": true,
                            "useLive": Test_Live,
                            "open": false,
                            "time": Test_Time,
                            "wProtect": Test_WP
                        }
                    }
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
                // TestMaker.renderQuestionMaker(TestMaker.ActiveQ);
            },
            qMake: (index) => {
                Object.values(TestMaker.TEST.meta)[0].meta.total++;
                TestMaker.QQQINDEX = 0;
                TestMaker.ACTIVE = TestMaker.TEST.bank.length;
                TestMaker.TEST.bank.push({
                    "_id": TestMaker.makeID(16),
                    "_index": TestMaker.TEST.bank.length,
                    "_meta": {
                        "useStreaming": true,
                        "maxAttempts": 1,
                        "maxTime": null,
                        "dualAuth": true
                    },
                    "_data": {
                        "qType": index,
                    }
                })
                TestMaker.autosave();
                TestMaker.enactAutosavePolling();
                var t = [
                    "Multiple Choice, Single Answer",
                    "ERROR",
                    "Drag & Drop",
                    'True or False',
                    "Multiple Choice, Multiple Answers",
                    "Response Slider",
                    "Table Selection"
                ]
                $('maker-chooser').attr('style', "display: none;");
                $('maker-maker').attr("style", "display: block;");
                $('#qTypeSelect').text(t[index]);
                $('#currentPrompt').bind('input propertychange', function() {
                    var t = this.value;
                    TestMaker.TEST.bank[TestMaker.ACTIVE]["_data"]["qValue"] = t;
                });
                $("input[name='makra'][value='0']").on('change', function(){
                    let selected_value = $("input[name='makra']:checked").val();
                    TestMaker.TEST.bank[TestMaker.ACTIVE]["_data"]["qShorthand"] = selected_value;
                    $('#curAns1').text(TestMaker.letters.split("")[selected_value]);
                });
                $('#mkq-0').bind('input propertychange', function() {
                    var t = this.value;
                    var f = this.attributes.ind.value;
                    TestMaker.TEST.bank[TestMaker.ACTIVE]["_data"]["qAns"] = TestMaker.TEST.bank[TestMaker.ACTIVE]["_data"]["qAns"] || {};
                    TestMaker.TEST.bank[TestMaker.ACTIVE]["_data"]["qAns"][f.toString()] = t;
                });
            },
            autosave: () => {
                $('[autosave]').html("saving test <miniloader></miniloader>");
                miniLoader();
                // save code
                var EXPORT = [TestMaker.TEST.meta, TestMaker.TEST.bank, window.F.auth];
                Packer.DataFlushing.RFWR(EXPORT);
                console.debug("Data Flushing & Syncing Completed");

                setTimeout(function() {
                    $('[autosave]').text("saved ✓");
                }, 2300)
            },
            MakerMCA: (index) => {
                TestMaker.QQQINDEX++;
                $('#makra-'+index).append("<input class=\"makra-mch\" ind=\""+TestMaker.QQQINDEX+"\" id=\"mkq-"+TestMaker.QQQINDEX+"\" maxlength=\"45\" type=\"text\" placeholder=\"type here...\" ><makra-mcht><input name=\"makra\" value=\""+TestMaker.QQQINDEX+"\" type=\"radio\"></makra-mcht>")
                $('#mkq-'+TestMaker.QQQINDEX).bind('input propertychange', function() {
                    var t = this.value;
                    var f = this.attributes.ind.value;
                    TestMaker.TEST.bank[TestMaker.ACTIVE]["_data"]["qAns"] = TestMaker.TEST.bank[TestMaker.ACTIVE]["_data"]["qAns"] || {};
                    TestMaker.TEST.bank[TestMaker.ACTIVE]["_data"]["qAns"][f.toString()] = t;
                });
                $("input[name='makra'][value='"+TestMaker.QQQINDEX+"']").on('change', function(){
                    let selected_value = $("input[name='makra']:checked").val();
                    TestMaker.TEST.bank[TestMaker.ACTIVE]["_data"]["qShorthand"] = selected_value;
                    $('#curAns1').text(TestMaker.letters.split("")[selected_value]);
                });
            },
            enactAutosavePolling: () => {
                TestMaker.AUTOSAVE_POLL = setInterval(function() {
                    TestMaker.autosave();
                }, 60000);
            }
        }
    }

})(() => {
    console.debug("Test Maker is (hopefully) running...!");
});