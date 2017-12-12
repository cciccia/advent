const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

function getGroupCount(data) {
    const pipes = data.split('\n').reduce((prev, row) => {
        const [source, _, ...dest] = row.replace(/,/g, "").split(' ').map(item => parseInt(item));
        prev.set(source, dest);
        return prev;
    }, new Map());

    function getAllConnectedPrograms(program, connected = new Set()) {
        if (connected.has(program)) {
            return connected;
        }
        
        connected.add(program);
        return pipes.get(program).reduce((prev, dest) => {
            return getAllConnectedPrograms(dest, prev);
        }, connected);
    }

    return [...new Set(data.split('\n').map(row => {
        const [source, ..._] = row.replace(/,/g, "").split(' ').map(item => parseInt(item));
        return JSON.stringify([...getAllConnectedPrograms(source).keys()].sort((a, b) => a - b));
    }))].length;
}

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getGroupCount(data));
    });