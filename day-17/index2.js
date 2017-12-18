function getSpinValue(step, iterations, target) {
    return [...Array(iterations).keys()].map(i => i + 1).reduce(({last, counter}, i) => {
        counter = (step + counter) % i + 1;
        if (counter === 1) {
            last = i;
        }
        return {last, counter};
    }, {last:0, counter: 0}).last;
}

console.log(getSpinValue(parseInt(process.argv[2]), parseInt(process.argv[3]), parseInt(process.argv[4])));