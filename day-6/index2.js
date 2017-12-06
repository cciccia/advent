const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

function getRedistributionCount(data) {
    const banks = data.split('\t').map(num => parseInt(num));
    const configurations = new Map();
    let iteration = 0;
    
    while (true) {
        const configuration = JSON.stringify(banks);

        if (configurations.has(configuration)) {
            return iteration - configurations.get(configuration);
        } else {
            configurations.set(configuration, iteration);
        }

        iteration++;
        
        const largestBank = banks.reduce((prev, cur, i) => {
            if (cur > prev.size) {
                return {idx: i, size: cur};
            } else {
                return prev;
            }
        }, {idx: -1, size: -1});

        banks[largestBank.idx] = 0;
        let whereToRedistribute = (largestBank.idx + 1) % banks.length;

        for (let howManyToRedistribute = largestBank.size; howManyToRedistribute > 0; howManyToRedistribute--) {
            banks[whereToRedistribute]++;
            whereToRedistribute = (whereToRedistribute + 1) % banks.length;
        }
    }
}

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getRedistributionCount(data));
    });