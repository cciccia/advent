function getSpinValue(step, target) {
    const result = [...Array(target).keys()].map(i => i + 1).reduce(({data, counter}, value) => {
        counter = (counter + step) % data.length;
        data.splice(++counter, 0, value);

        return {data, counter};
    }, {data: [0], counter: 0});

    return result.data[(result.counter + 1) % result.data.length];
}

console.log(getSpinValue(parseInt(process.argv[2]), parseInt(process.argv[3])));