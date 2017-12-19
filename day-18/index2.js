const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        answerTheGoddamnProblemIGuess(data.split('\n'));
    });

function chan() {
    const buffer = [];
    let ready;

    return {
        put: value => {
            buffer.unshift(value);
            if (ready) {
                ready();
                ready = null;
            }
        },
        take: () => {
            return new Promise((resolve, reject) => {
                if (buffer.length) {
                    resolve(buffer.pop());
                } else {
                    ready = () => {
                        resolve(buffer.pop());
                    };
                }
            });
        }
    };
}

function answerTheGoddamnProblemIGuess(instructions) {
    const abChan = chan();
    const baChan = chan();

    const zero = new Program(0, instructions, abChan, baChan);
    const one = new Program(1, instructions, baChan, abChan);

    zero.execute();
    one.execute().then(val => console.log(val))
}

class Program {
    constructor(id, instructions, sendChan, recvChan) {
        this.id = id;
        this.instructions = instructions;
        this.sendChan = sendChan;
        this.recvChan = recvChan;
        this.registers = new Map([['p', id]]);
        this.pointer = 0;
        this.sends = 0;
        this.stop = false;
    }

    setValue(reg, val) {
        this.registers.set(reg, val);
    }

    getValue(reg) {
        return this.registers.get(reg);
    }

    resolveValue(rVal)  {
        if (isNaN(parseInt(rVal))) {
            return this.getValue(rVal);
        } else {
            return parseInt(rVal);
        }
    }

    execute() {
        return this._execute()
            .then(result => {
                if (result) {
                    return result;
                } else {
                    return this.execute();
                }
            });
    }

    _execute() {
        return Promise.try(() => {
            if (this.pointer < 0 || this.pointer >= this.instructions.length) {
                return this.sends;
            }
            
            const [cmd, x, y] = this.instructions[this.pointer].split(' ');
            const xVal = this.resolveValue(x);
            const yVal = this.resolveValue(y);
            
            switch (cmd) {
            case 'snd':
                this.sendChan.put(xVal);
                this.sends++;
                this.pointer++;
                break;
            case 'set':
                this.setValue(x, yVal);
                this.pointer++;
                break;
            case 'add':
                this.setValue(x, xVal + yVal);
                this.pointer++;
                break;
            case 'mul':
                this.setValue(x, xVal * yVal);
                this.pointer++;
                break;
            case 'mod':
                this.setValue(x, xVal % yVal);
                this.pointer++;
                break;
            case 'rcv':
                return Promise.race([
                    this.recvChan.take().then(val => {
                        this.setValue(x, val);
                        this.pointer++;
                    }),
                    new Promise((resolve, reject) => {
                        setTimeout(resolve, 5000, this.sends)
                    })
                ]);
                break;
            case 'jgz':
                if (xVal > 0) {
                    this.pointer += yVal;
                } else {
                    this.pointer++;
                }
                break;
            }
        });
    }
}