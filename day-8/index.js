const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        const instructions = data.split('\n');

        const finishedState = instructions.reduce((mem, instruction) => {
            function get(reg) {
                return mem.get(reg) || 0;
            }

            function inc(reg, value) {
                mem.set(reg, get(reg) + value);
            }

            function dec(reg, value) {
                mem.set(reg, get(reg) - value);
            }

            const instructionArr = instruction.split(' ');
            const reg = instructionArr[0];
            const op = instructionArr[1];
            const value = parseInt(instructionArr[2]);

            const condReg = instructionArr[4];
            const condOp = instructionArr[5];
            const condVal = parseInt(instructionArr[6]);

            if (eval(`${get(condReg)}${condOp}${condVal}`)) {
                if (op === 'inc') {
                    inc(reg, value);
                } else if (op === 'dec') {
                    dec(reg, value);
                }
            }
            return mem;
        }, new Map());

        const largest = [...finishedState.entries()].reduce((prev, [key, value]) => {
            if (!prev.hasOwnProperty('key') || value > prev['value']) {
                prev = {key, value};
            }
            return prev;
        }, {});
        console.log(largest.value);
    });
        