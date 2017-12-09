const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

function getGroupScore(data) {
    return [...data].reduce(({total, inGarbage, ignoreNext}, character) => {
        if (ignoreNext) {
            ignoreNext = false;
        } else if (inGarbage && character === '>') {
            inGarbage = false;
        } else if (inGarbage && character === '!') {
            ignoreNext = true;
        } else if (!inGarbage && character === '<') {
            inGarbage = true;
        } else if (inGarbage) {
            total++;
        }
        // else this is a group separator and we don't care about that for this problem
        
        return {total, inGarbage, ignoreNext};
    }, {
        total: 0,
        inGarbage: false,
        ignoreNext: false
    }).total;
}

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getGroupScore(data));
    });