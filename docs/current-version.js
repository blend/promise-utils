const path = require('path');

function main() {
    const filename = path.join(__dirname, '../package.json');
    var pjson = require(filename);
    console.log(pjson.version);
}

if (require.main === module) {
    main();
}
