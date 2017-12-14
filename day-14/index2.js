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

//a wild day 12 appears
function getGroupCount(pipes) {
    function getAllConnectedPrograms(program, connected = new Set()) {
        if (connected.has(program)) {
            return connected;
        }
        
        connected.add(program);
        return pipes.get(program).reduce((prev, dest) => {
            return getAllConnectedPrograms(dest, prev);
        }, connected);
    }

    return [...new Set([...pipes.keys()].map(source => {
        return JSON.stringify([...getAllConnectedPrograms(source).keys()].sort());
    }))].length;
}

function getRegions(input) {
    const expansionLookup = new Map([
        ['0', '0000'],
        ['1', '0001'],
        ['2', '0010'],
        ['3', '0011'],
        ['4', '0100'],
        ['5', '0101'],
        ['6', '0110'],
        ['7', '0111'],
        ['8', '1000'],
        ['9', '1001'],
        ['a', '1010'],
        ['b', '1011'],
        ['c', '1100'],
        ['d', '1101'],
        ['e', '1110'],
        ['f', '1111']
    ]);

    const grid = [...Array(128).keys()].reduce((prev, i) => {
        const hash = getHash(`${input}-${i}`);
        return [...hash].reduce((p, character, j) => {
            const [a, b, c, d] = [...expansionLookup.get(character)].map(digit => digit === '1');;
            p.set(`${j * 4 + 0}:${i}`, a);
            p.set(`${j * 4 + 1}:${i}`, b);
            p.set(`${j * 4 + 2}:${i}`, c);
            p.set(`${j * 4 + 3}:${i}`, d);
            return p;
        }, prev);
    }, new Map());

    const connectedGroups = [...Array(128).keys()].reduce((prev, i) => {
        return [...Array(128).keys()].reduce((p, j) => {
            const me = `${j}:${i}`;
            if (grid.get(me)) {
                const up = `${j}:${i-1}`;
                const down = `${j}:${i+1}`;
                const left = `${j-1}:${i}`;
                const right = `${j+1}:${i}`;

                p.set(me, [me, up, down, left, right].filter(item => grid.get(item)));
            }
            return p;
        }, prev);
    }, new Map());

    return getGroupCount(connectedGroups);
}

console.log(getRegions(process.argv[2]));

