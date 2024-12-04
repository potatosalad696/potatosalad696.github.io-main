/* SLIDERS */
var iter = document.getElementById("iteration")
var txt = document.getElementById("txt")
txt.innerHTML = iter.value

iter.oninput = () => {
    txt.innerHTML = iter.value
    setup()
}

/* RENDERING */
let iteration = 0
let btripoints = [[0, 400, 200, 400 - 200 * Math.sqrt(3), 400, 400]]
let wtripoints = []

function genverttri() {
    if (iteration >= iter.value) {
        btripoints.forEach(drawtri)
        return
    }

    iteration += 1
    let newtri = []

    for (let i = 0; i < btripoints.length; i++) {
        let mid1 = [
            (btripoints[i][0] + btripoints[i][2]) / 2,
            (btripoints[i][1] + btripoints[i][3]) / 2,
        ]
        let mid2 = [
            (btripoints[i][2] + btripoints[i][4]) / 2,
            (btripoints[i][3] + btripoints[i][5]) / 2,
        ]
        let mid3 = [
            (btripoints[i][4] + btripoints[i][0]) / 2,
            (btripoints[i][5] + btripoints[i][1]) / 2,
        ]

        newtri.push([
            btripoints[i][0], btripoints[i][1],
            mid1[0], mid1[1],
            mid3[0], mid3[1],
        ])
        newtri.push([
            mid1[0], mid1[1],
            btripoints[i][2], btripoints[i][3],
            mid2[0], mid2[1],
        ])
        newtri.push([
            mid3[0], mid3[1],
            mid2[0], mid2[1],
            btripoints[i][4], btripoints[i][5],
        ])
    }

    btripoints = newtri
    genverttri()
}

function drawtri(item) {
    triangle(item[0], item[1], item[2], item[3], item[4], item[5])
}

function setup() {
    createCanvas(400, 400)
    background(255)
    noStroke()
    fill(0)

    iteration = 0
    btripoints = [[0, 400, 200, 400 - 200 * Math.sqrt(3), 400, 400]]
    wtripoints = []

    genverttri()
}