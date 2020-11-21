// TEACHER

let { remote, ipcRenderer, ipcMain } = require('electron');
let Dash = remote.require('./remote/dash.js');

// INIT
-function() {
    document.title = "Test Caplet Teacher - Home";
    window.activePage = 'home';
    window.F = new Object();
    window.pages = {
        "home": '<div class="x-main x-home"> <h1 class="x-title x-name"> Welcome Back, <span id="x-gName"></span> </h1> <h1 class="x-subtitle x-date"></h1> <br> <div class="x-content x-notifications"> <div class="x-content-head"> notifications </div> <div class="x-content-in x-notis"> You have no new notifications. </div> </div> <div class="x-content x-notifications"> <div class="x-content-head"> active tests </div> <div class="x-content-in x-actests"> You have no active tests. </div> </div> <div class="x-content x-notifications"> <div class="x-content-head"> billing period </div> <div class="x-content-in"> Your organization leader has control over billing settings. </div> </div> <div class="x-content x-notifications"> <div class="x-content-head"> help center </div> <div class="x-content-in"> This content divider has been labeled as "Work in Progress". </div> </div></div>',
        "you": '<div class="x-main x-you"> <h1 class="x-title">Manage Your Profile</h1> <h2 class="x-subtitle">your profile is managed by your organization leader</h2> <br> <div class="x-content"> <div class="x-content-head"> profile metadata </div> <div class="x-content-in"> <table> <tr> <th>Name</th> <td id="x-gName"></td> </tr> <tr> <th>Organization  </th> <td id="x-gOrg"></td> </tr> <tr> <th>Created</th> <td id="x-gMade"></td> </tr> <tr> <th>Org. Leader</th> <td id="x-gLead"></td> </tr> <tr> <th>Role</th> <td id="x-gRole"></td> </tr> </table> </div> </div> <div class="x-content"> <div class="x-content-head"> account actions </div> <div class="x-content-in"> <button class="x-button x-inline hover" onclick="window.closeMe();">Logout</button> <button class="x-button x-inline hover" onclick="window.location=\'mailto:caplet.admin@ryanwans.com\'">Contact Support</button> <button class="x-button x-inline hover" onclick="window.alert(\'No update available (latest version).\');">Update Software</button> </div> </div> <div class="x-content"> <div class="x-content-head"> software metadata </div> <div class="x-content-in"> <table> <tr> <th>Version</th> <td>v20-8.1.6a</td> </tr> <tr> <th>Made by  </th> <td>Ryan Wans Development</td> </tr> <tr> <th>License</th> <td>MIT Software License</td> </tr> <tr> <th>Copyright  </th> <td>Copyright © 2020 Ryan Wans Development. All Right Reserved.</td> </tr> </table> </div> </div> </div>',
        "tests": '<div class="x-main x-you"> <h1 class="x-title"> Test Administration </h1> <H1 class="x-subtitle"> Manage, Administer, and Monitor Tests </H1> <br> <div class="x-content x-t-acts"> <div class="x-content-head"> test quick actions </div> <div class="x-content-in"> <button onclick="TestMaker.start()" class="x-button hover">Create New Test</button> <button class="x-button hover">View Reports</button> <button onclick="window.LoadTestList()" class="x-button hover">Refresh Test List</button></div> </div> <div class="x-content x-tests"> <div class="x-content-head"> manage your tests </div> <div class="x-content-in x-test-list">You have no tests. To make a new test, click "Create New Test"</div> </div> </div>',
        "reports": '<div class="x-main x-you"> <h1 class="x-title"> Test Result Reports </h1> <H1 class="x-subtitle"> Analyze and Compare Student Results </H1> <br> <div class="x-content x-tests"> <div class="x-content-head">select test reults </div> <div class="x-content-in x-test-list">You have no tests. To make a new test, visit the "Tests" tab.</div> </div> </div>',
    }
    // get meta
    ipcRenderer.on('return-auth', async (event, arg) => {
        window.F = arg;
        var f = await Dash.Fetch('https://caplet.ryanwans.com/a3/l/q/a/m', 'GET', '?index='+window.F.index+"&auth="+window.F.auth, null)
        window.UserDetails = f;
        window.pageDo["home"]();
    });
    ipcRenderer.send('grab-auth');
}()

