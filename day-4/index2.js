const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        const dataArr = data.split('\n').map(row => row.split(' '));

        const answer = dataArr.reduce((prev, row) => {
            let unique = 1;
            const wordMaps = new Set();
            for (let word of row) {
                const wordMap = [...word].reduce((p, character) => {
                    p[character] = p[character] + 1 || 1;
                    return p;
                }, {});
                const sortedWordMap = JSON.stringify(wordMap, Object.keys(wordMap).sort());
                if (wordMaps.has(sortedWordMap)) {
                    unique = 0;
                    break;
                }
                wordMaps.add(sortedWordMap);
            }
            return prev + unique;
        }, 0);
        console.log(answer);
    });