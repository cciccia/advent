const Promise = require('bluebird');
const yaml = Promise.promisifyAll(require('node-yaml'));

yaml.readAsync(process.argv[2])
    .then(data => {
        console.log(geterdone(data, parseInt(process.argv[3]), process.argv[4]));
    });

function geterdone(rules, iterations, state) {
    return [...Array(iterations).keys()].reduce(({tape, cursor, state}, _) => {
        const value = tape.has(cursor) ? 1 : 0;
        const [newValue, direction, newState] = rules[state][value];

        if (newValue) {
            tape.add(cursor);
        } else {
            tape.delete(cursor);
        }

        if (direction === 'right') {
            cursor++;
        } else {
            cursor--;
        }

        state = newState;

        return {tape, cursor, state};
    }, {tape: new Set(), cursor: 0, state}).tape.size;
}

