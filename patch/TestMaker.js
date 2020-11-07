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
                "use anti-cheating"
            ],
            frames: [
                "<h1 class='x-title'>Draft a New Test</h1><h1 class='x-subtitle'>LOADING TEST MAKER...</h1><div class=\"text-make-form\"> <h3 class=\"xx2-form-above\">TEST NAME</h3> <input onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(1)\" required maxlength=\"32\" class=\"xx2-form-input\" id=\"test-name\" /> <h3 class=\"xx2-form-above\">SHOW TEST QUESTIONS *</h3> <input onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(2)\" required class=\"xx2-form-input\" type=\"number\" max=\"100\" id=\"test-max\" placeholder=\"\" /> <h3 class=\"xx2-form-above\">TIME LIMIT</h3> <input onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(3)\" required class=\"xx2-form-input\" id=\"text-time\" placeholder=\"\" /> <h3 onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(4)\" class=\"xx2-form-above\">LIVE TESTING</h3> <input id=\"live-on\" name=\"uselive\" type=\"radio\"> <label for=\"live-on\">YES</label> <input id=\"live-off\" name=\"uselive\" type=\"radio\"> <label for=\"live-off\">NO</label><h3 class=\"xx2-form-above\" onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(5)\">WINDOW PROTECTION</h3> <input id=\"wp-on\" name=\"usewp\" type=\"radio\"> <label for=\"wp-on\">YES</label> <input id=\"wp-off\" name=\"usewp\" type=\"radio\"> <label for=\"wp-off\">NO</label><xbt onmouseout=\"TestMaker.notip()\" onmouseover=\"TestMaker.showTip(0)\">START CREATING TEST</xbt><finetext>* This is the amount of questions the students will be shown<br>&nbsp;&nbsp;&nbsp;Can't be greater than 100</finetext></div>"
            ],
            footer: "<tmfoot><b>Autosave Status</b>: Waiting...<tooltip><b>TIP: </b><tip></tip></tooltip></tmfoot>",
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
            }
        }
    }

})(() => {
    console.debug("Test Maker is (hopefully) running...!");
});