let Export = (Key, Value) => {
    window[Key] = Value;
    return !!window[Key]
}
!function() {
    // anonymize everything for now
    let obj = new Object();
    obj.Portal = {
        start: (Authentication) => {
            obj.socket = io("https://caplet.ryanwans.com/a3/sockets/sss");
            obj.socket.on('connection-approved', (approvalKey) => {
                obj.Staging.approved(approvalKey);
            });
            obj.socket.emit('approval-request', Authentication);
        }
    }
    obj.Emit = (Key, Value) => {
        obj.socket.emit(Key, Value);
    }
    Export("SocketPatch", obj);
}();
