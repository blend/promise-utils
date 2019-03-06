const fs = require('fs');
const path = require('path');
const process = require('process');

function main() {
    const currentVersion = process.argv[2];
    const filename = path.join(__dirname, '../docs-build/versions.json');
    const versions = require(filename);
    versions.push(currentVersion);
    fs.writeFileSync(filename, JSON.stringify(versions));
}

if (require.main === module) {
    main();
}
