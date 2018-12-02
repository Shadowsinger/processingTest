
var pathMap = [];


/*
      -y
       1
       ↑
-x 2 ← • → 0 +x
       ↓
       3
      +y

4 - towards human -z
5 - away from human +z


    /----------------> k
   /|
  / |
 /  |
j   ↓
    i

    mapData is organized [y][z][x]
*/
function identifyTurningPoints(map){
  for (var i = 0; i < map.length-1; i++) {
    pathMap.push([]);
    if (i==0)
      continue
    for (var j = 0; j < map[i].length-1; j++) {
      pathMap[i].push([]);
      if(j==0)
        continue
      for (var k = 0; k < map[i][j].length-1; k++) {
        pathMap[i][j].push([1,1,1,1,1,1])
        if (k==0)
          continue
        if(map[i][j][k] != 1){ //if current index is not a wall...
          if(map[i][j][k+1] == 1){ pathMap[i][j][k][0] = 0; }
          if(map[i-1][j][k] == 1){ pathMap[i][j][k][1] = 0; }
          if(map[i][j][k-1] == 1){ pathMap[i][j][k][2] = 0; }
          if(map[i+1][j][k] == 1){ pathMap[i][j][k][3] = 0; }
          if(map[i][j-1][k] == 1){ pathMap[i][j][k][4] = 0; }
          if(map[i][j+1][k] == 1){ pathMap[i][j][k][5] = 0; }
        }
        //this creates an array at each point on the map, indicating avaliable directions
      }
    }
  }
}

// identifyTurningPoints(mapData);

class Ghost {
  constructor() {
    this.color = createVector(255,255,100)
    this.pos = createVector(Math.random*boxSize+boxSize, Math.random*boxSize+boxSize, Math.random*boxSize+boxSize);
    this.sz = 40
    this.posIndex = [1,2,1];

    this.currentHeading = 0;
  }
  render(){
    fill(this.color.x,this.color.y,this.color.z);
    stroke(0, 255, 242,50);
    strokeWeight(1);
    push();
    translate(this.pos.x+boxSize/2,this.pos.y+boxSize/2,this.pos.z+boxSize/2);
    sphere(this.sz/3, 8, 8);
    pop();
    fill(0,0,0);
    stroke(0, 255, 242);
    strokeWeight(4);
  }
  moveInRandomDir(){
    console.log(pathMap[this.posIndex[1]][this.posIndex[2]][this.posIndex[0]]);
    console.log(this.posIndex);
    if(pathMap[this.posIndex[1]][this.posIndex[2]][this.posIndex[0]][this.currentHeading]==0){
      console.log("changing directions")
      while (pathMap[this.posIndex[1]][this.posIndex[2]][this.posIndex[0]][this.currentHeading]==0){
        this.currentHeading = floor(Math.random()*6);
        if(this.currentHeading >=6) {this.currentHeading = 5;}
      }
    }
    switch (this.currentHeading) {
      case 0:
        this.pos.x++;
      break;

      case 1:
        this.pos.y--;
      break;

      case 2:
        this.pos.x--;
      break;

      case 3:
        this.pos.y++;
      break;

      case 4:
        this.pos.z--;
      break;

      case 5:
        this.pos.z++;
      break;

      default:
        // this.pos.x ++;
      break;

    }
    this.posIndex[0] = round(this.pos.x/50);
    this.posIndex[1] = round(this.pos.y/50);
    this.posIndex[2] = round(this.pos.z/50);
  }

}
