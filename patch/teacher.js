// TEACHER
 
// INIT
-function() {
    document.title = "Test Caplet Teacher - Home";
    window.activePage = 'home';
    window.F = new Object();
    window.pages = {
        "home": '<div class="x-main x-home"> <h1 class="x-title x-name"> Welcome Back, <span id="x-gName"></span> </h1> <h1 class="x-subtitle x-date"></h1> <br> <div class="x-content x-notifications"> <div class="x-content-head"> notifications </div> <div class="x-content-in x-notis"> You have no new notifications. </div> </div> <div class="x-content x-notifications"> <div class="x-content-head"> active tests </div> <div class="x-content-in x-actests"> You have no active tests. </div> </div> <div class="x-content x-notifications"> <div class="x-content-head"> billing period </div> <div class="x-content-in"> Your organization leader has control over billing settings. </div> </div> <div class="x-content x-notifications"> <div class="x-content-head"> help center </div> <div class="x-content-in"> This content divider has been labeled as "Work in Progress". </div> </div></div>',
        "you": '<div class="x-main x-you"> <h1 class="x-title">Manage Your Profile</h1> <h2 class="x-subtitle">your profile is managed by your organization leader</h2> <br> <div class="x-content"> <div class="x-content-head"> profile metadata </div> <div class="x-content-in"> <table> <tr> <th>Name</th> <td id="x-gName"></td> </tr> <tr> <th>Organization  </th> <td id="x-gOrg"></td> </tr> <tr> <th>Created</th> <td id="x-gMade"></td> </tr> <tr> <th>Org. Leader</th> <td id="x-gLead"></td> </tr> <tr> <th>Role</th> <td id="x-gRole"></td> </tr> </table> </div> </div> <div class="x-content"> <div class="x-content-head"> account actions </div> <div class="x-content-in"> <button class="x-button x-inline hover" onclick="window.closeMe();">Logout</button> <button class="x-button x-inline hover" onclick="window.location=\'mailto:caplet.admin@ryanwans.com\'">Contact Support</button> <button class="x-button x-inline hover">Update Software</button> </div> </div> <div class="x-content"> <div class="x-content-head"> software metadata </div> <div class="x-content-in"> <table> <tr> <th>Version</th> <td>v20-8.1.6a</td> </tr> <tr> <th>Made by  </th> <td>Ryan Wans Development, Jack Woods</td> </tr> <tr> <th>License</th> <td>MIT Software License</td> </tr> <tr> <th>Copyright  </th> <td>Copyright © 2020 Ryan Wans Development. All Right Reserved.</td> </tr> </table> </div> </div> </div>',
        "tests": '<div class="x-main x-you"> <h1 class="x-title"> Test Administration </h1> <H1 class="x-subtitle"> Manage, Administer, and Monitor Tests </H1> <br> <div class="x-content x-t-acts"> <div class="x-content-head"> test quick actions </div> <div class="x-content-in"> <button class="x-button">Create New Test</button> <button class="x-button">View Reports</button> </div> </div> <div class="x-content x-tests"> <div class="x-content-head"> manage your tests </div> <div class="x-content-in"> <div class="x-test"> <span class="x-test-title"> AP Computer Science Exam </span> <span class="x-test-opts"> <button class="x-test-res">results</button> <button class="x-test-live">live</button> <button class="x-test-open">open</button> <img src="../hard/dots.svg" class="x-test-more"/> </span> </div> </div> </div> </div>',
    }
    // get meta
    let { remote, ipcRenderer, ipcMain } = require('electron');
    let Dash = remote.require('./remote/dash.js');
    ipcRenderer.on('return-auth', async (event, arg) => {
        window.F = arg;
        var f = await Dash.Fetch('https://caplet.ryanwans.com/a3/l/q/a/m', 'GET', '?index='+window.F.index+"&auth="+window.F.auth, null)
        window.UserDetails = f;
        window.pageDo["home"]();
    });
    ipcRenderer.send('grab-auth');
}()

window.sP = (target) => {
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
    }
}
window.closeMe = () => {
    var remote = require('electron').remote;
    var w = remote.getCurrentWindow();
    w.close();
}

$(document).ready(() => {
    $(".MASTER").html(window.pages.home);
    $('.x-date').text(moment().format('MMMM Do YYYY, h:mm a'));
});