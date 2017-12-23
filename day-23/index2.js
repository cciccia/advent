const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(lol(data.replace(/\n/g, ' ').split(' ').map(num => parseInt(num))));
    });

function lol(primes) {
    // this basically says 'how many numbers between (105700 and 122000, inclusive, stepping by 17) aren't prime', which is what that program is (slowly) doing
    return 1001 - (primes.filter(prime => !((prime - 105700) % 17)).length);
}
