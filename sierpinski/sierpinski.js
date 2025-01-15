/* SLIDERS */
var iter = document.getElementById("iteration")
var txt = document.getElementById("txt")
txt.innerHTML = iter.value

iter.oninput = () => {
    txt.innerHTML = iter.value
    regenerateTriangles(iter.value)
}

/* RENDERING */
let btripoints = []
let zoom = 1
let offsetX = 0
let offsetY = 0
let isDragging = false
let dragStartX, dragStartY

function genverttri(iterations) {
    let tempBtripoints = [[0, 400, 200, 400 - 200 * Math.sqrt(3), 400, 400]]

    for (let i = 0; i < iterations; i++) {
        let newtri = []

        for (let tri of tempBtripoints) {
            let mid1 = [(tri[0] + tri[2]) / 2, (tri[1] + tri[3]) / 2]
            let mid2 = [(tri[2] + tri[4]) / 2, (tri[3] + tri[5]) / 2]
            let mid3 = [(tri[4] + tri[0]) / 2, (tri[5] + tri[1]) / 2]

            newtri.push([tri[0], tri[1], mid1[0], mid1[1], mid3[0], mid3[1]])
            newtri.push([mid1[0], mid1[1], tri[2], tri[3], mid2[0], mid2[1]])
            newtri.push([mid3[0], mid3[1], mid2[0], mid2[1], tri[4], tri[5]])
        }

        tempBtripoints = newtri
    }

    return tempBtripoints
}

function drawtri(item) {
    beginShape()
    for (let i = 0; i < 6; i += 2) {
        let x = (item[i] - width / 2) * zoom + width / 2 + offsetX
        let y = (item[i + 1] - height / 2) * zoom + height / 2 + offsetY
        vertex(x, y)
    }
    endShape(CLOSE)
}

function setup() {
    createCanvas(400, 400)
    noStroke()
    fill(0)

    btripoints = genverttri(iter.value)
}

function draw() {
    background(255)
    fill(0)
    btripoints.forEach(drawtri)
}

function regenerateTriangles(iterations) {
    btripoints = genverttri(iterations)
}

function mouseWheel(event) {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        let zoomFactor = 1.1
        let prevZoom = zoom

        if (event.deltaY > 0) {
            zoom /= zoomFactor
        } else {
            zoom *= zoomFactor
        }

        let mouseCanvasX = (mouseX - width / 2 - offsetX) / prevZoom + width / 2
        let mouseCanvasY = (mouseY - height / 2 - offsetY) / prevZoom + height / 2

        offsetX -= (mouseCanvasX - width / 2) * (zoom - prevZoom)
        offsetY -= (mouseCanvasY - height / 2) * (zoom - prevZoom)
    }

    return false
}

let prevDist = 0

function touchStarted() {
    if (touches.length == 2) {
        prevDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y)
    }
}

function touchMoved() {
    if (touches.length == 2) {
        let currDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y)

        if (currDist !== prevDist) {
            let zoomFactor = 1.1
            let prevZoom = zoom
            if (currDist > prevDist) {
                zoom *= zoomFactor
            } else {
                zoom /= zoomFactor
            }

            let pinchMidX = (touches[0].x + touches[1].x) / 2
            let pinchMidY = (touches[0].y + touches[1].y) / 2
            let mouseCanvasX = (pinchMidX - width / 2 - offsetX) / prevZoom + width / 2
            let mouseCanvasY = (pinchMidY - height / 2 - offsetY) / prevZoom + height / 2

            offsetX -= (mouseCanvasX - width / 2) * (zoom - prevZoom)
            offsetY -= (mouseCanvasY - height / 2) * (zoom - prevZoom)
        }

        prevDist = currDist
    }
}

function touchEnded() {
    prevDist = 0
}

function mousePressed() {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        isDragging = true
        dragStartX = mouseX - offsetX
        dragStartY = mouseY - offsetY
    }
}

function mouseDragged() {
    if (isDragging && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        offsetX = mouseX - dragStartX
        offsetY = mouseY - dragStartY
    }
}

function mouseReleased() {
    isDragging = false
}
