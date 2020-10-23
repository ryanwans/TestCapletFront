-(function(){
    var fs = require('fs');
    var Package = fs.readFileSync('./package.json', {root: __dirname});
    Package = JSON.parse(Package);
    let Version = Package.version;
    console.log("\n\n> Pulled Test Caplet Version: "+Version+"\n\n")
})()