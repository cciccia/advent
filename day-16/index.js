const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

function getOrder(moves) {
    return moves.reduce((prev, move) => {
        const command = move[0];
        const rest = move.slice(1);
        
        switch (command) {
        case 's':
            const num = parseInt(rest);
            prev = prev.slice(-num).concat(prev.slice(0, -num));
            break;
        case 'x':
            const [sI, dI] = rest.split('/').map(x => parseInt(x));
            const tmp = prev[dI];
            prev[dI] = prev[sI];
            prev[sI] = tmp;
            break;
        case 'p':
            const [s, d] = rest.split('/');
            const sI2 = prev.indexOf(s);
            const dI2 = prev.indexOf(d);
            const tmp2 = prev[dI2];
            prev[dI2] = prev[sI2];
            prev[sI2] = tmp2;
            break;
        }
        return prev;
    }, [...Array(16).keys()].map(i => String.fromCharCode(i + 97))).join('');
}

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getOrder(data.split(',')));
    });