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
        "<live-actions><live-s-head>quick actions</live-s-head><br><live-b class='x-ss' onclick='LiveTesting.startTesting()'>Start / Stop Testing</live-b><live-b>Display Test Code</live-b><live-b>Additional Options</live-b><live-sta stop>Testing Stopped</live-sta></live-actions>"+
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
        var stLength = Object.keys(t).length;
        // clear student buffer
        $('.x-s-repl').text("");
        if(stLength > 0) {
            for(let i=0; i<stLength; i++) {
                let data = Object.values(t)[i];
                data.status.answers = data.status.answers || {};
                $(".x-s-repl").append("<div class='x-test'><span class='x-test-title'>"+data.name+"</span><span class='x-test-opts'><progress class='x-s-prog' id='prgRyanW' value='"+(Object.keys(data.status.answers).length || 0)+"' max='"+TestData[LiveTesting.TestingIndex].meta.count+"'></progress><img src='../hard/dots.svg' class='x-test-more'></span></div>")
                if(newData) {
                    // LiveTesting.log("Student "+data.name+": Now on question "+((Object.keys(data.status.answers).length || 0)+1));
                }
            }
        } else {
            $('.x-s-repl').html("<h4>There are no students actively testing right now.</h4>");
        }
    }
    window.LiveTesting.startTesting = () => {
        var now = Date.now();
        LiveTesting.startTime = now;
        LiveTesting.timer.start(now);
        LiveTesting.socket.emit('teacher-StartStop', {
            opened: true,
            namespace: LiveTesting.bgPrc.tuid
        })
        LiveTesting.state = "open";
        LiveTesting.log("Testing state is updated to: "+LiveTesting.state);
        $('.x-ss').attr('onclick', 'LiveTesting.stopTesting()')
        $('live-sta').removeAttr("stop");
        $('live-sta').attr("start", "");
        $('live-sta').text("Active Testing");
    }
    window.LiveTesting.stopTesting = () => {
        LiveTesting.timer.stop();
        LiveTesting.state = "closed";
        LiveTesting.socket.emit('teacher-StartStop', {
            opened: false,
            namespace: LiveTesting.bgPrc.tuid
        })
        LiveTesting.log("Testing state is updated to: "+LiveTesting.state);
        $('.x-ss').attr('onclick', 'LiveTesting.startTesting()')
        $('live-sta').removeAttr("start");
        $('live-sta').attr("stop", "");
        $('live-sta').text("Testing Stopped");

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
                LiveTesting.progress.data.datasets[0].data[0]++;
                LiveTesting.progress.data.datasets[0].data[1]--;
                LiveTesting.progress.update();
            }, 1000);
        },
        stop: () => {
            clearInterval(window.LiveTesting.timer.interval);
        }
    }
})();
