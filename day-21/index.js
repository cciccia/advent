const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(
            headOnApplyDirectlyToTheForehead(data.split('\n')
                                             .map(row => row.split(' => ')), parseInt(process.argv[3]))
        );
    });

function headOnApplyDirectlyToTheForehead(rulesList, iterations) {
    const rules = new Map(rulesList);

    return [...Array(iterations).keys()].map(i => i + 1)
        .reduce((prev, _) => grow(rules, prev, !(prev.length % 2) ? 2 : 3), deserialize('.#./..#/###'))
        .reduce((prev, row) => prev + row.reduce((p, cell) => p + cell, 0), 0);
}

function serialize(arr) {
    return arr.map(row => row.map(cell => cell ? '#' : '.').join('')).join('/');
}

function deserialize(repr) {
    return repr.split('/').map(row => row.split('').map(cell => cell === '#' ? 1 : 0));
}

function flip(arr) {
    return arr.reverse();
}

function split(arr, factor) {
    const slices = arr.length / factor;
    const splitArrs = [];
    for (let i = 0; i < Math.pow(slices, 2); i++) {
        splitArrs[i] = [];
        for (let y = 0; y < factor; y++) {
            splitArrs[i][y] = [];
            for (let x = 0; x < factor; x++) {
                splitArrs[i][y][x] = arr[y + factor * Math.floor(i / slices)][x + factor * (i % slices)];
            }
        }
    }
    return splitArrs;
}

function join(arrs) {
    const slices = Math.sqrt(arrs.length);
    const factor = arrs[0].length;

    const joinArr = [];
    for (let y = 0; y < factor * slices; y++) {
        joinArr[y] = [];
    }

    for (let i = 0; i < Math.pow(slices, 2); i++) {
        for (let y = 0; y < factor; y++) {
            for (let x = 0; x < factor; x++) {
                joinArr[y + factor * Math.floor(i / slices)][x + factor * (i % slices)] = arrs[i][y][x];
            }
        }
    }
    return joinArr;
}

function rotate(arr) {
    const newArr = [];

    for (let y = 0; y < arr.length; y++) {
        newArr[y] = [];
    }

    for (let y = 0; y < arr.length; y++) {
        for (let x = 0; x < arr.length; x++) {
            newArr[x][arr.length - y - 1] = arr[y][x];
        }
    }
    
    return newArr;
}

function grow(rules, arr, factor) {
    const splitArrs = split(arr, factor);

    const matchArrs = splitArrs.map(splitArr => {
        let matchArr;
        for (let i = 0; i < 8; i++) {
            if (rules.has(serialize(splitArr))) {
                matchArr = deserialize(rules.get(serialize(splitArr)));
                break;
            }

            if (i === 3) {
                splitArr = flip(splitArr);
            } else {
                splitArr = rotate(splitArr);
            }
        }
        return matchArr;
    });

    return join(matchArrs);
}