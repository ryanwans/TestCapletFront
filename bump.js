-(function(){
    var fs = require('fs');
    var Package = fs.readFileSync('./package.json', {root: __dirname});
    Package = JSON.parse(Package);
    let Version = Package.version;
    Version = Version.split(".");
    if(parseInt(Version[2]) >= 10) {
            console.log("Version Patching Full, New Minor Update");
            Version[2] = "0";
            if(parseInt(Version[1]) >= 10) {
                    console.log("Version Minor Full, New Major Update");
                    Version[1] = "0";
                    Version[0] = parseInt(Version[0]);
                    Version[0]++;
            } else {
                    console.log("Minor Updated");
                    Version[1] = parseInt(Version[1]);
                    Version[1]++;
            }
    } else {
        console.log("Patch Updated");
        Version[2] = parseInt(Version[2]);
        Version[2]++;
    }
    Version = Version.join('.');
    console.log("New Version: "+Version);
    Package.version = Version;
    fs.writeFileSync('./package.json', JSON.stringify(Package, null, 4), {root: __dirname});
    console.log("Finished writing updates!");
})()