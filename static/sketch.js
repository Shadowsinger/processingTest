
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

const renderDist = 4;
let img;

function checkCollide(posA, posB, szA, szB){
	let xGood = max(posA.x-szA/2, posB.x-szB/2) > min(posA.x+szA/2, posA.x+szB/2);
	let yGood = max(posA.y-szA/2, posB.y-szB/2) > min(posA.y+szA/2, posA.y+szB/2);
	let zGood = max(posA.z-szA/2, posB.z-szB/2) > min(posA.z+szA/2, posA.z+szB/2);
	console.log(xGood + yGood + zGood);
	return (xGood && yGood && zGood);
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
		// what direction is it hitting a wall in? 0-none, 1-"right", -1-"left"
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

		for(var i = 0; i < 2; i++){
			for(var j = 0; j < 2; j++){
				for(var k = 0; k < 2; k++){
					if(mapData[this.blockIndex[0] + dirs[i]*i][this.blockIndex[1] + dirs[j]*j][this.blockIndex[2] + dirs[k]*k]){
						console.log("dnd");
					}

				}
			}
		}
		console.log(dirs);
	}

	render(){
		push();
		translate(this.pos.x, this.pos.y, this.pos.z);

		rotateX(keyRotation[0]);
		rotateY(keyRotation[1]);
		rotateZ(keyRotation[2]);

		stroke(0,0,255);
		fill(0,255,0);
		strokeWeight(1);
		texture(img);
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
	img = loadImage('static/alek.png');
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
	fill(0,0,0);
	stroke(0, 255, 242);
	strokeWeight(4);
	for (var y = 0; y < mapData.length; y++) {
		for (var z = 0; z < mapData.length; z++) {
			for (var x = 0; x < mapData.length; x++) {
				if (mapData[y][z][x]) {
					let relativeWallPos = createVector(boxSize*x,boxSize*y,boxSize*z).sub(user.pos);
					let wallDot = relativeWallPos.dot(user.cameraAngle);
					if(wallDot<0 && relativeWallPos.mag() < boxSize * renderDist)
					{
						push();
						translate(x*boxSize,y*boxSize,z*boxSize);
						box(boxSize);
						pop();
					}
					else if (wallDot > 0 && relativeWallPos.mag() < boxSize*2)
					{
						if(relativeWallPos.mag() < boxSize){
							// fill(255,0,0,150);
							stroke(0, 255, 242,50);
							strokeWeight(4);
							push();
							translate(x*boxSize,y*boxSize,z*boxSize);
							box(boxSize);
							pop();
							fill(0,0,0);
							stroke(0, 255, 242);
							strokeWeight(4);
						} else{
							fill(0,0,0);
							stroke(0, 255, 242,50);
							strokeWeight(4);
							push();
							translate(x*boxSize,y*boxSize,z*boxSize);
							box(boxSize);
							pop();
							fill(0,0,0);
							stroke(0, 255, 242);
							strokeWeight(4);
						}

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
