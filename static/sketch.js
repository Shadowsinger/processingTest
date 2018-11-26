
let mapData;
let user;

class User {
	constructor(){
		this.pos = createVector(0,0,0);
		this.cameraAngle = createVector(0, 1, 0);
	}
	render(){
		push();
		translate(this.pos.x, this.pos.y, this.pos.z+150);
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
	camera(user.pos.x, user.pos.y, user.pos.z+220, user.pos.x, user.pos.y, user.pos.z, user.cameraAngle.x, user.cameraAngle.y, user.cameraAngle.z);
}

function draw() {
	background(200,200,200);
	fill(200,200,200);
	// rotateX(-0.7);
	// translate(0, 0, -200);
	// rotateX(mouseX/100);
	// rotateY(mouseY/100);
	if (mapData){
		drawMap();
	}

	user.render();
	handleKeyDown();
}
function drawMap(){
	fill(0,0,0,30);
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
		user.pos.x -= 1;
	}
	else if (keyIsDown(RIGHT_ARROW)){
		user.pos.x += 1;
	}
	else if (keyIsDown(UP_ARROW)){
		user.pos.z -= 1;
	}
	else if (keyIsDown(DOWN_ARROW)){
		user.pos.z += 1;
	}

	else if (keyIsDown(87)){		// w
		user.cameraAngle = createVector();
	}
	else if (keyIsDown(65)){		// a
		user.cameraAngle.x = PI*2;
	}
	else if (keyIsDown(83)){		// s
		user.cameraAngle.x = 0;
	}
	else if (keyIsDown(68)){		// d
		user.cameraAngle.x = -1;
	}

	

	camera(user.pos.x, user.pos.y, user.pos.z+220, user.pos.x, user.pos.y, user.pos.z, user.cameraAngle.x, user.cameraAngle.y, user.cameraAngle.z);
}


