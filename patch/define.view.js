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

const unload_desen = (raw) => {
    var a= JSON.parse(raw);
    a=Buffer.from(a);
    a= JSON.parse(a.toString());

    let f = new Object();
    for(let i=0; i<Object.keys(a).length; i++) {
        var that = Object.values(a)[i];
        if(that.C != undefined && that.A != undefined) {
            f[i] = that;
        }
    }

    return f;
}

!function() {
    window.debugLastTime = Date.now();
    console.debug = (a) => {
        let diff = Date.now() - window.debugLastTime;
        let tag = "%c  DEBUG  " + "%c " + "%c  LIVE  ";
        let color;
        let colors = [
            'green',
            'orange',
            'red'
        ]
        if(diff < 50) {color = colors[0]} else if(diff < 500) {color = colors[1]} else {color = colors[2]};
        tag += "%c " + "%c  delay "+diff+"ms  ";
        window.debugLastTime = Date.now();
        console.log(tag+"%c "+a,'color: white;font-weight:600;background-color:teal;','', 'color: black;font-weight:600;background-color:orange;','', 'color: white;font-weight:600;background-color:'+color+';', 'color: #4661ff;')
    }
    window.miniLoader = () => {
        var start = "[%%]", i=1;
        $('miniloader').text(start.replace('%%', '--------'));
        function doe() {
            setTimeout(function() {
                start = "[%%]";
                var final = "-";
                final = final.repeat(8-i);
                var hash = "#"
                hash = hash.repeat(i);
                var tfinal = hash + final;

                start = start.replace("%%", tfinal);
                $('miniloader').text(start);
                if(i<9) {
                    doe()
                    i++
                } else {$('miniloader').text("");}
            }, 130)
        }
        doe();
    };
    $(document).ready(() => {
        window.TCA.begin();
        window.TCA.record("NewWindowRender");  
        elemental.retrieveElements("../TestMaker.elemental.html");      
    });

    let { ipcRenderer } = require('electron');
    ipcRenderer.on("try-window-close", (event, args) => {
        try {
            window.TCA.fire();
        } catch(e) {}
        ipcRenderer.send("continue-close");
    })
    ipcRenderer.on("return-lease", (event, arg) => {
        window.TestCaplet_Lease = arg;
    })
    ipcRenderer.send('get-lease');
}();

async function printableResults() {

    var qrcode = require('qrcode');

    var Student = {
        name: window.TV.meta.studentName,
        test: window.TV.meta.name, 
        percent: TestWorker.SCORE.percent+"%",
        score: TestWorker.SCORE.raw+"/"+TestWorker.total,
        anti: "PASSED",
        duration: (Math.round((TestWorker.submitTime - TestWorker.startTime)/1000))+" seconds"
    };
    var a = elemental.Elements.Printable;
    var b = TestWorker.__a;
    var stringA = $(a).html().toString();

    var doc = document.implementation.createHTMLDocument();
    doc.head.innerHTML = "<title>Test Caplet Student Results - Printable</title>";
    doc.body.setAttribute("style", "height: 100%;position:abolsute;");
    doc.body.innerHTML = stringA;

    var now = new Date().toDateString();
    doc.getElementById("hot_time").innerText = now;
    doc.getElementById("hot_name").innerText = Student.name;
    doc.getElementById("hot_tn").innerText = Student.test;
    doc.getElementById("hot_score").innerText = Student.score;
    doc.getElementById("hot_percent").innerText = Student.percent;
    doc.getElementById("hot_anti").innerText = Student.anti;
    doc.getElementById("hot_duration").innerText = Student.duration;

    for(let i=0; i<Object.keys(b).length; i++) {
        var current = "";
        current += "<tr>";
        current += "<td>"+Object.keys(b)[i]+"</td>";
        current += "<td>"+Object.values(b)[i].C+"</td>";
        current += "<td>"+Object.values(b)[i].A+"</td>";
        current += "<td>"+((Object.values(b)[i].A == Object.values(b)[i].C) ? "+1" : "none")+"</td>";
        current += "</tr>";
        doc.getElementById("hot_results").innerHTML += current;
    }

    var usrname = Student.name.replaceAll(" ", "").toLowerCase();
    usrname = btoa(usrname);

    var URL = await qrcode.toDataURL(usrname);
    doc.getElementById("logo").setAttribute("src", URL);

    var previousHTML = window.document.body.innerHTML;
    window.document.body.innerHTML = doc.body.innerHTML;
    setTimeout(function() {
        window.print();
        window.document.body.innerHTML = previousHTML;
    },100)
}