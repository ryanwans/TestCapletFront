// INIT SCRIPT

// init process goes here
-function() {
    document.title = "Test Caplet - Live";
    $('.xx2-error-t').hide();
    $('.xx2-error-s').hide();
}()
// post init goes here
-function() {
    console.log("init process has finished");
    setTimeout(function() {
        fifo('#xx2-fadeout', '#xx2-fadein');
    }, 3000)
}();
