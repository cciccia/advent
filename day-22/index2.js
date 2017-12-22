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
    const CLEAN = 0, WEAKENED = 1, INFECTED = 2, FLAGGED = 3;
    const states = grid.reduce((prev, row, y) => {
        return row.reduce((p, cell, x) => {
            if (cell === '#') {
                p.set(`${x},${y}`, INFECTED);
            } else {
                p.set(`${x},${y}`, CLEAN);
            }
            return p;
        }, prev);
    }, new Map());

    let location = {x: (grid[0].length - 1) / 2, y: (grid.length - 1) / 2};
    let direction = 'n';
    
    return [...Array(iterations).keys()].reduce((prev, i) => {
        const locRepr = `${location.x},${location.y}`;
        const state = states.get(locRepr) || CLEAN;
        switch (state) {
        case CLEAN:
            direction = turn(direction, 'left');
            states.set(locRepr, WEAKENED);
            break;
        case WEAKENED:
            states.set(locRepr, INFECTED);
            prev++;
            break;
        case INFECTED:
            direction = turn(direction, 'right');
            states.set(locRepr, FLAGGED);
            break;
        case FLAGGED:
            direction = turn(direction, 'reverse');
            states.set(locRepr, CLEAN);
            break;
        }
        location = move(location, direction);
        return prev;
    }, 0);
}

function turn(faceDirection, turnDirection) {
    const directions = ['n', 'e', 's', 'w'];

    if (turnDirection === 'right') {
        return directions[(directions.indexOf(faceDirection) + 1) % 4];
    } else if (turnDirection === 'left') {
        return directions[(directions.indexOf(faceDirection) + 3) % 4];
    } else if (turnDirection === 'reverse') {
        return directions[(directions.indexOf(faceDirection) + 2) % 4];
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