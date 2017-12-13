const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

function getSeverity(data) {
    const security = data.split('\n').reduce((prev, row) => {
        const [depth, range] = row.split(': ').map(num => parseInt(num));
        prev.set(depth, range);
        return prev;
    }, new Map());

    const goal = [...security.keys()].sort((a, b) => b - a)[0];

    return [...Array(goal + 1).keys()].reduce((prev, depth, i) => {
        const range = security.get(depth) || 0;
        return prev + ((i % ((range - 1) * 2) === 0) ? depth * range : 0);
    }, 0);
}

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getSeverity(data));
    });