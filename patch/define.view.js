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
!function() {
    window.debugLastTime = Date.now();
    console.debug = (a) => {
        let diff = Date.now() - window.debugLastTime;
        window.debugLastTime = Date.now();
        console.log("%c"+diff+" - "+a, 'color: #4661ff;')
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

function printableResults(Student) {
    var a = elemental.Elements.Printable;
    var stringA = $(a).html().toString();

    var doc = document.implementation.createHTMLDocument();
    doc.body.innerHTML = stringA;

    var now = new Date().toDateString();
    doc.getElementById("hot_time").innerText = now;
    doc.getElementById("hot_name").innerText = Student.name;
    doc.getElementById("hot_score").innerText = Student.score;
    doc.getElementById("hot_percent").innerText = Student.percent;
    doc.getElementById("hot_anti").innerText = Student.anti;
    doc.getElementById("hot_duration").innerText = Student.duration;

    // myWindow.document.write("<p>This is 'myWindow'</p>");
    
    // myWindow.document.close();
    //myWindow.focus();
    //myWindow.print();
    // myWindow.close();
    console.log(doc)  
}