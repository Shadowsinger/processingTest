
let mapData;
let user;
let ghost;
let items;
var score = 0;

const boxSize = 50;

const ghostNum = 10;

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

$.get("getData", function(data){
	mapData = JSON.parse(data);
	identifyTurningPoints(mapData);
});

class User {
	constructor(){
		this.sz = 10;

		this.spawnPoint = createVector(boxSize*1, boxSize*0, boxSize*1);
		this.blockIndex = [1,0,1];

		this.pos = this.spawnPoint;
		this.cameraAngle = p5.Vector.add(this.spawnPoint,createVector(0,-70,-70)).normalize().mult(70);

		this.mass = 1;
		this.jumpForce = 800;
		this.verticalVelocity = 0;
		//150->80 (pos to cam)
	}

	updateBlockIndex(){
		this.blockIndex = [round(this.pos.x/50), round(this.pos.y/50), round(this.pos.z/50)];
	}

	checkWalls(){
		if(this.pos.y >0){
			this.locationIndex = p5.Vector.div(this.pos, boxSize);

			this.locationIndex.x = round(this.locationIndex.x);
			this.locationIndex.y = round(this.locationIndex.y);
			this.locationIndex.z = round(this.locationIndex.z);
			if(mapData[this.locationIndex.y][this.locationIndex.z][this.locationIndex.x] == 9){
				score++;
				$("#score").html(score);
				mapData[this.locationIndex.y][this.locationIndex.z][this.locationIndex.x] = 0;
			}
			return mapData[this.locationIndex.y][this.locationIndex.z][this.locationIndex.x] == 1;
		}
		else{
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
		texture(img);
		box(this.sz);
		pop();
	}
	moveLeft(){
		this.pos.x-=2*this.cameraAngle.z/70;
		if(this.checkWalls()){
			this.pos.x+=2*this.cameraAngle.z/70;
		}
		this.pos.z+=2*this.cameraAngle.x/70;
		if(this.checkWalls()){
			this.pos.z-=2*this.cameraAngle.x/70;
		}
	}
	moveRight(){
		this.pos.x+=2*this.cameraAngle.z/70;
		if(this.checkWalls()){
			this.pos.x-=2*this.cameraAngle.z/70;
		}
		this.pos.z-=2*this.cameraAngle.x/70;
		if(this.checkWalls()){
			this.pos.z+=2*this.cameraAngle.x/70;
		}
	}
	moveForward(){
		this.pos.x-=2*this.cameraAngle.x/70;
		if(this.checkWalls()){
			this.pos.x+=2*this.cameraAngle.x/70;
		}
		this.pos.z-=2*this.cameraAngle.z/70;
		if(this.checkWalls()){
			this.pos.z+=2*this.cameraAngle.z/70;
		}
	}
	moveBack(){
		this.pos.x+=2*this.cameraAngle.x/70;
		if(this.checkWalls()){
			this.pos.x-=2*this.cameraAngle.x/70;
		}

		this.pos.z+=2*this.cameraAngle.z/70;
		if(this.checkWalls()){
			this.pos.z-=2*this.cameraAngle.z/70;
		}
	}
	moveUp(v){
		this.pos.y-=v;
		if(this.checkWalls()){
			this.pos.y+=v;
			this.verticalVelocity=0;
		}
	}
	moveDown(v){
		this.pos.y+=v;
		if (this.checkWalls()){
			this.pos.y-=v;
			this.verticalVelocity=0;
		}
	}
}

$.get("getItemData", function(data){
	items = JSON.parse(data);
});

function initVars() {
	user = new User();
	ghost = new Ghost();
}

function setup() {
	img = loadImage("/static/img/dog1.png");
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

	if (!mapData)
		return;

	push();
	drawMap();
	user.updateBlockIndex();

	if (!disableAutoMove){
		user.moveForward();
	}
	if (!disableFlight && mapData){
		if (flightEnabled)
			user.moveUp(1);
		else
			user.moveDown(1);
	}

	user.verticalVelocity -= 10;
	user.moveUp(user.verticalVelocity/60);

	user.render();
	ghost.render();
	ghost.moveInRandomDir();
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
				if (mapData[y][z][x]!=0) {

					let transparency = 255;
					let relativeWallPos = createVector(boxSize*x,boxSize*y,boxSize*z).sub(user.pos);
					let wallDot = relativeWallPos.dot(user.cameraAngle);
					let tmpSz = items[mapData[y][z][x]].sz;
					let tmpColor = items[mapData[y][z][x]].color;

					push();
					if(wallDot<0 && relativeWallPos.mag() <= boxSize * renderDist){
						translate(boxSize*x, boxSize*y, boxSize*z);
					}
					else if (wallDot > 0 && relativeWallPos.mag() < boxSize*2){
						translate(tmpSz*x, tmpSz*y, tmpSz*z);
						if(relativeWallPos.mag() < boxSize*1.0){
							transparency = 200;
						}
					}
					fill(...tmpColor, transparency);
					box(tmpSz);
					pop();
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
	if (keyCode == 32){	// <Space>
		user.verticalVelocity += user.jumpForce/(user.mass*10);
	}

	else if (keyCode == 66)	// b
		disableFlight = !disableFlight;
}

function sendScore(data) { // ["alek", 100]
	$.ajax({
	  	type: "POST",
 	 	contentType: "application/json; charset=utf-8",
  		url: "/leaderboard",
  		data: JSON.stringify(data),
  		success: function (data) {
   			console.log(data);
   		},
		dataType: "json"
	});
}

function requestScore() {
	$.get("/leaderboard", function(data){
		console.log(JSON.parse(data));
	});
}
