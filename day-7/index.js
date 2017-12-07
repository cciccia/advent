const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

function getBottomName(data) {
    let checkItem;
    const towers = data.split('\n').reduce((prev, datum) => {
        const row = datum.replace(/,/g, '').split(' ');
        const parent = row[0];
        if (!checkItem) {
            checkItem = parent;
        }

        row.slice(3).forEach(item => {
            prev.set(item, parent);
        });
        return prev;
    }, new Map());

    while (true) {
        if (towers.has(checkItem)) {
            checkItem = towers.get(checkItem);
        } else {
            return checkItem;
        }
    }
}

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getBottomName(data));
    });