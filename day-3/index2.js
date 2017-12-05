function compute(target) {
    let dirs = ['e', 'n', 'w', 's'];
    let diri = 0;
    let pathSize = 1;
    let pathCount = 0;
    let loc = {'e': 0, 'n': 0, 'w': 0, 's': 0};
    let values = {'0,0': 1};

    while (true) {
        if (loc[dirs[(diri + 2) % 4]] > 0) {
            loc[dirs[(diri + 2) % 4]]--;
        } else {
            loc[dirs[diri]]++;
        }

        const locH = loc.e - loc.w;
        const locV = loc.n - loc.s;

        let value = 0;

        if (values.hasOwnProperty(`${locH - 1},${locV - 1}`)) {
            value += values[`${locH - 1},${locV - 1}`];
        }
        if (values.hasOwnProperty(`${locH},${locV - 1}`)) {
            value += values[`${locH},${locV - 1}`];
        }
        if (values.hasOwnProperty(`${locH + 1},${locV - 1}`)) {
            value += values[`${locH + 1},${locV - 1}`];
        }
        if (values.hasOwnProperty(`${locH - 1},${locV}`)) {
            value += values[`${locH - 1},${locV}`];
        }
        if (values.hasOwnProperty(`${locH + 1},${locV}`)) {
            value += values[`${locH + 1},${locV}`];
        }
        if (values.hasOwnProperty(`${locH - 1},${locV + 1}`)) {
            value += values[`${locH - 1},${locV + 1}`];
        }
        if (values.hasOwnProperty(`${locH},${locV + 1}`)) {
            value += values[`${locH},${locV + 1}`];
        }
        if (values.hasOwnProperty(`${locH + 1},${locV + 1}`)) {
            value += values[`${locH + 1},${locV + 1}`];
        }

        values[`${locH},${locV}`] = value;

        if (value > target) {
            return value;
        }

        pathCount++;

        if (pathCount === pathSize) {
            pathCount = 0;
            diri = (diri + 1) % 4;
            if (diri % 2 === 0) {
                pathSize++;
            }
        }
    }
}


console.log(compute(parseInt(process.argv[2])));

