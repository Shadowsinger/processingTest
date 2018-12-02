
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
function identifyTurningPoints(mapData){
  for (var i = 0; i < mapData.length; i++) {
    pathMap.push([]);
    for (var j = 0; j < mapData[i].length; j++) {
      pathMap[i].push([]);
      for (var k = 0; k < mapData[i][j].length; k++) {
        pathMap[i][j].push([0,0,0,0,0,0]);
        if(k+1<mapData.length && mapData[i][j][k+1] == 0){ pathMap[i][j][k][0] = 1; }
        if(i-1>0 && mapData[i-1][j][k] == 0){ pathMap[i][j][k][1] = 1; }
        if(k-1>0 && mapData[i][j][k-1] == 0){ pathMap[i][j][k][2] = 1; }
        if(i+1<mapData.length && mapData[i+1][j][k] == 0){ pathMap[i][j][k][3] = 1; }
        if(j-1>0 && mapData[i][j-1][k] == 0){ pathMap[i][j][k][4] = 1; }
        if(j+1<mapData.length && mapData[i][j+1][k] == 0){ pathMap[i][j][k][5] = 1; }
        //this creates an array at each point on the map, indicating avaliable directions
      }
    }
  }
}
// identifyTurningPoints(mapData);

class Ghost {
  constructor() {
    this.color = createVector(255,255,100)
    // this.pos = createVector(random()*boxSize+boxSize, random()*boxSize+boxSize, random()*boxSize+boxSize);
    this.pos = createVector(2*boxSize, 1*boxSize, 2*boxSize);
    this.sz = 40
    this.posIndex = [2,1,2];

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
    // console.log(pathMap[this.posIndex[1]][this.posIndex[2]][this.posIndex[0]]);
    // console.log(this.posIndex);
    if(pathMap[this.posIndex[1]][this.posIndex[2]][this.posIndex[0]][this.currentHeading]==0){
      // console.log("changing directions")
      let i = 0;
      while (pathMap[this.posIndex[1]][this.posIndex[2]][this.posIndex[0]][this.currentHeading]==0 && i < 50){
        // console.log("crumb");
        this.currentHeading = floor(Math.random()*6);
        i++;
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
    // if (this.posIndex[0] >= mapData.length)
    //   this.posIndex[0] -= 1;
    // if(this.posIndex[1] >= mapData.length)
    //   this.posIndex[1] -= 1;
    // if(this.posIndex[2] >= mapData.length)
    //   this.posIndex[2] -= 1;

  }

}
