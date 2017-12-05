const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        const instructions = data.split('\n');
        const upperBound = instructions.length;
        let count = 0;
        let pointer = 0;

        while (true) {
            pointer += instructions[pointer]++;
            count++;

            if (pointer < 0 || pointer >= upperBound) {
                break;
            }
        }
        console.log(count);
    });