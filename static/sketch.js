
let mapData;
let user;
let img;

let flightEnabled = 0;
let directionFacing = 0;
let keyRotation = [0, 0, 0];

// Admin stuff, will remove
let disableFlight = 1;
let disableAutoMove = 1;

const boxSize = 50;
const fovDist = 70;
const renderDist = 6;
const rotationAngleIncrement = Math.PI/96;
const sRotationAngleIncrement = Math.sin(rotationAngleIncrement);
const cRotationAngleIncrement = Math.cos(rotationAngleIncrement);

function checkCollide(posA, posB, szA, szB){
	let xGood = max(posA.x-szA/2, posB.x-szB/2) > min(posA.x+szA/2, posA.x+szB/2);
	let yGood = max(posA.y-szA/2, posB.y-szB/2) > min(posA.y+szA/2, posA.y+szB/2);
	let zGood = max(posA.z-szA/2, posB.z-szB/2) > min(posA.z+szA/2, posA.z+szB/2);
	return (xGood && yGood && zGood);
}

class User {
	constructor(){
		this.sz = 10;
		this.spawnPoint = createVector(boxSize, 0, boxSize);
		this.pos = this.spawnPoint;
		this.blockIndex = [1, 0, 1];
		this.cameraAngle = p5.Vector.add(this.spawnPoint, createVector(0, 0, -fovDist));
	}

	updateBlockIndex(){
		this.blockIndex = [floor(this.pos.x/50+0.5), floor(this.pos.y/50+0.5), floor(this.pos.z/50+0.5)];
	}

	checkWalls(){
		// Direction hitting a wall in
		// 0: None, 1: Right, -1: Left
		let dirs = [0,0,0];
		let tpos = this.pos.array();
		let allIndices = [];

		// x, y, z
		for (var axis = 0; axis < 3; axis++){
			if (tpos[axis]-this.sz/2<(this.blockIndex[axis]-0.5)*boxSize)
				dirs[axis] = -1;
			else if(tpos[axis]+this.sz/2>(this.blockIndex[axis]+0.5)*boxSize)
				dirs[axis] = 1;
		}

		for(var i = 0; i < 2; i++){
			if (!dirs[0] && !i) continue;
			let tmpI = this.blockIndex[0]+dirs[0]*i;
			for(var j = 0; j < 2; j++){
				if (!dirs[1] && !j) continue;
				let tmpJ = this.blockIndex[1]+dirs[1]*j;
				for(var k = 0; k < 2; k++){
					if (!dirs[2] && !k) continue;
					let tmpK = this.blockIndex[2]+dirs[2]*k;

					if(mapData[tmpJ][tmpK][tmpI]){
						allIndices.push([dirs[0]*i, dirs[1]*j, dirs[2]*k]);
					}

				}
			}
		}
		return allIndices;
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
		// texture(img);
		box(this.sz);
		pop();
	}

