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
        "<live-actions><live-s-head>quick actions</live-s-head><br><live-b>Start / Stop Testing</live-b><live-b>...</live-b><live-b>View Test Results</live-b></live-actions>"+
        "<live-timer><live-s-head>elapsed time</live-s-head><live-tnow>0:00:00</live-tnow></live-timer></live-topbar>"+
        "</livemaster>";
        $(TargetElement).html(TestingHTML);
        // init pie chart
        LiveTesting.progress = new Chart(document.getElementById("pie-chart"), {
            type: 'pie',
            data: {
              labels: ["% Answered", "Total Questions"],
              datasets: [{
                label: "Questions Answered (Avg.)",
                backgroundColor: ["#21bd36", "#959595"],
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
    window.LiveTesting.startTesting = () => {
        var now = Date.now();
        LiveTesting.startTime = now;
        LiveTesting.timer.start(now);
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
                LiveTesting.progress.update();
            }, 1000);
        }
    }
})();