window.LoadTestList = async () => {
    window.showLoading(500);
    var f = await Dash.Fetch('https://caplet.ryanwans.com/a3/l/q/a/t/tl', 'GET', '?index='+window.F.index+"&auth="+window.F.auth, null);
    window.TestData = f;
    var i = 0;
    if(f.length == 0 || !f) {
        $('.x-test-list').text('You have no tests. To make a new test, click "Create New Test"');
    } else {
        $(".x-test-list").text("");
        for(i=0; i < f.length; i++) {
            var ops = [
                (f[i].meta.useLive) ? "live" : "live-disabled",
                (f[i].meta.open) ? "lock" : "open",
                (f[i].meta.useLive) ? true : false,
                (f[i].meta.open) ? true : false
            ]
            var fString = '<div class="x-test" id="x-TCODE-'+f[i].code+'">'+
                '<span class="x-test-title">'+f[i].name+'</span>'+
                '<span class="x-test-opts">'+
                '<button onclick="window.testResults(\''+f[i].code+'\')" class="x-test-res">results</button>'+
                '<button '+ops[0].split("-")[1]+' onclick="window.liveTesting(\''+f[i].tuid+'\', '+i+')" class="x-test-'+ops[0]+'">live</button>'+
                '<button onclick="window.'+ops[1]+'Test(\''+f[i].code+'\')" class="x-test-'+ops[1]+'">'+ops[1]+'</button>'+
                '<img src="../hard/dots.svg" class="x-test-more"/>'+
                '</span> '+
                '</div>';
            $('.x-test-list').append(fString);
        }
    }
    console.log("New Test List Rendered");
}

window.showLoading = (duration) => {
    $('.x-master').append("<div class='overlay'><img src='../hard/loading.gif' class='overImg'></div>");
    setTimeout(function() {
        $('.overlay').remove();
    }, duration)
}

window.sP = (target) => {
    try {
        LiveTesting.onExit();
    } catch(e){}
    $('.MASTER').html(window.pages[target]);
    window.pageDo[target]();
}

window.pageDo = {
    "home": () => {
        $('.x-date').text(moment().format('MMMM Do YYYY, h:mm a'));
        $('#x-gName').text(window.UserDetails.name.split(" ")[0]);
    },
    "you": () => {
        var f = window.UserDetails
        $('#x-gName').text(f.name);
        $('#x-gOrg').text(f.org);
        $('#x-gMade').text(moment(new Date(parseInt(f.created))).format("MMM Do YYYY"));
        $('#x-gLead').text(f.orgLeader);
        $('#x-gRole').text(f.role);
    },
    "tests": () => {
        window.LoadTestList();
    },
    "reports": () => {
        window.LoadTestList();
        window.ForgetExtraOptions();
    }
}
window.closeMe = () => {
    var remote = require('electron').remote;
    var w = remote.getCurrentWindow();
    w.close();
}

window.openTest = (code) => {
    window.showLoading(800);
    setTimeout(function() {
        $('#x-TCODE-'+code+" .x-test-open").text("LOCK");
        $('#x-TCODE-'+code+" .x-test-open").addClass('x-test-lock');
        $('#x-TCODE-'+code+" .x-test-open").attr("onclick", "window.lockTest(\""+code+"\")");
        $('#x-TCODE-'+code+" .x-test-open").removeClass('x-test-open');
    }, 600)
    Dash.Fetch('https://caplet.ryanwans.com/a3/ported/t/sTD/state', 'GET', '?code='+code+"&state=open&index="+window.F.index+"&auth="+window.F.auth)
}

window.liveTesting = (tuid, index) => {
    window.showLoading(2200);
    setTimeout(function() {
        LiveTesting.setWindow(".x-main");
        LiveTesting.bgPrc.start(tuid, index);
    },800)
}

window.lockTest = (code) => {
    window.showLoading(800);
    setTimeout(function() {
        $('#x-TCODE-'+code+" .x-test-lock").text("OPEN");
        $('#x-TCODE-'+code+" .x-test-lock").addClass('x-test-open');
        $('#x-TCODE-'+code+" .x-test-lock").attr("onclick", "window.openTest(\""+code+"\")");
        $('#x-TCODE-'+code+" .x-test-lock").removeClass('x-test-lock');
    }, 600)
    Dash.Fetch('https://caplet.ryanwans.com/a3/ported/t/sTD/state', 'GET', '?code='+code+"&state=lock&index="+window.F.index+"&auth="+window.F.auth)
}

window.ForgetExtraOptions = () => {
    setTimeout(function() {
        $('.x-test').addClass('hovrmain')
        $('.x-test-opts').html("<span style='font-size:12px;text-transform:uppercase;position: absolute;right: 13px;top: 8px;'>click to view</span>")
        $('.x-content-in').append("<finetext><b>NOTE: </b>You may have to re-enter your password before viewing reports.</finetext>")
    },500)
}

$(document).ready(() => {
    showLoading(1000);
    $(".MASTER").html(window.pages.home);
    $('.x-date').text(moment().format('MMMM Do YYYY, h:mm a'));
});

function maketag(length) {
    var result           = '';
    var characters       = 'abcdef123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}