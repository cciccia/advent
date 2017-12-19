const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getFrequency(data.split('\n')));
    });

function getFrequency(instructions) {
    const registers = new Map();

    function set(reg, val) {
        registers.set(reg, val);
    }

    function get(reg) {
        return registers.get(reg);
    }

    function resolve(rVal) {
        if (isNaN(parseInt(rVal))) {
            return get(rVal);
        } else {
            return parseInt(rVal);
        }
    }
    
    let pointer = 0;
    let stack;

    while (true) {
        const [cmd, x, y] = instructions[pointer].split(' ');
        const xVal = resolve(x);
        const yVal = resolve(y);

        switch (cmd) {
        case 'snd':
            stack = xVal;
            pointer++;
            break;
        case 'set':
            set(x, yVal);
            pointer++;
            break;
        case 'add':
            set(x, xVal + yVal);
            pointer++;
            break;
        case 'mul':
            set(x, xVal * yVal);
            pointer++;
            break;
        case 'mod':
            set(x, xVal % yVal);
            pointer++;
            break;
        case 'rcv':
            if (xVal) {
                return stack;
            }
            pointer++;
            break;
        case 'jgz':
            if (xVal > 0) {
                pointer += yVal;
            } else {
                pointer++;
            }
            break;
        }

        if (pointer < 0 || pointer >= instructions.length) {
            return;
        }
    }
    
}