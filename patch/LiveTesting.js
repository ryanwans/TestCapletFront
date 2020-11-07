// Live Testing Module by Ryan Wans
// Created using hours of typing and many tears
// probably dosn't even work to be honest LOL
// oh well

// Define global object
window.LiveTesting = new Object();

// Write to object state
-(function() {
    console.debug("LiveTesting loaded...");
    window.LiveTesting.state = 0;
    window.LiveTesting.setWindow = (TargetElement) => {
        var TestingHTML = "";
        $(TargetElement).html("loading...");
        TestingHTML += 
        "<livemaster><live-topbar><live-pie>"+
        "<live-s-head>student progress</live-s-head><canvas id='pie-chart' width='185' height='150'></canvas></live-pie>"+
        "<live-actions><live-s-head>quick actions</live-s-head><br><live-b class='x-ss' onclick=\"LiveTesting.confirm('start')\">Start / Stop Testing</live-b><live-b>Display Test Code</live-b><live-b>Additional Options</live-b><live-sta stop>Testing Stopped</live-sta></live-actions>"+
        "<live-timer><live-s-head>elapsed time</live-s-head><live-tnow>0:00:00</live-tnow></live-timer></live-topbar>"+
        "<live-stud><live-s-head>student testing progress</live-s-head><br><div class='x-s-repl'></div></live-stud>"+
        "<live-live class='x-l-repl'><live-s-head>live updates log</live-s-head></live-live></livemaster>";
        $(TargetElement).html(TestingHTML);
        // init pie chart
        LiveTesting.progress = new Chart(document.getElementById("pie-chart"), {
            type: 'pie',
            data: {
              labels: ["% Answered", "Total Questions"],
              datasets: [{
                label: "Questions Answered (Avg.)",
                backgroundColor: ["#152168", "#a5a5a5"],
                data: [0,100]
              }]
            },
            options: {
              title: {
                display: false,
              },
            legend: {
               display: false
             },
                tooltips: {
                   enabled: true
                }
            }
        });
    }
    window.LiveTesting.state = "closed";
    window.LiveTesting.bgPrc = {
        socket: false,
        students: false,
        timeSync: false,
        progress: false,
        start: (tuid, testIndex) => {
            console.debug("[Background Process] Starting background process que...");
            window.LiveTesting.TestingIndex = testIndex;
            LiveTesting.log("Starting live testing process...");
            setTimeout(function() {
                // establish socket portal
                LiveTesting.bgPrc.SOCKET_start(tuid);
                LiveTesting.log("Socket connected. Data stream opening");
                // start student reading
                LiveTesting.bgPrc.SYNC_students();
                // start time syncing

                // start progress syncing

                // open testing network facade
                LiveTesting.log("Testing state is updated to: "+LiveTesting.state);
            }, 600)
            
        },
        SYNC_students: () => {
            console.debug("[Background Process] 2 - Syncing students from active Student database");
            // $(".x-s-repl").append("<span id='load-rem'>There are no students to display</span>");
            //$(".x-s-repl").append("<div class='x-test'><span class='x-test-title'>Ryan Wans</span><span class='x-test-opts'><progress class='x-s-prog' id='prgRyanW' value='4' max='6'></progress><img src='../hard/dots.svg' class='x-test-more'></span></div>")
            //$(".x-s-repl").append("<div class='x-test x-s-locked'><span class='x-test-title'>Test Subject 2 <x-loc></x-loc></span><span class='x-test-opts'><progress class='x-s-prog' id='prgRyanW' value='5' max='6'></progress><img src='../hard/dots.svg' class='x-test-more'></span></div>")

            //$('#load-rem').remove();
        },
        SOCKET_start: (tuid) => {
            LiveTesting.socket = io("https://caplet.ryanwans.com/a3/sockets/sss");
            LiveTesting.socket.on('return', (data) => {
                console.debug("socket server emitted bypass");
                LiveTesting.log("Server accepted client's socket approval request --> SUCCESSFUL CONNECTION");
                LiveTesting.SockRet = data.listen;
                console.debug("Received Current Test Allocation: "+JSON.stringify(data.allocation));
                console.debug("Received Current Waiting Room: "+ JSON.stringify(data.waiting));
                LiveTesting.bgPrc.tuid = tuid;
                LiveTesting.bgPrc.SOCKET_prop();
                LiveTesting.state = "open";
                LiveTesting.log(" = = = = = = = = = = <i>BELOW IS LIVE TEST DATA</i> = = = = = = = = = = ");
            })
            LiveTesting.socket.emit('teacher-register', {now: Date.now(), auth: F.auth, namespace: tuid})
        },
        SOCKET_prop: () => {
            LiveTesting.socket.on(LiveTesting.SockRet, (Data) => {
                LiveTesting.log(JSON.stringify(Data));
            })
            LiveTesting.socket.on("namespace", (Data) => {
                LiveTesting.Namespace = LiveTesting.Namespace || {};
                var newDataLog = (JSON.stringify(LiveTesting.Namespace) == JSON.stringify(Data.namespace)) ? false : true;
                LiveTesting.Namespace = Data.namespace;
                LiveTesting.updateSpace(newDataLog);
            })
            // temporary ping/pong until testing starts
            LiveTesting.SOCKET_PING = setInterval(function() {
                LiveTesting.socket.emit('teacher-getNamespace', {namespace: LiveTesting.bgPrc.tuid})
            }, 2000);
        }
    }
    window.LiveTesting.updateSpace = (newData) =>  {
        var t = LiveTesting.Namespace.clients;
        var avgProgress = [], avgSum = null;
        var stLength = Object.keys(t).length;
        // clear student buffer
        $('.x-s-repl').text("");
        if(stLength > 0) {
            for(let i=0; i<stLength; i++) {
                let data = Object.values(t)[i];
                data.status.answers = data.status.answers || {};
                $(".x-s-repl").append("<div class='x-test "+((data.status.wpFire)?"x-s-locked": "")+"'><span class='x-test-title'>"+data.name+" "+((data.status.wpFire)?"<x-loc onclick='LiveTesting.unlockStudent(\""+data.route+"\")'></x-loc>":"")+"</span><span class='x-test-opts'><progress class='x-s-prog' id='prgRyanW' value='"+(Object.keys(data.status.answers).length || 0)+"' max='"+TestData[LiveTesting.TestingIndex].meta.count+"'></progress><img src='../hard/dots.svg' class='x-test-more'></span></div>")
                LiveTesting.log("Student "+data.name+": currently on question "+data.status.activeQ+" with "+(Object.keys(data.status.answers).length || 0)+" answers.");
                if(data.status.wpFire) {
                    LiveTesting.log("Student "+data.name+": <b>test is currently locked, student clicked away!</b>");
                }
                avgProgress.push(((Object.keys(data.status.answers).length || 0))/(TestData[LiveTesting.TestingIndex].meta.count));
            }
            for(let r=0; r<avgProgress.length; r++) {
                avgSum += avgProgress[r];
            }
            avgSum = avgSum/avgProgress.length;
            avgSum = Math.ceil(avgSum*100);
            LiveTesting.progress.data.datasets[0].data[0] = avgSum;
            LiveTesting.progress.data.datasets[0].data[1] = 100 - avgSum;
            LiveTesting.progress.update();
        } else {
            $('.x-s-repl').html("<h4>There are no students actively testing right now.</h4>");
        }
    }
    window.LiveTesting.unlockStudent = (studentTarget) => {
        LiveTesting.socket.emit('teacher-unlockStudent', {
            student: studentTarget,
            auth: LiveTesting.bgPrc.tuid,
            resume: true||1
        })
    }
    window.LiveTesting.confirm = (state) => {
        var f = new FAR.popup({
                moveable: false,
                title: "Test Caplet Alert - Confirmation",
                html: "<b>Are you sure you want to "+state+" testing?</b>",
                jQuery: false,
                pageBlur: true,
                escapeKey: false,
                buttons: [
                    {
                        name: 'No',
                        func: 'window.FAR.selfClose()'
                    },
                    {
                        name: 'Yes',
                        func: 'window.LiveTesting.'+state+"Testing();"
                    }
                ]
        }).hoist();
    }
    window.LiveTesting.startTesting = () => {
        window.FAR.selfClose();
        var now = Date.now();
        LiveTesting.startTime = now;
        LiveTesting.timer.start(now);
        LiveTesting.socket.emit('teacher-StartStop', {
            opened: true,
            namespace: LiveTesting.bgPrc.tuid
        })
        LiveTesting.state = "open";
        LiveTesting.log("Testing state is updated to: "+LiveTesting.state);
        $('.x-ss').attr('onclick', 'LiveTesting.confirm("stop")')
        $('live-sta').removeAttr("stop");
        $('live-sta').attr("start", "");
        $('live-sta').text("Active Testing");
    }
    window.LiveTesting.stopTesting = () => {
        window.FAR.selfClose();
        LiveTesting.timer.stop();
        LiveTesting.state = "closed";
        LiveTesting.socket.emit('teacher-StartStop', {
            opened: false,
            namespace: LiveTesting.bgPrc.tuid
        })
        LiveTesting.log("Testing state is updated to: "+LiveTesting.state);
        $('.x-ss').attr('onclick', 'LiveTesting.confirm("start")')
        $('live-sta').removeAttr("start");
        $('live-sta').attr("stop", "");
        $('live-sta').text("Testing Stopped");
        clearInterval(LiveTesting.SOCKET_PING);
    }
    window.LiveTesting.log = (me) => {
        $('.x-l-repl').append(Date.now() + " - "+me+"<br>");
    }
    window.LiveTesting.timer = {
        start: (time) => {
            window.LiveTesting.timer.interval = setInterval(() => {
                $('live-tnow').text(() => {
                    var ms = Date.now() - LiveTesting.startTime;
                        // 1- Convert to seconds:
                        var seconds = ms / 1000;
                        // 2- Extract hours:
                        var hours = Math.floor(parseInt( seconds / 3600 )); // 3,600 seconds in 1 hour
                        seconds = seconds % 3600; // seconds remaining after extracting hours
                        // 3- Extract minutes:
                        var minutes = Math.floor(parseInt( seconds / 60 )); // 60 seconds in 1 minute
                        // 4- Keep only seconds not extracted to minutes:
                        seconds = Math.floor(seconds % 60);

                        seconds = (seconds.toString().length <= 1) ? ("0"+seconds) : seconds;
                        minutes = (minutes.toString().length <= 1) ? ("0"+minutes) : minutes;

                    return ( hours+":"+minutes+":"+seconds);
                });
            }, 1000);
        },
        stop: () => {
            clearInterval(window.LiveTesting.timer.interval);
        }
    }
    window.LiveTesting.onExit = () => {
        clearInterval(LiveTesting.SOCKET_PING);
        LiveTesting.socket.disconnect();
        LiveTesting.state = "closed";
    }
})();
