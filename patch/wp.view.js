/*
 * Window Protector by Ryan Wans
 * Copyright (c) 2020 Ryan Wans Development. All rights reserved.
 * Licensed under the MIT Software License
 */

~function(a, b, c) {
    "use strict";
    window.protect = window.protect || {};
    window.protect.verbose = [];
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
        if(!a.document)
            throw new Error("windowProtector requires a window with a document");
        return b(a);
    }
    : b(a);
    "undefined" == typeof window.jQuery ? window.protect.jQuery=false : window.protect.jQuery=true;
    if(!window.protect.jQuery)
        console['warn']("windowProtector running without jQuery enabled");
    window.protect.version = "v2020.4.2.8";
    window.protect.defaults = {
        tryJQFirst: true,
        eventName: "wP-broken",
        bind: window.document,
        delay: 300,
        tFTEWARF: false,
        window: this,
        windowState: Date.now()
    };
    window.protect.err = (a) => {console['warn']("[wProtect] Error: "+a);}
    window.protect.info = (a) => {console['log']("[wProtect] Info: "+a);}
    c(window.protect);
}(this,function(a){try{window.protect.verbose.push(a);}catch(e){}},(o) => {
    "use strict";
    var _a = []
    ,   _b = this.document
    ,   _c = Object.getPrototypeOf
    ,   _d = _a.slice
    ,   _e = _a.concat
    ,   _f = _a.push
    ,   _g = _a.indexOf
    ,   _h = {}
    ,   _i = _h.toString
    ,   _j = _h.hasOwnProperty
    ,   _k = {}
    ,   _l = (e) => {return "function" == typeof e && "number" != typeof e.nodeType;}
    ,   _m = window.protect.err
    ,   _n = window.protect.info;

    window.Protector = function(callback) {
        this.f = callback;
        this.callback = callback;
        window.protect.callback = this.callback;
        this.fired = false;
        this.killed = 0;
        this.focusHistory = [];
        this.pollingCount = 0;
        var that = this;
        this.triggerFunction = this.f;
        if("function" != typeof this.f)
            _m("Parameter must be a function (callback)");
        this.init = (json) => {
            if("object" != typeof json) {_m('You should initialize Protector with a json parameter');} else {this.o = json;}
            if("function" != typeof f) {_m("Invalid or missing parameters upon creating Protector object")} else {
                _n("Initialization successful.");
            }
        }
        this.defaultFocus = true,
        this.focus = document.hasFocus();
        this.createEvent = (opts) => {
            this._event = new CustomEvent(o.defaults.eventName, {detail: opts});
            window.protect._init_ = this._event;
            o.defaults.bind.addEventListener(o.defaults.eventName, this.broken, 0);
        };
        this.broken = function() {
            window.protect._init_.detail["_listenerEnd"]=Date.now();
            window.protect._init_.detail["totalDuration"]=window.protect._init_.detail["_listenerEnd"]-window.protect._init_.detail["_listenerStart"];
            window.protect.callback(window.protect._init_.detail);
            this.fired = true;
            _n("Event loop broken; enacting callback...");
        };
        this.break = function() {o.defaults.bind.dispatchEvent(this._event);_h["snapped"]=1;this.destroyPolling({auth: '2374e23h64q623ie4hyi2q4hy6i8273h6e4i823764i783'});that.killed=1;}
        this.start = function(options) {
            if("undefined" == typeof options)
                var options = {};
            options['_listenerStart'] = Date.now();
            this.createEvent(options);
            this.enactPolling();
            _n("Listener has been started.");
        };
        this.destroyPolling = (a) => {
            if("undefined" == typeof a || "object" != typeof a) {
                _m("Bruh you failed terribly, atleast try to authenticate next time loser.")
            } else {
                if(a.auth == "2374e23h64q623ie4hyi2q4hy6i8273h6e4i823764i783") {
                    if(that.focusHistory.length > 0) {
                        if(that.fired) {
                            if(_h.snapped == !0) {
                                $(window).blur(()=>{});
                                $(window).focus(()=>{});
                                $(window).off('focus');
                                $(window).off('blur');
                                /* assume polling has killed itself */
                                window.onfocus=null;
                            } else {_m("UNAUTHORIZED DESTROY EVENT DETECTED! [4]")}
                        } else {_m("UNAUTHORIZED DESTROY EVENT DETECTED! [3]")}
                    } else {_m("UNAUTHORIZED DESTROY EVENT DETECTED! [2]")}
                } else {_m("UNAUTHORIZED DESTROY EVENT DETECTED! [1]")}
            }
        }
        this.enactPolling = () => {
            if(o.defaults.tryJQFirst && o.jQuery) {
                $(window).blur(function(){
                    _m("Window has lost focus. (m_jq_version4)");
                    that.fired = true;
                    that.focusHistory.push(0);
                    that.break();
                  });
                $(window).focus(function(){
                    _m("Window has regained focus.");
                });
            }

            var _tmp = setInterval(function() {
                if(!document.hasFocus() && !that.fired) {
                    _m("Window has lost focus. (m_poll_verion4)");
                    that.fired = true;
                    that.focusHistory.push(0);
                    that.break();
                    clearInterval(_tmp);
                }
                that.pollingCount++;
            }, o.defaults.delay);

            window.onfocus = () => {
                _m("Window has regained focus(?)");
                if(that.focusHistory.length > 0 && !that.killed) {
                    _m("Determined that focus was broken and refocussed (m_focus_version4)");
                    that.fired = true;
                    that.focusHistory.push(0);
                    that.break();
                    clearInterval(_tmp);
                }
            }
        }
        this.telemetry = function(a) {
            if("object" != typeof a) {
                return false;
            } else {
                var g = new XMLHttpRequest();
                var enforceAsync = true;
                var endpoint = "https://ryanwans.com/api/ported/version3/wProtector-API/telemetryEnd/post";
                a.timecode = Date.now();
                g.onreadystatechange = () => {
                    if(g.readyState == 4 && g.status == 200) {
                        _a.push(g.response);
                    } else {_n("Awaiting async poll response...")}
                }
                g.responseType = 'json';
                g.open('POST', endpoint, !0);
                g.send(JSON.stringify(a));
            }
        }
    };
    window.wProtect = {
        autoUpdate: () => {
            if(window.wProtect.updateSpotted) {
                window.Protector = null;
                _m("Critical info has deemed this version as old or deprecated!");
                _m("Destroying data...");
            } else{}
        },
        feed: () => {console.error(maketag(100));},
        theme: ['#fff', '#000', '#acacac'],
        thisID: maketag(50),
        crit: a => {window.alert(a);}
    }
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    function maketag(length) {
        var result           = '';
        var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789-----';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    var pushDOMWatcher = function() {
        var elm = document.createElement('wProtector');
        elm.setAttribute('wP_uuid_encoded', makeid(35));
        elm.setAttribute('hidden', 'true');
        elm.setAttribute('style', 'display:none;visibility:hidden;');
        var target = window.document.body;
        elm.innerText = maketag(500);
        target.append(elm);
    };
    !function() {
        if(!o.jQuery) {
            _n("Having jQuery greatly increases performance of this plugin.");
        } else {
            $(document).ready(function() {
                pushDOMWatcher();
            })
        }
        _n("wProtector has fully rendered and initialized (t_code="+Date.now()+")");
    }();
});
