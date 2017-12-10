const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

function getHash(data, size) {
    const result =  data.split(',').reduce(({list, skip, position}, length) => {
        length = parseInt(length);

        for (let i = 0; i < Math.floor(length / 2); i++) {
            const tmp = list[(position + i) % size];
            list[(position + i) % size] = list[(position + (length - i - 1)) % size];
            list[(position + (length - i - 1)) % size] = tmp;
        }

        position = (position + length + skip++) % size;
        
        return {
            list,
            skip,
            position
        };
    }, {
        list: [...Array(size).keys()],
        skip: 0,
        position: 0
    });

    return result.list[0] * result.list[1];
}

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getHash(data, parseInt(process.argv[3])));
    });