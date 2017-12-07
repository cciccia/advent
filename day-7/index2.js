const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

//solution to part 1, copied as is
function getBottomName(data) {
    let checkItem;
    const towers = data.split('\n').reduce((prev, datum) => {
        const row = datum.replace(/,/g, '').split(' ');
        const parent = row[0];
        if (!checkItem) {
            checkItem = parent;
        }

        row.slice(3).forEach(item => {
            prev.set(item, parent);
        });
        return prev;
    }, new Map());

    while (true) {
        if (towers.has(checkItem)) {
            checkItem = towers.get(checkItem);
        } else {
            return checkItem;
        }
    }
}

// part 2
function getCorrectedWeight(data) {
    let checkItem;
    const towers = data.split('\n').reduce((prev, datum) => {
        const row = datum.replace(/,/g, '').split(' ');
        const parent = row[0];
        const weight = parseInt(row[1].slice(1, row[1].length - 1));

        const entry = {};

        entry.value = parent;
        entry.weight = weight;
        entry.children = [];
        row.slice(3).forEach(item => {
            entry.children = entry.children.concat([item]);
        });
        prev.set(parent, entry);
        return prev;
    }, new Map());

    function getTotalNodeWeight(node) {
        if (!node.children.length) {
            return node.weight;
        } else {
            return node.weight + node.children.reduce((prev, child) => {
                return prev + getTotalNodeWeight(towers.get(child));
            }, 0);
        }
    }

    function possiblyProblematicChildren( node ) {
        const weights = node.children
            .map(child => {
                return getTotalNodeWeight(towers.get(child));
            });
        return node.children
            .filter((x, i) => weights.indexOf(weights[i], weights.indexOf(weights[i]) + 1) === -1);
    }

    function hasUnbalancedChildren(node) {
        return node.children
            .map(child => {
                return getTotalNodeWeight(towers.get(child));
            })
            .filter((x, i, a) => a.indexOf(x) === i)
            .length !== 1;
    }

    function findWrongNodeWeightDifferential(node) {
        if (!node.children.length) {
            return null;
        } else {
            return possiblyProblematicChildren(node).map(child => towers.get(child))
                .reduce((prev, childNode) => {
                    if (prev) {
                        return prev;
                    } else if (!hasUnbalancedChildren(childNode)) {
                        const anotherNode = towers.get(node.children.find(c => c !== childNode.value));
                        return childNode.weight + getTotalNodeWeight(anotherNode) - getTotalNodeWeight(childNode);
                    } else {
                        return findWrongNodeWeightDifferential(childNode);
                    }
                }, null);
        }
    }

   return findWrongNodeWeightDifferential(towers.get(getBottomName(data)));
}

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getCorrectedWeight(data));
    });