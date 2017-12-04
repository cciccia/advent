const readline = require('readline');

rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('Paste your puzzle input here: ', data => {
    compute(data);
    rl.close();
});


function compute(data) {
    const result = [...data].reduce((prev, c, i) => {
        const cur = parseInt(c)
        const next = parseInt(data[(i+data.length / 2) % data.length]);
        return !isNaN(cur) && !isNaN(next) &&  (cur === next) ? prev + cur : prev;
    }, 0);

    console.log(result);
}