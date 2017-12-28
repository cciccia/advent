const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(moveToTheBigBand(data.split('\n').map(row => row.split('/').map(num => parseInt(num)))));
    });

function build(components, compMap, len, strength, connectBy, used) {
    const connectorIndices = (compMap.get(connectBy) || []).filter(idx => !used.has(idx));
    
    return connectorIndices.reduce((prev, connectorIdx) => {
        const [a, b] = components[connectorIdx];
        const newUsed = new Set(used);
        newUsed.add(connectorIdx);
        
        const [from, to] = a === connectBy ? [a, b] : [b, a];
        
        const result = build(components, compMap, len + 1, strength + from + to, to, newUsed);

        if (result.len > prev.len || result.len === prev.len && result.strength > prev.strength) {
            return {len: result.len,
                    strength: result.strength};
        } else {
            return {len: prev.len,
                    strength: prev.strength};
        }
        
    }, {len, strength});
}

function moveToTheBigBand(components) {
    const compMap = components.reduce((prev, [a, b], i) => {
        prev.set(a, (prev.get(a) || []).concat([i]));
        prev.set(b, (prev.get(b) || []).concat([i]));
        return prev;
    }, new Map());

    return build(components, compMap, 0, 0, 0, new Set());
}