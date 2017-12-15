class Generator {
    constructor(factor, seed, divisor) {
        this.factor = factor;
        this.value = seed;
        this.divisor = divisor;
    }

    * generator() {
        while (true) {
            this.value = (this.value * this.factor) % 0x7FFFFFFF;
            if (!(this.value & (this.divisor - 1))) {
                yield this.value;
            }
        }
    }
}

function getJudgedCount(rounds, seedA, seedB) {
    genA = new Generator(16807, seedA, 4).generator();
    genB = new Generator(48271, seedB, 8).generator();
    return [...Array(rounds).keys()].reduce((prev, _) => {
        const a = genA.next().value;
        const b = genB.next().value;

        if ((a & 0xFFFF) === (b & 0xFFFF)) {
            return prev + 1;
        } else {
            return prev;
        }
    }, 0);
}

console.log(getJudgedCount(parseInt(process.argv[2]), parseInt(process.argv[3]), parseInt(process.argv[4])));