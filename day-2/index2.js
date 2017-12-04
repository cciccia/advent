const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        const dataArr = data.split('\n').map(row => row.split('\t').map(item => parseInt(item)).sort((a, b) => a - b).reverse());
        dataArr.splice(-1);

        const answer = dataArr.reduce((prev, row) => {
            return prev + row.reduce((p, num, i) => {
                if (p) {
                    return p;
                }
                const me = row[i];
                const rest = row.slice(i+1);
                return rest.reduce((p1, c1) => {
                    if (p1) {
                        return p1;
                    }
                    if ((me / c1) % 1 === 0) {
                        return me / c1;
                    }
                    return null;
                }, null);
            }, null);
        }, 0);
        console.log(answer);
    });