	moveLeft(){
		this.pos.x-=user.cameraAngle.z/fovDist;
		this.pos.z+=user.cameraAngle.x/fovDist;
	}
	moveRight(){
		this.pos.x+=user.cameraAngle.z/fovDist;
		this.pos.z-=user.cameraAngle.x/fovDist;
	}
	moveForward(){
		this.pos.x-=user.cameraAngle.x/fovDist;
		this.pos.z-=user.cameraAngle.z/fovDist;
	}
	moveBack(){
		this.pos.x+=user.cameraAngle.x/fovDist;
		this.pos.z+=user.cameraAngle.z/fovDist;
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
	img = loadImage('/static/img/alek.png');
	createCanvas(500,500,WEBGL);
	initVars();
	updateCamera();
}

function updateCamera() {
	let cameraPos = p5.Vector.add(user.cameraAngle, user.pos);
	camera(...cameraPos.array(), ...user.pos.array(), 0, 1, 0);
}

function draw() {

	if (!mapData)
		return;

	if (flightEnabled)
		background(0,255,0);
	else
		background(200,200,200);
	fill(200,200,200);

	push();
		drawMap();
		user.updateBlockIndex();

		if (!disableAutoMove){
			user.moveForward();
		}
		if (!disableFlight && mapData){
			if (flightEnabled)
				user.moveUp();
			else
				user.moveDown();
		}

		decideCameraPos();
		user.render();
		handleKeyDown();
	pop();

	updateCamera();
}

function decideCameraPos() {
	if (directionFacing%4 == 0)
		user.cameraAngle = createVector(0,0,fovDist);
	else if (directionFacing%4 == 1)
		user.cameraAngle = createVector(fovDist,0,0);
	else if (directionFacing%4 == 2)
		user.cameraAngle = createVector(0,0,-fovDist);
	else if (directionFacing%4 == 3)
		user.cameraAngle = createVector(-fovDist,0,0);
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
					if(wallDot<0 && relativeWallPos.mag() <= boxSize * renderDist)
					{
						push();
						translate(x*boxSize,y*boxSize,z*boxSize);
						box(boxSize);
						pop();
					}
					else if (wallDot > 0 && relativeWallPos.mag() < boxSize*2)
					{
						if(relativeWallPos.mag() < boxSize*1.5){
							// fill(0,255,242,150);
							stroke(0, 255, 242,50);
							strokeWeight(1);
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

function checkIfBlockPathValid(blocks, sign, axis){
	// Axis goes in x, y, z
	function getNewBlockIndex(axis){
		return user.blockIndex[axis]+blocks[t][axis];
	}
	for (var t in blocks) {
		if(blocks[t][axis]==sign && mapData[getNewBlockIndex(1)][getNewBlockIndex(2)][getNewBlockIndex(0)]){
			return false;
		}
	}
	return true;
}

function handleKeyDown(){

	let possibleBlockIntersects = (mapData) ? user.checkWalls() : [];
	if (keyIsDown(LEFT_ARROW) && checkIfBlockPathValid(possibleBlockIntersects, -1, 0))
		user.moveLeft();
	else if (keyIsDown(RIGHT_ARROW) && checkIfBlockPathValid(possibleBlockIntersects, 1, 0))
		user.moveRight();
	if (keyIsDown(UP_ARROW) && checkIfBlockPathValid(possibleBlockIntersects, -1, 2))
		user.moveForward();
	else if (keyIsDown(DOWN_ARROW) && checkIfBlockPathValid(possibleBlockIntersects, 1, 2))
		user.moveBack();

	else if (keyIsDown(74)){}	// j
		// keyRotation[0]-=0.01;
	else if (keyIsDown(76)){}	// l
		//keyRotation[0]+=0.01;
	else if (keyIsDown(75)){}	// k
		// keyRotation[1]-=0.01;
	else if (keyIsDown(73)){}	// i
		// keyRotation[1]+=0.01;
	else if (keyIsDown(85))	// u
		keyRotation[2]-=0.01;
	else if (keyIsDown(79))	// o
		keyRotation[2]+=0.01;

	if (keyIsDown(68)){		// d
		user.cameraAngle.x = ((user.cameraAngle.x * cRotationAngleIncrement) - (user.cameraAngle.z * sRotationAngleIncrement));
		user.cameraAngle.z = ((user.cameraAngle.x * sRotationAngleIncrement) + (user.cameraAngle.z * cRotationAngleIncrement));
		user.cameraAngle.normalize().mult(fovDist);
	}
	else if (keyIsDown(65)){	// a
		user.cameraAngle.x = ((user.cameraAngle.x * cRotationAngleIncrement) + (user.cameraAngle.z * sRotationAngleIncrement));
		user.cameraAngle.z = ((user.cameraAngle.z * cRotationAngleIncrement) - (user.cameraAngle.x * sRotationAngleIncrement));
		user.cameraAngle.normalize().mult(fovDist);
	}
}

function keyPressed() {
	if (keyCode == 32)								// <Space>
		flightEnabled = !flightEnabled;
	else if (keyCode == 66)						// b
		disableFlight = !disableFlight;
}

