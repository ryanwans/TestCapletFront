// Test Caplet Analytics Program
// by ryanwans

window.TCA = window.TCA || {};
window.TCA = {
    patch: {
      clicks: new Array(),
      actions: new Array(),
      passalong: new Object()
    },
    intervalCount: 0,
    errorCount: 0,
    begin: () => {
        document.body.addEventListener("click", window.TCA.clickEvent, false);

        var _now = (window.TCA.get('tca-time') == null) ? Date.now() : window.TCA.get('tca-time');

        TCA.store('tca-time', _now);
        var _uuid = btoa(_now);
        TCA.store('tca-id', _uuid);

        setInterval(function() {
          window.TCA.fire()
        }, 120000);
        setTimeout(function() {
          window.TCA.fire()
        }, 10000);
    },
    clickEvent: (e) => {
        var userClick = {
          position: {
            x: e.clientX,
            y: e.clientY
          },
          target: {
            type: e.path[0].nodeName,
            class: e.path[0].className,
            id: e.path[0].id
          },
          stamp: Date.now()
        }
        window.TCA.patch.clicks.push(userClick)
    },
    store: (name, data) => {
        window.localStorage.setItem(name, data);
    },
    get: (name) => {
        return window.localStorage.getItem(name);
    },
    record: (act) => {
      window.TCA.patch.actions.push({
        action: act,
        stamp: Date.now()
      });
      return 1;
    },
    fire: () => {
      window.TCA.patch.stamp = window.TCA.get('tca-time');
      window.TCA.patch.uuid  = window.TCA.get('tca-id');

      var data = window.TCA.patch;

      data.passalong = {
        stamp: Date.now(),
        int: window.TCA.intervalCount,
        err: window.TCA.errorCount,
        appId: "RyanWans-TestCaplet_ZK3GEm4on1AdatPgBMRW",
        stackDelay: 'now'
      }
      data.lease = window.TestCaplet_Lease;

      var DataBuffer = Buffer.from(JSON.stringify(data));
      DataBuffer = DataBuffer.toJSON();
      DataBuffer = JSON.stringify({
        pack: DataBuffer.data
      })

      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            window.TCA.PortOpen = true;
            window.TCA.patch = {
                clicks: new Array(),
               actions: new Array(),
               passalong: new Object()
            }
          } else {window.TCA.errorCount++;}
      };
      xhr.onerror = function(e) {
        window.TCA.errorCount++;
        console.warn("[TestCapletAnalytics] Encountered: "+e);
      }
      xhr.open("POST", "https://caplet.ryanwans.com/analytics/pole=120000@now", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(DataBuffer);

      window.TCA.intervalCount++;
    }
}