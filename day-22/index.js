const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(
            lolbirst(data.split('\n')
                     .map(row => row.split('')), parseInt(process.argv[3]))
        );
    });

function lolbirst(grid, iterations) {
    const infected = grid.reduce((prev, row, y) => {
        return row.reduce((p, cell, x) => {
            if (cell === '#') {
                p.add(`${x},${y}`);
            }
            return p;
        }, prev);
    }, new Set());

    let location = {x: (grid[0].length - 1) / 2, y: (grid.length - 1) / 2};
    let direction = 'n';
    
    return [...Array(iterations).keys()].reduce((prev, i) => {
        const locRepr = `${location.x},${location.y}`;
        if (infected.has(locRepr)) {
            direction = turn(direction, 'right');
            infected.delete(locRepr);
        } else {
            direction = turn(direction, 'left');
            infected.add(locRepr);
            prev++;
        }
        location = move(location, direction);
        return prev;
    }, 0);
}

function turn(faceDirection, turnDirection) {
    const directions = ['n', 'e', 's', 'w'];

    if (turnDirection === 'right') {
        return directions[(directions.indexOf(faceDirection) + 1) % 4];
    } else {
        return directions[(directions.indexOf(faceDirection) + 3) % 4];
    }
}

function move(location, direction) {
    switch (direction) {
    case 'n':
        location.y--;
        break;
    case 'e':
        location.x++;
        break;
    case 's':
        location.y++;
        break;
    case 'w':
        location.x--;
        break;
    }
    return location;
}