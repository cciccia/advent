const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

function getDistance(data) {
    // x - where we are on the ne-sw wrt y axis
    // y - where we are on the n-s wrt x axis
    return data.split(',').reduce(({x, y, largest}, move) => {
        switch (move) {
        case 'se':
            x++;
            break;
        case 'nw':
            x--;
            break;
        case 'n':
            y++;
            break;
        case 's':
            y--;
            break;
        case 'ne':
            x++, y++;
            break;
        case 'sw':
            x--, y--;
        }

        // the shortest distance is the sum of smallest (by abs) two of (x, y, (x-y)) representing the three 'axes'
        const distArr = [Math.abs(x), Math.abs(y), Math.abs(x - y)].sort((a, b) => a-b);

        largest = Math.max(largest,  distArr[0] + distArr[1]);
        
        return {x, y, largest};
    }, {x: 0, y: 0, largest: 0}).largest;
}

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getDistance(data));
    });