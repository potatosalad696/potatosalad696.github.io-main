/* SLIDERS */
var iter = document.getElementById("iteration")
var txt = document.getElementById("txt")
txt.innerHTML = iter.value

// var shape = document.getElementById("triangleshape")

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

// Triangle Position
let canvaswidth = 0
let canvasheight = 0
let canvasmiddle = 0

function genblacktriangles(iterations) {
    // Trianle position: s = side length, h = height of canvas: s = 2h/sqrt(3)
    // Order of points: x1, y1, x2, y2, x3, y3 (Anti Clockwise)
    // (0, 0) is top left corner
    let largeBtrisideL = (2 * canvasheight) / (sqrt(3))
    let largeBtrihalfsideL = largeBtrisideL / 2
    let tempBtripoints = [[canvasmiddle - largeBtrihalfsideL, canvasheight, canvasmiddle, 0, canvasmiddle + largeBtrihalfsideL, canvasheight]] // canvasheight - (canvasheight/2) * Math.sqrt(2)

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
    canvaswidth = window.screen.availWidth - 100
    canvasheight = window.screen.availHeight - 450
    canvasmiddle = canvaswidth / 2

    createCanvas(canvaswidth, canvasheight)
    noStroke()
    fill(1)

    btripoints = genblacktriangles(iter.value)
}

function draw() {
    background(255)
    fill(0)
    btripoints.forEach(drawtri)
}

function regenerateTriangles(iterations) {
    btripoints = genblacktriangles(iterations)
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
