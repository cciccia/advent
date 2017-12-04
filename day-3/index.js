function compute(target) {
    let dirs = ['e', 'n', 'w', 's'];
    let diri = 0;
    let pathSize = 1;
    let pathCount = 0;
    let loc = {'e': 0, 'n': 0, 'w': 0, 's': 0}

    for (let i = 2; i <= target; i++) {
        if (loc[dirs[(diri + 2) % 4]] > 0) {
            loc[dirs[(diri + 2) % 4]]--;
        } else {
            loc[dirs[diri]]++;
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

    return loc.e + loc.n + loc.w + loc.s;
}


console.log(compute(parseInt(process.argv[2])));

