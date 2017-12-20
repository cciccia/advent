 const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getUncollided(data.split('\n').map(row => row.match(/([0-9-]+)/g).map(num => parseInt(num)))));
    });

class Vector {
    constructor(id, px, py, pz, vx, vy, vz, ax, ay, az) {
        this.id = id;
        this.alive = true;

        this.mover = (function* distance(px, py, pz, vx, vy, vz, ax, ay, az) {
            while (true) {
                yield `${px},${py},${pz}`;

                vx += ax;
                vy += ay;
                vz += az;
                px += vx;
                py += vy;
                pz += vz;
            }
        })(px, py, pz, vx, vy, vz, ax, ay, az)
    }

    move() {
        return this.mover.next().value;
    }
}

function* trackCollisions(vectors) {
    let unchanged = 0;
    while (unchanged < 1000) {
        let oldLength = vectors.length;

        const vectorPositions = vectors.map(vector => vector.move());
        vectors = vectors.filter((x,i) => {
            return vectorPositions.indexOf(vectorPositions[i], vectorPositions.indexOf(vectorPositions[i]) + 1) === -1;
        });
        unchanged++;

        if (vectors.length !== oldLength) {
            unchanged = 0;
            yield vectors.length;
        }
    }
}

function getUncollided(vectorSpecs) {
    const vectors = vectorSpecs.map(([px, py, pz, vx, vy, vz, ax, ay, az], i) => {
        return new Vector(i, px, py, pz, vx, vy, vz, ax, ay, az);
    });

    for (numLeft of trackCollisions(vectors)) {
        console.log(numLeft);
    }
}