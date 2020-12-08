// data graphs and stuff w/ ryan wans :)

window.vis = [
    {
        render: (DataSet, targetElement, id, TEST_OBJECT) => {
            window.TCA.record("StartDataVis");
            
            window.vis[1]       = new Object();
            window.vis[1].names = Object.keys(DataSet);
            window.vis[1].data  = Object.values(DataSet);
            window.vis[0].test  = TEST_OBJECT;

            // Render Names
            for(let i=0; i<window.vis[1].names.length; i++) {
                window.vis[1].names[i] = atob(window.vis[1].names[i]);
            }

            var ChartType = {
                "number": "bar",
                "array": "horizontalBar",
                "object": "bar"   //  Grouped Bar
            };

            window.vis[2]  = new Object();   // Student Answers
            window.vis[3]  = new Array();    // Student Scores
            window.vis[4]  = new Array();    // Student Test Times
            window.vis[5]  = new Array();    // Student Submission Rate
            window.vis[11] = "home";         // Define current page
            
            // Render Answers & Scores & Times & Submitted
            for(let i=0; i<window.vis[1].data.length; i++) {
                var that = window.vis[1].data[i];

                window.vis[3].push(that.score);
                window.vis[4].push(that.elapsed);
                window.vis[5].push(that.submit);

                // Push Answers w/ Respect to Data Type
                for(let r=0; r<Object.values(that.answers).length; r++) {
                    let KV = [Object.keys(that.answers)[r], Object.values(that.answers)[r]];
                    window.vis[2][KV[0]] = window.vis[2][KV[0]] || [];
                    window.vis[2][KV[0]].push(KV[1]);
                }
            }

            // Determine Chart Type Based Off Data Type
            window.vis[6] = new Array();

            for(let i=0; i<Object.keys(window.vis[2]).length; i++) {
                var thisSet = Object.values(window.vis[2])[i];
                if("number" == typeof thisSet[0]) {
                    window.vis[6].push(ChartType["number"]);
                } else if ("object" == typeof thisSet[0]) {
                    if(thisSet[0] instanceof Array) {window.vis[6].push(ChartType["array"])}
                    else {window.vis[6].push(ChartType["object"])}
                }
            }

            // All Data is Now Rendered. Display Page w/ Rendered Elements
            window.vis[0].displayHome(window.vis[0].elementize(), targetElement, id);
        },
        elementize: () => {
            // No parameters needed, assume all data is stored in window.vis[...]

            window.vis[7] = new Array();     // Actual Canvas Elementds
            window.vis[8] = new Array();     // Unique Addressable ID's
            var that = window.vis;

            // <canvas id="uuid" width="..." height="..."></canvas>   
            
            for(let i=0; i<that[6].length; i++) {
                var xElm = document.createElement('canvas');
                var xTag = "__vis__"+Math.floor(Math.random()*100)+"__"+i;

                xElm.setAttribute('id', xTag);
                xElm.setAttribute('_vis_type_', that[6][i]);
                xElm.classList = ['visChartGlobal', 'visChart-'+that[6][i]];

                window.vis[7].push(xElm);
                window.vis[8].push(xTag);
            }

            return [window.vis[7], window.vis[8]];
        },
        displayHome: (caid, targetElement, id) => {
            var elements = caid[0];
            var ids = caid[1];

            // Remember: All Element and Answer Array's are parallel

            $(targetElement).html("<br>Loading...");

            $(targetElement).html(elemental.getElement("ResultsData"));

            // Define addressable elements in the DOM
            window.vis[10] = {
                "home": ['visGraphSVT', 'visStudents', 'visDuration', 'visScore', 'visSubmission']
            }

            setTimeout(function() {
                var tt = window.vis[10][window.vis[11]];
                    // Actual graph
                    var LABEL_SET = [], DATA_SET;

                    // Set Labels for appropriate question length
                    var lbllength = (vis[6].length > 10) ? Math.floor(vis[6].length/2) : vis[6].length;
                    lbllength += 1;
                    for(let i=0; i<lbllength;i++) {LABEL_SET[i]= Math.floor((i/(lbllength-1))*100)+"%";}

                    // Fill data set (array of average durations)
                    DATA_SET = new Array(lbllength);
                    // Fill with array (array of arrays)
                    for(let i=0;i<lbllength;i++){DATA_SET[i]=[]}
                    // Fill inner arrays with durations
                    for(let i=0; i<vis[3].length; i++) {
                        var t = (vis[3][i] == null) ? 0 : vis[3][i]
                        if(vis[3][i] != null) {DATA_SET[t].push(1);}
                    }
                    // Summate and avg inner arrays into typeof number
                    for(let i=0; i<DATA_SET.length; i++) {
                        DATA_SET[i] = DATA_SET[i].length;
                        if("number" != typeof DATA_SET[i]) {DATA_SET[i] = 0}
                    }
        
                    new Chart(document.getElementById('visGraphSVT'), {
                        type: 'bar',
                        data: {
                          labels: LABEL_SET,
                          datasets: [{
                              label: "",
                              backgroundColor: vis[0].chartColors(1),
                              data: DATA_SET
                          }]
                        },
                        options: {
                          legend: { display: false },
                          title: {display: false,text: ''},
                          scales: {yAxes: [{ticks: {beginAtZero: true}, drawBorder: false,}], xAxes: [{gridLines: {color: "rgba(0, 0, 0, 0)",}}]}
                        }
                    });

                    // Now, lets aggregate the student list with their respective duration and a heatmap for grade
                    for(let i=0; i<vis[3].length; i++) {
                        var name = vis[1].names[i];
                        var TimeStamp = vis[0].msToTime(vis[4][i]);
                        if(vis[3][i] != null) {
                            var score = vis[3][i]
                            var total = vis[6].length;
                            var percent = Math.round((score/total)*100);
                            var ScoreString = score+"/"+total+" ("+percent+"%)";
                            var HeatRating = vis[0].getHeat(percent);
                            $('#visStudents').append("<div class='visStudentCard'><visname>"+name+" <vists>"+TimeStamp+"</vists></visname><visgrade class='"+HeatRating+"'>"+ScoreString+"</visgrade></div>");
                        } else {
                            $('#visStudents').append("<div class='visStudentCard'><visname>"+name+" <vists>"+TimeStamp+"</vists></visname><visgrade class='visNHI'>NHI</visgrade></div>");
                        }
                    }

                    // Grab: Average Score
                    var avgScore = Math.round(vis[0].avg(vis[3]));
                    var totalQs = vis[6].length;
                    var avgDigit = Math.round((avgScore/totalQs)*100);
                    $('#visScore').text(avgScore+"/"+totalQs+" ("+avgDigit+"%)");
                    $('#visScore').addClass(vis[0].getHeat(avgDigit));

                    // Grab: Average Duration
                    var avgDuration = vis[0].msToTime(Math.round(vis[0].avg(vis[4])))
                    $('#visDuration').text(avgDuration);

                    // Grab: Submission Rate
                    let totalNulls=0
                    for(let i=0; i<vis[3].length; i++) {
                        if(vis[3][i] == null) {totalNulls++;}
                    }
                    var avgSubmission = Math.round(((vis[3].length-totalNulls)/vis[3].length)*100);
                    $('#visSubmission').text((vis[3].length-totalNulls)+"/"+vis[3].length+" ("+avgSubmission+"%)")

                    // whew, that was a lot of code :P 
                    // now to some harder stuff... question viewer w/ answer and insights

                    vis[12] = 0; // active question
                    vis[0].loadBigQue(vis[12]);

                    $('.visIntelQue').click(function() {
                        vis[0].intel(this.getAttribute('viq'));
                    })

            },100); // Give time for elemental to render
        },
        chartColors: (a) => {
            if(a===1){return '#004c6d'}
            if(a===2){return ['#004c6d','#7193af'].reverse()}
            if(a===3){return ['#004c6d','#7193af','#cde2f5'].reverse()}
            if(a===4){return ['#004c6d','#527b98','#8fadc6','#cde2f5'].reverse()}
            if(a===5){return ['#004c6d','#436f8d','#7193af','#9fbad1','#cde2f5'].reverse()}
            if(a===6){return ['#004c6d','#396887','#5f84a1','#83a3bc','#a8c2d8','#cde2f5'].reverse()}
            if(a===7){return ['#004c6d','#326382','#527b98','#7193af','#8fadc6','#aec7dd','#cde2f5'].reverse()}
            if(a===8){return ['#004c6d','#2d607f','#497492','#6489a5','#7e9eb9','#98b4cc','#b2cbe1','#cde2f5'].reverse()}
            if(a>=9) {return '#004c6d'}
        },
        avg: (arr) =>{if("object" == typeof arr){
            var t =0, h =0;
            for(let i=0; i<arr.length; i++) {
                if(arr[i] != null) {t = t + arr[i];h++}
            }
            t = t/h
            return t;
        }},
        getHeat: (p) => {
            var c = "visHeat";
                 if(p >= 100) {return c+"10"}
            else if(p >= 90)  {return c+"9"}
            else if(p >= 80)  {return c+"8"}
            else if(p >= 70)  {return c+"7"}
            else if(p >= 60)  {return c+"6"}
            else if(p >= 50)  {return c+"5"}
            else if(p >= 40)  {return c+"4"}
            else if(p >= 30)  {return c+"3"}
            else if(p >= 20)  {return c+"2"}
            else if(p < 20)   {return c+"1"}
            // viola :) 
        },
        msToTime: (s) => {
            var ms = s % 1000;
            s = (s - ms) / 1000;
            var secs = s % 60;
            s = (s - secs) / 60;
            var mins = s % 60;
            var hrs = (s - mins) / 60;
          
            return hrs + ':' + mins + ':' + secs;
        },
        purgeData: () => {
            // Delete exsiting data
            for(let i=0;i<vis.length;i++) {
                if(i!=0) {
                    vis[i] = null;
                }
            }
            var f = $('.x-main');
            f = f.children()[0]
            $(f).remove()
        },
        loadBigQue: (index) => {
            $('#visActQue').text(index+1); // display current question
            var main = $('.visFullGraph'); 
            $(main).html("") // clear current selection
            $(main).html(vis[7][index]); // inject selected canvas
            var DATA = vis[2][index];
            console.log(DATA);
            DATA = vis[0].parseGraphData(DATA);
            var this_data = vis[0].test[vis[12]]._data;
            var respectType = function(i) {
                if(i==0){return [Object.keys(this_data.qAns).length, vis[0].letters.split("").splice(0, Object.keys(this_data.qAns).length).join("")]};
                if(i==1){return [5, "ERROR"]};
                if(i==2){return [this_data.qAns.values.length, this_data.qAns.values]};
                if(i==3){return [2, ["TRUE", "FALSE"]]};
                if(i==4){return [Object.keys(this_data.qAns).length, vis[0].letters.split("").splice(0, Object.keys(this_data.qAns).length).join("")]};
                if(i==5){return [this_data.qAns.length], this_data.qAns};
                if(i==6){return [this_data.qAns.R.length, this_data.qAns.R]};
            }
            var f = respectType(this_data.qType)
            var LABELS = f[1];
            new Chart(document.getElementById(vis[8][index]), {
                type: vis[6][index],
                data: {
                  labels: LABELS,
                  datasets: [{
                      label: "",
                      backgroundColor: vis[0].chartColors(1),
                      data: DATA
                  }]
                },
                options: {
                  maintainAspectRatio: false,
                  legend: { display: false },
                  title: {display: false,text: ''},
                  scales: {yAxes: [{ticks: {beginAtZero: true}, drawBorder: false,}], xAxes: [{gridLines: {color: "rgba(0, 0, 0, 0)",}}]}
                }
            });
        },
        nextQue: () => {
            if(vis[12] < (vis[6].length-1)) {
                vis[12]++;
                vis[0].loadBigQue(vis[12])
            }
        },
        prevQue: () => {
            if(vis[12] != 0) {
                vis[12]--;
                vis[0].loadBigQue(vis[12])
            }
        },
        letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        parseGraphData: (Data) => {
            if("number" == typeof Data[0]) {
                // This means answers are on a scale, not linear
                var RET_OBJ = new Object();
                var RET_ARR = new Array();
                for(let i=0; i<Data.length; i++) {
                    RET_OBJ[Data[i]] = RET_OBJ[Data[i]] || 0;
                    RET_OBJ[Data[i]]++;
                }
                // something like {1: 1, 2: 3}
                for(let i=0; i<Data.length; i++) {
                    RET_ARR[i] = RET_OBJ[i] || 0;
                }
                console.log(RET_ARR)
                // something like [0, 1, 3, 0]
                return RET_ARR
            } else if (Data[0] instanceof Array) {

            } else if (Data[0] instanceof Object) {

            }
            return Data;
        },
        showCurrentPrompt: () => {
            var thisTest = window.vis[0].test[vis[12]]
            var Question = thisTest._data.qValue;
            var Shorthand = thisTest._data.qShorthand;
            if("number" == typeof Shorthand) {Shorthand = vis[0].letters.split("")[Shorthand];}
            var t = new FAR.popup({
                moveable: true,
                title: "View Question Prompt",
                html: "<b>Prompt for Question "+(vis[12]+1)+":</b><br>"+Question+"<br><br><b>The Answer Is: </b>"+Shorthand,
                jQuery: true,
                pageBlur: false,
                escapeKey: true,
            }).hoist();
        },
        intel: (index) => {
            var main = ".visSecUnderRevise";
            $(main).html("<b>Loading analysis...</b>");
            var r = "";
            Array.max = function( array ){
                return Math.max.apply( Math, array );
            };
            Array.min = function( array ){
                return Math.min.apply( Math, array );
            };
            if(index == 0) {
                r += "<b>Student who invoked the anti-cheat:</b><br>";
                var target = vis[1].data
                for(let i=0; i<target.length; i++) {
                    if(target[i].wpFire) {
                        r += "-&nbsp;&nbsp;&nbsp;"+vis[1].names[i]+"<br>"
                    }
                }
            } else if (index == 1) {
                r += "<b>Notice:</b><br>This feature is experimental and still under development. Some question may not work at the moment";
            } else if (index == 2) {
                r += "<b>Notice:</b><br>This feature is experimental and still under development. Some question may not work at the moment";
            } else if (index == 3) {
                var ind = vis[4].indexOf(Array.max(vis[4]));
                r += "The student who had the longest duration was <b>"+vis[1].names[ind]+"</b>, taking a total of <b>"+Math.round(vis[4][ind]/1000)+" seconds</b> to complete the test.";
            } else if (index == 4) {
                var indices = new Array();
                for(let i=0; i<vis[3].length; i++) {
                    if(vis[3][i] == null) {indices.push(i);}
                }
                r += "<b>Student who didn't submit the test:</b><br>";
                for(let i=0; i<indices.length; i++) {
                    r += "-&nbsp;&nbsp;&nbsp;"+vis[1].names[indices[i]]+"<br>"
                }
            } else if (index == 5) {
                var range = Array.max(vis[4]) - Array.min(vis[4]);
                range = Math.round(range/1000); // to seconds
                r += "The spread from longest duration to shortest duration was <b>"+range+" seconds.</b>";
            }  else if (index == 6) {
                // Buckle up, this will be HARD :| 
                // But fun? maybe. 3, 2, 1..... GO
                var MASTER = new Array(vis[6].length+1);
                // OK, SO, heres what im thinking:
                // An array where every index is an average of durations from that score. then plot it
                for(let i=0; i<vis[4].length; i++) {
                    var mI = (vis[3][i] == null) ? 0 : vis[3][i];
                    MASTER[mI] = MASTER[mI] || [];
                    MASTER[mI].push(vis[4][i]);
                }
                for(let i=0; i<MASTER.length; i++) {
                    MASTER[i] = vis[0].avg(MASTER[i]) || 0;
                    MASTER[i] = Math.round(MASTER[i]/1000);
                }
                var LABELS = new Array();
                for(let i=0; i<=vis[6].length; i++) {
                    LABELS.push(i+"/"+vis[6].length)
                }
                // Now graph it :P
                r += "<canvas id='visTempCanvasGrapher'></canvas>";
                r += "Above is a line graph depicting the relation between score and duration, where the x-axis is occupied by score."
            } else if (index == 7) {
                var ind = vis[4].indexOf(Array.min(vis[4]));
                r += "The student who had the shortest duration was <b>"+vis[1].names[ind]+"</b>, taking a total of <b>"+Math.round(vis[4][ind]/1000)+" seconds</b> to complete the test.";
            } else if (index == 8) {
                r += "<b>Notice:</b><br>This feature is experimental and still under development. Some question may not work at the moment";
            } else if (index == 9) {
                var g = [];
                for(let i=0; i<vis[3].length; i++) {
                    if(vis[3][i] == vis[6].length) {g.push(i)}
                }
                for(let i=0; i<g.length; i++) {
                    g[i] = vis[1].names[i]
                }
                r += "<b>Students who had a perfect score:</b><br>";
                for(let i=0; i<g.length; i++) {
                    r += "-&nbsp;&nbsp;&nbsp;"+g[i]+"<br>"
                }
                if(g.length == 0) {r+="No students matched this query."}
            } else if (index == 10) {
                r += "<b>No Suspicious Activity Detected.</b><br>All packets sent to and from Test Caplet during the time of testing were signed and authorized.<br><br>"
                r += "<finetext><b>NOTE:</b> Test Caplet does not eavesdrop on client network activity, just the activity on our servers network.</finetext>"
            } else {
                r += "<b>Notice:</b><br>This feature is experimental and still under development. Some question may not work at the moment";
            }

            r +="<finetext style='position:absolute;bottom:5px;'>Powered by Ryan Wans Analytics</finetext>"
            setTimeout(function() {
                $(main).html(r);
                if(index == 6) {
                    new Chart(document.getElementById('visTempCanvasGrapher'), {
                        type: 'line',
                        data: {
                          labels: LABELS,
                          datasets: [{
                              backgroundColor: vis[0].chartColors(1),
                              data: MASTER
                          }]
                        },
                        options: {
                          legend: { display: false },
                          title: {display: false,text: ''},
                          scales: {yAxes: [{ticks: {beginAtZero: true}, drawBorder: false,}], xAxes: [{gridLines: {color: "rgba(0, 0, 0, 0)",}}]}
                        }
                    });
                }
            }, 800);
        }
    }
]