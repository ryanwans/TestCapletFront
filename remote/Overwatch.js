exports.test = (StartTime, TestMetadata, Bank) => {
    var TestFile = new Object();
    TestFile.metadata = new Object();
    TestFile.metadata.start = StartTime;
    TestFile.metadata.meta = TestMetadata;
    TestFile.student = TestMetadata.studentName;
    TestFile.id = TestMetadata.tuid;

    TestFile.shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
    };
    if(TestMetadata.meta.time != null) {
        TestFile.endTime = StartTime + TestMetadata.meta.time;
    }
    TestFile.count = TestMetadata.meta.count;
    TestFile.wPro = TestMetadata.meta.wProtect;
    TestFile.live = TestMetadata.meta.useLive;
    TestFile.bank = Bank;
    console.debug("New Overwatch Object Has Been Created!");
    return TestFile;
}

exports.Fetch = async (endpoint, method, query, data) => {
    console.debug("Fetching...");
    const fetch = require('electron-fetch').default;
    let now;
    let QueryPromise = new Promise((resolve, reject) => {
        return resolve((async () => {

            const res = await fetch(endpoint+query, {
                method: method,
                body: ("POST" == method) ? data : null,
                headers: { 'Content-Type': 'application/json' },
            });
            now = await res.json();
        })());
    });

    await QueryPromise;
    return now;
}