
let mapData;
let user;

const boxSize = 50;

let keyRotation = [0, 0, 0];
let directionFacing = 0;
let flightEnabled = 0;		// This is for checking whether gravity works or not. 
													//For activation, use disableFlight

// Admin stuff, will remove
let disableFlight = 1;
let disableAutoMove = 1;

class wallUnit{
	constructor(x, y, z, sz){
		this.x = x;
		this.y = y;
		this.z = z;
		this.sz = sz;
	}

	checkCollide(entity){
		let xGood = max(this.x, entity.pos.x) > min(this.x+this.sz, entity.pos.x+entity.sz);
		let yGood = max(this.y, entity.pos.y) > min(this.y+this.sz, entity.pos.y+entity.sz);
		let zGood = max(this.z, entity.pos.z) > min(this.z+this.sz, entity.pos.z+entity.sz);
		return (xGood && yGood && zGood);
	}

}


class User {
	constructor(){
		this.sz = 10;

		this.spawnPoint = createVector(boxSize, 0, boxSize);
		this.blockIndex = [1,0,1];

		this.pos = this.spawnPoint;
		this.cameraAngle = p5.Vector.add(this.spawnPoint,createVector(0,0,-70));

		//150->80 (pos to cam)
	}

	checkWalls(){
		// what dirrection is it hitting a wall in? 0-none, 1-"right", -1-"left"
		let dirs = [0,0,0];
		let tpos = this.pos.array();

		// x, y, z
		for (var d = 0; d < 3; d++)
		{
			if (tpos[d]-this.sz/2<(this.blockIndex[d]-0.5)*boxSize)
				dirs[d] = -1;
			else if(tpos[d]+this.sz/2>(this.blockIndex[d]+0.5)*boxSize)
				dirs[d] = 1;	
		}
		console.log(dirs);
	}

	render(){
		push();
		translate(this.pos.x, this.pos.y, this.pos.z);
			

		// stroke(0,0,0);
		stroke(255,0,0);
		// fill(255,0,0);
		fill(255,255,0);
		strokeWeight(1);
		box(this.sz);
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
	let cameraPos = p5.Vector.add(user.cameraAngle, user.pos);
	camera(cameraPos.x, cameraPos.y, cameraPos.z, user.pos.x, user.pos.y, user.pos.z, 0, 1, 0);
}

function draw() {
	if (flightEnabled)
		background(0,255,0);
	else
		background(200,200,200);
	fill(200,200,200);

	push();
	rotateX(keyRotation[0]);
	rotateY(keyRotation[1]);
	rotateZ(keyRotation[2]);

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
	pop();

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
					let relativeWallPos = createVector(50*x,50*y,50*z).sub(user.pos);
					if(relativeWallPos.dot(user.cameraAngle)<0 && relativeWallPos.mag()<200)
					{
						push();
						translate(x*50,y*50,z*50);
						box(boxSize);
						pop();	
					}
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
	if (keyIsDown(UP_ARROW))
		user.moveForward();
	else if (keyIsDown(DOWN_ARROW))
		user.moveBack();

	else if (keyIsDown(74))	// j
		keyRotation[0]-=0.01;
	else if (keyIsDown(76))	// l
		keyRotation[0]+=0.01;
	else if (keyIsDown(75))	// k
		keyRotation[1]-=0.01;
	else if (keyIsDown(73))	// i
		keyRotation[1]+=0.01;
	else if (keyIsDown(85))	// u
		keyRotation[2]-=0.01;
	else if (keyIsDown(79))	// o
		keyRotation[2]+=0.01;
}

function keyPressed() {
	if (keyCode === 65)		// a
		directionFacing++;
	else if (keyCode == 68)	// d
		directionFacing+=3;
	else if (keyCode == 32)	// <Space>
		flightEnabled = !flightEnabled;
	else if (keyCode == 66)	// b
		disableFlight = !disableFlight;


}


