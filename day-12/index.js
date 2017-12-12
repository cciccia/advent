const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

function getProgramCount(data) {
    const pipes = data.split('\n').reduce((prev, row) => {
        const [source, _, ...dest] = row.replace(/,/g, "").split(' ').map(item => parseInt(item));
        prev.set(source, dest);
        return prev;
    }, new Map());

    function getAllConnectedPrograms(program, connected) {
        if (connected.has(program)) {
            return connected;
        }
        
        connected.add(program);
        return pipes.get(program).reduce((prev, dest) => {
            return getAllConnectedPrograms(dest, prev);
        }, connected);
    }

    return getAllConnectedPrograms(0, new Set()).size;
}

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getProgramCount(data));
    });