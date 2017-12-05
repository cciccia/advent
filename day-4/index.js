const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        const dataArr = data.split('\n').map(row => row.split(' '));

        const answer = dataArr.reduce((prev, row) => {
            let unique = 1;
            const words = new Map();
            for (let word of row) {
                if (words.has(word)) {
                    unique = 0;
                    break;
                }
                words.set(word);
            }
            return prev + unique;
        }, 0);
        console.log(answer);
    });