const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

function getDistance(data) {
    // x - where we are on the ne-sw wrt y axis
    // y - where we are on the n-s wrt x axis
    const finalLocation = data.split(',').reduce(({x, y}, move) => {
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
        
        return {x, y};
    }, {x: 0, y: 0});

    // the shortest distance is the sum of smallest (by abs) two of (x, y, (x-y)) representing the three 'axes'
    const distArr = [Math.abs(finalLocation.x), Math.abs(finalLocation.y), Math.abs(finalLocation.x - finalLocation.y)].sort((a, b) => a-b);

    return distArr[0] + distArr[1];
}

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getDistance(data));
    });