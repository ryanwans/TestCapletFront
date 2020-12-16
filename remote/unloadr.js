exports.unload = (raw) => {
    var a= JSON.parse(raw);
    a=Buffer.from(a);
    a= JSON.parse(a.toString());

    let f = new Object();
    for(let i=0; i<Object.keys(a).length; i++) {
        var that = Object.values(a)[i];
        if(that.C != undefined && that.A != undefined) {
            f['_'+i] = that;
        }
    }

    return f;
}