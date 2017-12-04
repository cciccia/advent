const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        const dataArr = data.split('\n').map(row => row.split('\t'));
        dataArr.splice(-1);

        const answer = dataArr.reduce((prev, row) => {
            const result =  row.reduce((p, item) => {
                const num = parseInt(item);

                if (!p.hasOwnProperty('min') || num < p.min) {
                    p.min = num;
                }

                if (!p.hasOwnProperty('max') || num > p.max) {
                    p.max = num;
                }
                return p;
            }, {});
            return prev + result.max - result.min;
        }, 0);
        console.log(answer);
    });