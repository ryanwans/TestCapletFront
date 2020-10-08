function fifo(t1, t2, cont) {
    $(t1).toggleClass('slideShowOut');
    setTimeout(function() {
        $(t2).toggleClass('slideShowIn');
    }, 300);
    cont = ("undefined" == typeof cont) ? true : cont;
    if(cont) {
        setTimeout(function() {
            $(t2).removeAttr('id');
            $(t1).removeAttr('id');
        }, 2000);
    }
}
function fo(t1) {
    $(t1).toggleClass('xx2-mainout')
    $(t1).toggleClass('mainOut');
}
function fi(t1) {
    $(t2).toggleClass('xx2-mainin')
    $(t2).toggleClass('mainIn');
}