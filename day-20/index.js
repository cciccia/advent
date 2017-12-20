 const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync(process.argv[2], "utf8")
    .then(data => {
        console.log(getClosest(data.split('\n').map(row => row.match(/([0-9-]+)/g).map(num => parseInt(num)))));
    });

class Vector {
    constructor(id, px, py, pz, vx, vy, vz, ax, ay, az) {
        this.id = id;

        this.mover = (function* distance(px, py, pz, vx, vy, vz, ax, ay, az) {
            let yielder = 0;
            while (true) {
                if (!(yielder % 10000)){
                    yield Math.abs(px) + Math.abs(py) + Math.abs(pz);
                }
                
                vx += ax;
                vy += ay;
                vz += az;
                px += vx;
                py += vy;
                pz += vz;

                yielder++;
            }
        })(px, py, pz, vx, vy, vz, ax, ay, az)
    }

    moveAndGetdistance() {
        return this.mover.next().value;
    }
}

function getClosest(vectorSpecs) {
    const vectors = vectorSpecs.map(([px, py, pz, vx, vy, vz, ax, ay, az], i) => {
        return new Vector(i, px, py, pz, vx, vy, vz, ax, ay, az);
    });
    
    for (let i = 0; ; i++) {
        const {id, distance} = vectors.reduce(({id, distance}, vector) => {
            const contender = vector.moveAndGetdistance();

            if (distance === undefined || contender < distance) {
                id = vector.id;
                distance = contender;
            }
            return {id, distance};
        }, {});

        if (!(i % 10)) {
            console.log(`After ${i} super-rounds, the closest is ${id} at ${distance}`);
        }
    }
}