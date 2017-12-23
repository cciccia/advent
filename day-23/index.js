const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(smorgasboard(data.split('\n')));
    });

function smorgasboard(instructions) {
    const registers = new Map();

    function set(reg, val) {
        registers.set(reg, val);
    }

    function get(reg) {
        return registers.get(reg) || 0;
    }

    function resolve(rVal) {
        if (isNaN(parseInt(rVal))) {
            return get(rVal);
        } else {
            return parseInt(rVal);
        }
    }

    let pointer = 0;
    let mulCount = 0;

    set('a', 1);

    while (true) {
        console.log(pointer, 'a', get('a'), 'b', get('b'), 'c', get('c'), 'd', get('d'), 'e', get('e'), 'f', get('f'), 'g', get('g'), 'h', get('h'));
        
        const [cmd, x, y] = instructions[pointer].split(' ');
        const xVal = resolve(x);
        const yVal = resolve(y);

        switch (cmd) {
        case 'set':
            set(x, yVal);
            pointer++;
            break;
        case 'sub':
            set(x, xVal - yVal);
            pointer++;
            break;
        case 'mul':
            set(x, xVal * yVal);
            pointer++;
            mulCount++;
            break;
        case 'jnz':
            if (xVal) {
                pointer += yVal;
            } else {
                pointer++;
            }
            break;
        }

        if (pointer < 0 || pointer >= instructions.length) {
            return mulCount;
        }
    }
}

