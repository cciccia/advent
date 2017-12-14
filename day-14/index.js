// hey it's day 10 again
function doRound(sequence, list, skip, position) {
    const size = list.length;

    return sequence.reduce(({list, skip, position}, length) => {
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
        list,
        skip,
        position
    });
}

function getHash(data) {
    const sequence = [...data].map(character => character.charCodeAt(0)).concat([17, 31, 73, 47, 23]);
    
    const sparseHash = [...Array(64).keys()].reduce(({list, skip, position}, _) => {
        return doRound(sequence, list, skip, position);
    }, {
        list: [...Array(256).keys()],
        skip: 0,
        position: 0
    });

    const denseHash = sparseHash.list.reduce((prev, num, i) => {
        prev[Math.floor(i / 16)] = prev[Math.floor(i / 16)] !== undefined ? prev[Math.floor(i / 16)] ^ num : num;
        return prev;
    }, []);

    return denseHash.reduce((prev, num) => {
        const hex = num.toString(16);
        return prev += hex.length === 1 ? `0${hex}` : hex;
    }, "");

}

function getUsage(input) {
    // for perf in case we need it
    const usageLookup = new Map([
        ['0', 0],
        ['1', 1],
        ['2', 1],
        ['3', 2],
        ['4', 1],
        ['5', 2],
        ['6', 2],
        ['7', 3],
        ['8', 1],
        ['9', 2],
        ['a', 2],
        ['b', 3],
        ['c', 2],
        ['d', 3],
        ['e', 3],
        ['f', 4]
    ]);

    return [...Array(128).keys()].reduce((prev, i) => {
        const hash = getHash(`${input}-${i}`);
        return prev + [...hash].reduce((p, character) => {
            return p + usageLookup.get(character);
        }, 0)
    }, 0);
}

console.log(getUsage(process.argv[2]));

