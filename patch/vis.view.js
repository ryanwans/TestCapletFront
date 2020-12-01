// data graphs and stuff w/ ryan wans :)

const chart = require('electron-chartjs');

window.vis = [
    {
        render: (DataSet) => {
            window.vis[1]       = new Object();
            window.vis[1].names = Object.keys(DataSet);
            window.vis[1].data  = Object.values(DataSet);

            // Render Names
            for(let i=0; i<window.vis[1].names.length; i++) {
                window.vis[1].names[i] = atob(window.vis[1].names[i]);
            }

            var ChartType = {
                "number": "bar",
                "array": "horizontalBar",
                "object": "bar"   //  Grouped Bar
            };

            window.vis[2] = new Object();   // Student Answers
            window.vis[3] = new Array();    // Student Scores
            window.vis[4] = new Array();    // Student Test Times
            window.vis[5] = new Array();    // Student Submission Rate
            
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

            // continue to aggregate data and form charts
        }
    }
]