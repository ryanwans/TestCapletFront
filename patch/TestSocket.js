!function() {
    // anonymize everything for now
    let obj = new Object();
    obj.Portal = {
        start = () => {
            obj.socket = io("https://caplet.ryanwans.com/");
        }
    }
    Export("SocketPatch", obj);
}();

let Export = (Key, Value) => {
    window[Key] = Value;
    return !!window[Key]
}