const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getPath(data.split('\n').map(row => row.split(''))));
    });

function getPath(grid) {
    const PLUS = '+';
    const SPACE = ' ';

    const directions = ['n', 'e', 's', 'w'];
    let position = {x: grid[0].indexOf('|'), y: 0};
    let direction = 's';
    let treasure = '';
    let steps = 0;

    function get(pos) {
        return pos.y in grid ? grid[pos.y][pos.x] || SPACE : SPACE;
    }

    function turnRight(dir) {
        return directions[(directions.indexOf(dir) + 1) % directions.length];
    }

    function turnLeft(dir) {
        return directions[(directions.indexOf(dir) + 3) % directions.length];
    }

    function move(pos, dir) {
        switch (dir) {
        case 'n':
            return {x: pos.x, y: pos.y - 1};
        case 'e':
            return {x: pos.x + 1, y: pos.y};
        case 's':
            return {x: pos.x, y: pos.y + 1};
        case 'w':
            return {x: pos.x - 1, y: pos.y};
        }
    }

    function peek(pos, dir) {
        return get(move(pos, dir));
    }

    while (true) {
        const character = get(position);

        if (character.charCodeAt(0) >= 65 && character.charCodeAt(0) <= 90) {
            treasure += character;
        } else if (character === PLUS) {
            if (peek(position, turnRight(direction)) !== SPACE) {
                direction = turnRight(direction);
            } else if (peek(position, turnLeft(direction)) !== SPACE) {
                direction = turnLeft(direction);
            } else {
                break;
            }
        } else if (character === SPACE) {
            break;
        }
        position = move(position, direction);
        steps++;
    }

    return [treasure, steps];
}