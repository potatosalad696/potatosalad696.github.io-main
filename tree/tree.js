var _angle = document.getElementById("angle")
var txt = document.getElementById("txt")
txt.innerHTML = _angle.value

_angle.oninput = () => {
    txt.innerHTML = _angle.value
    setup()
}

function setup() {
    createCanvas(710, 400);
    background(255)
    angleMode(DEGREES);
    
    angle = min(_angle.value, 90);

    translate(width / 2, height);
    line(0, 0, 0, -120);
    translate(0, -120);
    branch(120, 0);
}

function draw() {
}

function branch(h, level) {
    h *= 0.66;

    if (h > 2) {
        push();
        
        rotate(angle);
        line(0, 0, 0, -h);
        translate(0, -h);
        branch(h, level + 1);
        
        pop();
        push();
        
        rotate(-angle);
        line(0, 0, 0, -h);
        translate(0, -h);
        branch(h, level + 1);

        pop();
    }
}