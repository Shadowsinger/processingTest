
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

const renderDist = 6;
const rotationAngleIncrement = Math.PI/96;
const sRotationAngleIncrement = Math.sin(rotationAngleIncrement);
const cRotationAngleIncrement = Math.cos(rotationAngleIncrement);

let img;

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
		this.blockIndex = [1,0,1];

		this.pos = this.spawnPoint;
		this.cameraAngle = p5.Vector.add(this.spawnPoint,createVector(0,0,-70));

		//150->80 (pos to cam)
	}

	updateBlockIndex(){
		// let temp = [floor(this.pos.x/50), floor(this.pos.y/50), floor(this.pos.z/50)]
		// if(this.blockIndex[0] == temp[0] && this.blockIndex[1] == temp[1] && this.blockIndex[2] == temp[2]){
		//   console.log("");
		// }
		// else
		//   console.log("CHANGE");
		// this.blockIndex = [floor(this.pos.x/50), floor(this.pos.y/50), floor(this.pos.z/50)];
		// this.blockIndex = [floor(this.pos.x/50+0.5), floor(this.pos.y/50+0.5), floor(this.pos.z/50+0.5)];
	}

	checkWalls(){
		this.locationIndex = p5.Vector.div(this.pos, boxSize);
		this.locationFine = this.locationIndex.copy();

		this.locationFine.x = this.locationFine.x % 1;
		// this.locationFine.y = this.locationFine.y % 1;
		this.locationFine.y = 0;
		this.locationFine.z = this.locationFine.z % 1;

		this.locationIndex.x = round(this.locationIndex.x);
		this.locationIndex.y = round(this.locationIndex.y);
		this.locationIndex.z = round(this.locationIndex.z);
		console.log(this.locationIndex);

		let leeway;
		leeway = 1 - ((this.sz/boxSize)/2);
		console.log(this.locationFine)
		if(mapData[this.locationIndex.y][this.locationIndex.z][this.locationIndex.x]==1){
			console.log("fully in block" + this.locationIndex);
			return true;
		// } else if (this.locationFine.x>=leeway||this.locationFine.x<=1-leeway||this.locationFine.x>=leeway||this.locationFine.x<=1-leeway){
			// if(){
				// console.log("partially in block " + this.locationIndex);
				// return true;
			// }
		} else {
			return false;
		}

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
		this.pos.x-=user.cameraAngle.z/70;
		this.pos.z+=user.cameraAngle.x/70;
		if(this.checkWalls()){
			this.pos.x+=user.cameraAngle.z/70;
			this.pos.z-=user.cameraAngle.x/70;
		}
	}
	moveRight(){
		this.pos.x+=user.cameraAngle.z/70;
		this.pos.z-=user.cameraAngle.x/70;
		if(this.checkWalls()){
			this.pos.x-=user.cameraAngle.z/70;
			this.pos.z+=user.cameraAngle.x/70;
		}
	}
	moveForward(){
		this.pos.x-=user.cameraAngle.x/70;
		this.pos.z-=user.cameraAngle.z/70;
		if(this.checkWalls()){
			this.pos.x+=user.cameraAngle.x/70;
			this.pos.z+=user.cameraAngle.z/70;
		}
	}
	moveBack(){

		this.pos.x+=user.cameraAngle.x/70;
		this.pos.z+=user.cameraAngle.z/70;
		if(this.checkWalls()){
			this.pos.x-=user.cameraAngle.x/70;
			this.pos.z-=user.cameraAngle.z/70;
		}
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
	img = loadImage('/static/alek.png');
	createCanvas(500,500,WEBGL);
	initVars();
	updateCamera();
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
		user.updateBlockIndex();
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

function handleKeyDown(){



	if (keyIsDown(LEFT_ARROW)){
			user.moveLeft();
	}
	else if (keyIsDown(RIGHT_ARROW)){
			user.moveRight();
	}

	if (keyIsDown(UP_ARROW)){
			user.moveForward();
	}
	else if (keyIsDown(DOWN_ARROW)){
			user.moveBack();
	}

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
		// directionFacing++;
		user.cameraAngle.x = ((user.cameraAngle.x * cRotationAngleIncrement) - (user.cameraAngle.z * sRotationAngleIncrement));
		user.cameraAngle.z = ((user.cameraAngle.x * sRotationAngleIncrement) + (user.cameraAngle.z * cRotationAngleIncrement));
		user.cameraAngle.normalize().mult(70);
	}
	else if (keyIsDown(65)){	// a
		user.cameraAngle.x = ((user.cameraAngle.x * cRotationAngleIncrement) + (user.cameraAngle.z * sRotationAngleIncrement));
		user.cameraAngle.z = ((user.cameraAngle.z * cRotationAngleIncrement) - (user.cameraAngle.x * sRotationAngleIncrement));
		user.cameraAngle.normalize().mult(70);
	}
}

function keyPressed() {
	if (keyCode == 32)	// <Space>
		flightEnabled = !flightEnabled;
	else if (keyCode == 66)	// b
		disableFlight = !disableFlight;


}
