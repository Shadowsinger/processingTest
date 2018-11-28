
let mapData;
let user;
let directionFacing = 0;
let flightEnabled = 0;		// This is for checking whether gravity works or not. 
													//For activation, use disableFlight

// Admin stuff, will remove
let disableFlight = 1;
let disableAutoMove = 1;

class User {
	constructor(){
		this.pos = createVector(0,0,150);
		this.cameraAngle = createVector(0, 0, 70);
	}
	render(){
		push();
		translate(this.pos.x, this.pos.y, this.pos.z);
		stroke(0,0,0);
		// fill(255,0,0);
		fill(255,255,0);
		strokeWeight(1);
		box(10);
		pop();
	}
	moveLeft(){
		if (directionFacing%4 == 0)
			this.pos.x -= 1;
		else if (directionFacing%4 == 1)
			this.pos.z += 1;
		else if (directionFacing%4 == 2)
			this.pos.x += 1;
		else if (directionFacing%4 == 3)
			this.pos.z -= 1;
	}
	moveRight(){
		if (directionFacing%4 == 0)
			this.pos.x += 1;
		else if (directionFacing%4 == 1)
			this.pos.z -= 1;
		else if (directionFacing%4 == 2)
			this.pos.x -= 1;
		else if (directionFacing%4 == 3)
			this.pos.z += 1;
	}
	moveForward(){
		if (directionFacing%4 == 0)
			this.pos.z -= 1;
		else if (directionFacing%4 == 1)
			this.pos.x -= 1;
		else if (directionFacing%4 == 2)
			this.pos.z += 1;
		else if (directionFacing%4 == 3)
			this.pos.x += 1;
	}
	moveBack(){
		if (directionFacing%4 == 0)
			this.pos.z += 1;
		else if (directionFacing%4 == 1)
			this.pos.x += 1;
		else if (directionFacing%4 == 2)
			this.pos.z -= 1;
		else if (directionFacing%4 == 3)
			this.pos.x -= 1;
	}
	moveUp(){
		this.pos.y--;
	}
	moveDown(){
		this.pos.y++;
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
	if (directionFacing%4 == 0)
		user.cameraAngle = createVector(0,0,70);
	else if (directionFacing%4 == 1)
		user.cameraAngle = createVector(70,0,0);
	else if (directionFacing%4 == 2)
		user.cameraAngle = createVector(0,0,-70);
	else if (directionFacing%4 == 3)
		user.cameraAngle = createVector(-70,0,0);
}

function updateCamera() {
	camera(user.pos.x+user.cameraAngle.x, user.pos.y+user.cameraAngle.y, user.pos.z+user.cameraAngle.z, user.pos.x, user.pos.y, user.pos.z, 0, 1, 0);
}

function draw() {
	if (flightEnabled)
		background(0,255,0);
	else
		background(200,200,200);
	fill(200,200,200);
	// rotateX(mouseX/100);
	// rotateY(mouseY/100);
	if (mapData){
		drawMap();
	}

	if (!disableAutoMove){
		user.moveForward();
	}
	if (!disableFlight && mapData){
		if (flightEnabled)
			user.moveUp();
		else
			user.moveDown();
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
	if (keyIsDown(LEFT_ARROW))
		user.moveLeft();
	else if (keyIsDown(RIGHT_ARROW))
		user.moveRight();
	else if (keyIsDown(UP_ARROW))
		user.moveForward();
	else if (keyIsDown(DOWN_ARROW))
		user.moveBack();
}

function keyPressed() {
	if (keyCode === 65)			// a
		directionFacing++;
	else if (keyCode == 68)	// d
		directionFacing+=3;
	else if (keyCode == 32)	// <Space>
		flightEnabled = !flightEnabled;
	else if (keyCode == 66)	// b
		disableFlight = !disableFlight;
}


