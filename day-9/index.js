const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

function getGroupScore(data) {
    return [...data].reduce(({total, level, inGarbage, ignoreNext}, character) => {
        if (ignoreNext) {
            ignoreNext = false;
        } else if (inGarbage && character === '>') {
            inGarbage = false;
        } else if (inGarbage && character === '!') {
            ignoreNext = true;
        } else if (!inGarbage && character === '<') {
            inGarbage = true;
        } else if (!inGarbage && character === '{') {
            level++;
        } else if (!inGarbage && character === '}') {
            total += level--;
        }
        // else in garbage and do nothing
        
        return {total, level, inGarbage, ignoreNext};
    }, {
        total: 0,
        level: 0,
        inGarbage: false,
        ignoreNext: false
    }).total;
}

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getGroupScore(data));
    });