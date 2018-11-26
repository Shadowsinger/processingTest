
let mapData;
let user;

class User {
	constructor(){
		this.pos = createVector(0,0,0);
		// this.cameraPos = createVector(0, 15, (height/18.0) / tan(PI*30.0 / 180.0));
		this.cameraPos = createVector(0, 15, 300);
		this.cameraCenter = createVector(0, 0, 0);
		this.cameraUp = createVector(0, 1, 0);
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
	// camera([x], [y], [z], [centerX], [centerY], [centerZ], [upX], [upY], [upZ]);
	// camera(0, 0, 10, 0, 0, 0, 0, 0, 1);
	// camera(0, 0, ((user.cameraPos.z)/2)/tan(Math.PI*30.0/180.0), 0, 0, 0, user.cameraUp.x, user.cameraUp.y, user.cameraUp.z);
	
	w = 0;
	// h = 400;
	// camera(w/2.0, (h-450)/2.0, (h/2.0) / tan(PI*30.0 / 180.0), w/2.0, h/2.0, 0, 0, 1, 0)
	h = 100;
	camera(w/2.0, h/2.0, (h/2.0) / tan(PI*30.0 / 180.0), w/2.0, h/2.0, 0, 0, 1, 0)
}

function draw() {
	background(200,200,200);
	fill(200,200,200);
	// rotateX(-0.7);
	// translate(0, 0, -200);
	rotateX(mouseX/100);
	rotateY(mouseY/100);
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
					// fill((x+1)*113%255, (z+100)*113%255, (y+200)*113%255);
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
		// user.cameraPos.x += 1;
		// console.log(user.cameraPos);
	}
	else if (keyIsDown(RIGHT_ARROW)){
		user.pos.x += 1;
		// user.cameraPos.x -= 1;
	}
	else if (keyIsDown(UP_ARROW)){
		user.pos.z -= 1;
		user.cameraCenter.z -= 1;
		// user.cameraCenter.z -= 1;
		// user.cameraUp.z -= 1;
	}
	else if (keyIsDown(DOWN_ARROW)){
		user.pos.z += 1;
		user.cameraCenter.z += 1;
	}

// (2500/18.0) / tan(PI*30.0 / 180.0)
	// camera(user.cameraPos.x, user.cameraPos.y, ((user.cameraPos.z)/2)/tan(Math.PI*30.0/180.0), user.cameraCenter.x, user.cameraCenter.y, user.cameraCenter.z, user.cameraUp.x, user.cameraUp.y, user.cameraUp.z);
}


