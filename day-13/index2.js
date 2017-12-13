const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

function getSmallestSeverity(data) {
    const security = data.split('\n').reduce((prev, row) => {
        const [depth, range] = row.split(': ').map(num => parseInt(num));
        prev.set(depth, range);
        return prev;
    }, new Map());

    const goal = [...security.keys()].sort((a, b) => b - a)[0];

    function getSeverity(offset) {
        return [...Array(goal + 1).keys()].reduce((prev, i) => {
            const range = security.get(i) || 0;
            return prev + (range && ((i + offset) % ((range - 1) * 2) === 0) ? 1 : 0);
        }, 0);
    }

    let undetected = false;
    let i = 0;
    for (; !undetected; i++) {
        undetected = !getSeverity(i);
    }
    return i - 1;
}

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getSmallestSeverity(data));
    });