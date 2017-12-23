const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(f(new Set(data.replace(/\n/g, ' ').split(' ').map(num => parseInt(num)))));
    });

function f(primes) {
    let answer = 0;
    for (i = 105700; i < 122700; i += 17) {
    
        if (!primes.has(i)) {
            answer++;
        }
    }
    return answer;
}
