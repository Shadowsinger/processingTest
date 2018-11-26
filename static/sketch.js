
let mapData;
let user;
let orientation = 0;

class User {
	constructor(){
		this.pos = createVector(0,0,150);
		this.cameraAngle = createVector(0, 0, 70);
	}
	render(){
		push();
		translate(this.pos.x, this.pos.y, this.pos.z);
		stroke(0,0,0);
		fill(255,0,0);
		strokeWeight(1);
		box(10);
		pop();
	}
}

$.get("getData", function(data){
	mapData = JSON.parse(data);
});

function initVars() {
	user = new User();
}

function setup() {
	createCanvas(500,500,WEBGL);
	initVars();
	updateCamera();
}

function decideCameraPos() {
	if (orientation%4 == 0)
		user.cameraAngle = createVector(0,0,70);
	else if (orientation%4 == 1)
		user.cameraAngle = createVector(70,0,0);
	else if (orientation%4 == 2)
		user.cameraAngle = createVector(0,0,-70);
	else if (orientation%4 == 3)
		user.cameraAngle = createVector(-70,0,0);
}

function updateCamera() {
	camera(user.pos.x+user.cameraAngle.x, user.pos.y+user.cameraAngle.y, user.pos.z+user.cameraAngle.z, user.pos.x, user.pos.y, user.pos.z, 0, 1, 0);
}

function draw() {
	background(200,200,200);
	fill(200,200,200);
	// rotateX(mouseX/100);
	// rotateY(mouseY/100);
	if (mapData){
		drawMap();
	}

	user.render();
	handleKeyDown();
	decideCameraPos();
	updateCamera();
}

function drawMap() {
	fill(0,0,0,30);
	fill(0,0,0);
	stroke(0, 255, 242);
	strokeWeight(4);
	for (var y = 0; y < mapData.length; y++) {
		for (var z = 0; z < mapData.length; z++) {
			for (var x = 0; x < mapData.length; x++) {
				if (mapData[y][z][x]) {
					push();
					translate(x*50,y*50,z*50);
					box(50);
					pop();
				}
			}
		}
	}
}

function handleKeyDown(){
	if (keyIsDown(LEFT_ARROW)){
		if (orientation%4 == 0)
			user.pos.x -= 1;
		else if (orientation%4 == 1)
			user.pos.z += 1;
		else if (orientation%4 == 2)
			user.pos.x += 1;
		else if (orientation%4 == 3)
			user.pos.z -= 1;
	}
	else if (keyIsDown(RIGHT_ARROW)){
		if (orientation%4 == 0)
			user.pos.x += 1;
		else if (orientation%4 == 1)
			user.pos.z -= 1;
		else if (orientation%4 == 2)
			user.pos.x -= 1;
		else if (orientation%4 == 3)
			user.pos.z += 1;
	}
	else if (keyIsDown(UP_ARROW)){
		if (orientation%4 == 0)
			user.pos.z -= 1;
		else if (orientation%4 == 1)
			user.pos.x -= 1;
		else if (orientation%4 == 2)
			user.pos.z += 1;
		else if (orientation%4 == 3)
			user.pos.x += 1;
	}
	else if (keyIsDown(DOWN_ARROW)){
		if (orientation%4 == 0)
			user.pos.z += 1;
		else if (orientation%4 == 1)
			user.pos.x += 1;
		else if (orientation%4 == 2)
			user.pos.z -= 1;
		else if (orientation%4 == 3)
			user.pos.x -= 1;
	}
}

function keyPressed() {
	if (keyCode === 65)			// a
		orientation++;
	else if (keyCode == 68)	// d
		orientation+=3;
}


