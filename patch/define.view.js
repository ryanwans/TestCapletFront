function fifo(t1, t2) {
    $(t1).toggleClass('slideShowOut');
    setTimeout(function() {
        $(t2).toggleClass('slideShowIn');
    }, 300);
    setTimeout(function() {
        $(t2).removeAttr('id');
        $(t1).removeAttr('id');
    }, 2000);
}
function fo(t1) {
    $(t1).toggleClass('xx2-mainout')
    $(t1).toggleClass('mainOut');
}
function fi(t1) {
    $(t2).toggleClass('xx2-mainin')
    $(t2).toggleClass('mainIn');
}
window.Login = new Object();
window.Login['teacher'] = () => {
    $('.xx2temp').attr('id', 'xx2-fadeout')
    $('.xx2teacher').attr('id', 'xx2-fadein');
    $('.xx2delete').remove();
    setTimeout(function() {
        fifo('#xx2-fadeout', '#xx2-fadein');
    }, 100)
}
window.Login['student'] = () =>  {
    $('.xx2temp').attr('id', 'xx2-fadeout')
    $('.xx2student').attr('id', 'xx2-fadein');
    $('.xx2delete').remove();
    setTimeout(function() {
        fifo('#xx2-fadeout', '#xx2-fadein');
    }, 100)
}