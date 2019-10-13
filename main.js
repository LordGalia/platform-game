//draw in canvas
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

//set variable
var yPos = 450;
var xPos = 50;
var jump = 0;
var n;
var nt = 0;
var nb = 0;
var jumpSpeed = 0;
var time = 0;
var numberOfTimeDigits = 2;
var displayTime = parseFloat(time).toFixed(numberOfTimeDigits);
var previousTime = 0;
var stopTime = false;
var stopTimerLeftCorner = true;
var freezeTime = 30;
var level = 9;
var numberOfPosibleShots = 50;
var totalLevels = 10;
var nextLevelCooldown = 0;
var previousLevelCooldown = 0;
var restartLevelCooldown = false;
var toggleMinimal = true;

var myVar = setInterval(myTimer, 19*1);
var myVar1s = setInterval(myTimer1s, 1000/Math.pow(10,numberOfTimeDigits));
//array for bullet
var bulletArray = new Array(numberOfPosibleShots);
//sets all bullet arrays fromm 0-50 to 0
clearAllBullets();
//array for countFrequency
var countFrequency = new Array(numberOfPosibleShots/10);
while (nb <= numberOfPosibleShots/10) {
	countFrequency[nb] = 0;
	nb++;
}
nb = 0;

//var button
var element = document.getElementById("levels");
	var nrEasyLevels = 3;
	var nrMediumLevels = 2;

	for (let index = 1; index <= totalLevels; index++) {
		var btn = document.createElement("button");
		btn.appendChild(document.createTextNode(index));
		
		if (index <= nrEasyLevels) {
			btn.setAttribute("class","easy");
		} else if (index <= nrEasyLevels + nrMediumLevels) {
			btn.setAttribute("class","medium");
		} else {
			btn.setAttribute("class","hard");
		}
		
		btn.setAttribute("id","lvl" + index);
		btn.setAttribute("onclick","levelNr(" + index + ")");
		
		element.appendChild(btn);
	}
document.body.appendChild(element);	

//setter alle highscore til 0
var bestScore = new Array(10);

var ns = 0;
while (ns <= 7) {
	bestScore[ns] = -1;
	ns++;
}

//kjør hvert myVar millisekund
function myTimer() {
	startTime();
    
	//slett alt som er i bildet
	ctx.clearRect(0, 0, 500, 500);
    
	//draw levels
	drawLevels();
	
	//draw level in top left corner
	drawLevelName();
	//draw timer in top left corner
	timer();
	
	if (stopTime === false) {
		//keyboard inputs
		keyboardInputs();
		
		//run jump fuction
		jumpFunction();
	}
	
	//tegn player
	drawPlayer(xPos, yPos);

	//kill bullets
	killBullets();

	//svart boks rundt banen
	drawBoxFrame(0,0,500,500,"black");
}

function myTimer1s() {
	if (stopTime === false && stopTimerLeftCorner === false) {
		time += 1/Math.pow(10,numberOfTimeDigits);
		displayTime = parseFloat(time).toFixed(numberOfTimeDigits);
	}
}

//draw goal
function drawGoal(xPosH, yPosH, length, height) {
	ctx.fillStyle = "lime";
	drawBox(xPosH, yPosH, length, height);
	if (xPos > (xPosH - 30) && xPos < (xPosH + length) && yPos > (yPosH - 2) && yPos < (yPosH + height + 32)) {
		yPos = 448;
		xPos = 50;
		stopTime = true;
		stopTimerLeftCorner = true;
		previousTime = displayTime;
		if (bestScore[level]*1 > previousTime*1 || bestScore[level] === -1) {
			bestScore[level] = previousTime;
		}
		time = 0;
		jump = false;
		jumpSpeed = 0;

		clearAllBullets();

		//Blink screen green so you know you won
		ctx.fillStyle = "lime";
		drawBox(0, 0, 500, 500);
	}

}

//draw deathArea
function drawDeathArea(xPosH, yPosH, length, height) {
	ctx.fillStyle = "Red";
	drawBox(xPosH, yPosH, length, height);
	if (xPos > (xPosH - 30) && xPos < (xPosH + length) && yPos > (yPosH - 2) && yPos < (yPosH + height + 32)) {
		yPos = 448;
		xPos = 50;
		stopTime = true;
		stopTimerLeftCorner = true;
		previousTime = "los";
		time = 0;
		jump = false;
		jumpSpeed = 0;

		clearAllBullets();

		//Blink screen green so you know you won
		ctx.fillStyle = "Red";
		drawBox(0, 0, 500, 500);
	}

}

//draw box
function box(xPosH, yPosH, length, height) {
	ctx.fillStyle = "black";
	ctx.strokeStyle = "black";
	drawBox(xPosH, yPosH, length, height);
	drawBox(xPosH, yPosH, length, height);
	drawBox(xPosH, yPosH, length, height);
	drawBox(xPosH, yPosH, length, height);

	n = true;
	while (n === true) {
		hitbox(xPosH, yPosH, length, height);
	}
}

//make hitbox
function hitbox(xPosH, yPosH, length, height) {
	//gjør at du ikke kan gå inn i boksen fra venstre side
	if (xPos > (xPosH - 30) && xPos < (xPosH - 26) && yPos > (yPosH + 3) && yPos < yPosH + height + 32) {
		xPos -= 1;
	}
	//gjør at du ikke kan gå inn i boksen fra høyre side
	else if (xPos > (xPosH + length - 4) && xPos < (xPosH + length) && yPos > (yPosH + 3) && yPos < (yPosH + height + 32)) {
		xPos += 1;
	}
	//gjør at du ikke kan gå inn i boksen fra toppen
	else if (xPos > (xPosH - 30) && xPos < (xPosH + length) && yPos > (yPosH - 2) && yPos < (yPosH + 5)) {
		yPos -= 1;
		jump = false;
		jumpSpeed = 0;
	}
	//gjør at du ikke kan gå inn i boksen fra bunnen
	else if (xPos > (xPosH - 30) && xPos < (xPosH + length) && yPos > yPosH + height + 26 && yPos < yPosH + height + 32) {
		yPos += 1;
		jumpSpeed -= 5;
	}
	else {
		n = false;
	}
}

//draw the box
function drawBox(xPosH, yPosH, length, height) {
	ctx.beginPath();
	ctx.moveTo(xPosH, yPosH);
	ctx.lineTo(xPosH + length, yPosH);
	ctx.lineTo(xPosH + length, yPosH + height);
	ctx.lineTo(xPosH, yPosH + height);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
}

//draw boxfram
function drawBoxFrame(xPosH, yPosH, length, height, colour) {
	ctx.strokeStyle = colour;
	ctx.beginPath();
	ctx.moveTo(xPosH, yPosH);
	ctx.lineTo(xPosH + length, yPosH);
	ctx.lineTo(xPosH + length, yPosH + height);
	ctx.lineTo(xPosH, yPosH + height);
	ctx.closePath();
	ctx.stroke();
}

//draw player
function drawPlayer(xPos, yPos) {
	if (stopTimerLeftCorner === true) {
		//box around start position when you spawn
		drawBoxFrame(49, 418, 32, 28, "cyan");
	}
	ctx.strokeStyle = "black";
	drawBox(xPos, yPos - 30, 30, 30);
	drawBox(xPos, yPos - 30, 30, 30);
	drawBox(xPos, yPos - 30, 30, 30);
	drawBox(xPos, yPos - 30, 30, 30);
	ctx.fillStyle = "lightblue";
	drawBox(xPos+10, yPos - 20, 10, 10);
}

//draw shooter
function drawShooter(xPos, yPos, frequency, speed, shooterNr) {
	countFrequency[shooterNr]++;
	if (countFrequency[shooterNr] === frequency) {
		countFrequency[shooterNr] = 0;
		nb = (shooterNr - 1) * 10;
		while (nb < (shooterNr * 10)) {
			if (bulletArray[nb] === 0) {
				bulletArray[nb] = xPos;
				nb = numberOfPosibleShots;
			}
			nb++;
		}
	}

	ctx.fillStyle = "Red";
	drawBox(xPos, yPos, 5, 5);

	nb = (shooterNr - 1) * 10;
	while (nb < (shooterNr * (numberOfPosibleShots / 5))) {
		if (bulletArray[nb] !== 0) {
			bulletArray[nb] += speed;
			drawDeathArea(bulletArray[nb], yPos, 5, 5);
		}
		nb++;
	}
}

//kill bullets
function killBullets() {
	nb = 0;
	while (nb < numberOfPosibleShots) {
		if (bulletArray[nb] > 500 || bulletArray[nb] < 0) {
			bulletArray[nb] = 0;
		}
		nb++;
	}
}

//clear bullets from map
function clearAllBullets() {
	var ns = 0;
	while (ns <= numberOfPosibleShots) {
		bulletArray[ns] = 0;
		ns++;
	}
}

//Jump calculations
function jumpFunction() {
	//jump

	if (jump === true) {
		yPos -= (jumpSpeed / 20);
	}
	else {
		yPos -= (jumpSpeed / 20) - 1;
	}
	//    var jumpSpeed--
	if (jumpSpeed > -60) {
		jumpSpeed--;
	}
	if (jumpSpeed > -15 && jumpSpeed < 25) {
		jumpSpeed--;
	}
}

//detect input from keyboard
var map = [];
document.onkeydown = document.onkeyup = function (e) {
	map[e.keyCode] = e.type === "keydown";
	
	//prevents keys doing default task. No scrolling
	if (map[38] || map[40] || map[37] || map[39] || map[13] || map[32]) {
		e.preventDefault();
	}
};

//keyboard inputs
function keyboardInputs() {
	// Up
	if (map[38]) {
		if (jump === false) {
			jump = true; //set jump value
			jumpSpeed = 65;
			stopTimerLeftCorner = false; //starter tiden hvis den ikke er startet enda
		}
	}

	//Down
	if (map[40]) {
	}

	//Left
	if (map[37]) {
		xPos -= 2;
		stopTimerLeftCorner = false; //starter tiden hvis den ikke er startet enda
	}

	//Right
	if (map[39]) {
		xPos += 2;
		stopTimerLeftCorner = false; //starter tiden hvis den ikke er startet enda
	}
	//Restart level
	if (map[32] || map[82]) {
		if (restartLevelCooldown === false) {	
			levelNr(level);
			restartLevelCooldown = true;
			stopTime = true;
		}
	}
	else {
		restartLevelCooldown = false;
	}
	//Next level
	if (!((map[88] || map[13]) && map[90])) {
	 //sørger for at du ikke bytter frem og tilbake samtidig (flicker)
		if ((map[88] || map[13]) && level < totalLevels) {
			if (nextLevelCooldown < 0) {	
				levelNr(level+1);
				stopTime = true;
				nextLevelCooldown = 2;
			}
		}
		//previous level
		if (map[90] && (level > 1)) {
			if (previousLevelCooldown < 0) {	
				levelNr(level-1);
				stopTime = true;
				previousLevelCooldown = 2;
			}
		}
	}

	//m, toggles minimal mode
	if (map[77] && toggleMinimal == true) {
		toggleMinimal = false;
		toggleVisualVisablility();
	} else if (!map[77]) {
		toggleMinimal = true;
	}

	if (nextLevelCooldown >= 0) {	
		nextLevelCooldown --;
	}
	if (previousLevelCooldown >= 0) {
		previousLevelCooldown --;
	}
}

//draw level nr
function drawLevelName() {
	ctx.fillStyle = "black";
	ctx.font = "20px Arial";
	ctx.fillText("Level - " + level, 11, 30);
}

//timer
function timer() {
	ctx.fillStyle = "black";
	ctx.font = "20px Arial";
	ctx.fillText("Time: " + displayTime + "s", 10, 55);
	if (previousTime !== 0) {
		highScore();
		ctx.fillText("Last: " + previousTime + "s", 11, 80);
	}
}

function highScore() {
	if (bestScore[level] !== -1) {
		ctx.fillText("Best: " + bestScore[level] + "s", 11, 105);
	}
}

//start tiden igjenn etter du har kommet i mål
function startTime() {
	if (stopTime === true && nt < freezeTime) {
		nt++;
	}
	else {
		nt = 0;
		stopTime = false;
	}
}

//felles for alle når man velger nytt level
function levelNr(nr) {
	level = nr;
	yPos = 450;
	xPos = 50;
	time = 0;
	stopTimerLeftCorner = true;
	jump = false; //stopper hopping
	jumpSpeed = 0;
	clearAllBullets();
}

//draw level
function drawLevels() {
	//deaw level 1
	if (level === 1) {
		//draw shooter
		drawShooter(316,420,200,2,4);

		//frame
		box(0, 0, 0, 500);
		box(0, 0, 500, 0);
		box(500, 0, 0, 500);
		box(0, 450, 500, 50);
		//draw black boxes
		box(0,310,100,30);
		box(200,380,50,100);

		box(270,260,50,200);
		box(245,260,40,20);
		box(280,260,150,40);

		box(380,365,200,30);
		box(480,370,50,100);

		box(200,125,200,15);
		box(200,140,10,10);
		box(390,140,10,10);

		//draw death area
		drawDeathArea(250,281,19,168);
		drawDeathArea(300,301,130,12);
		drawDeathArea(211,140,178,10);

		//draw goal
		drawGoal(460, 396, 20, 53);
	}
	//draw level 2
	else if (level === 2) {
		//draw black boxes
		box(0, 0, 0, 500);
		box(0, 0, 500, 0);
		box(500, 0, 0, 500);
		box(0, 450, 500, 50);

		box(0, 300, 20, 200);
		box(0, 280, 300, 40);
		box(250, 250, 50, 40);
		box(250, 250, 50, 40);
		box(350, 350, 50, 100);
		box(300, 250, 100, 50);
		box(0, 250, 100, 40);
		box(0, 200, 50, 50);
		box(100, 130, 200, 30);
		box(341, 100, 170, 30);
		box(150, 0, 350, 20);
		box(390, 0, 70, 25);
		box(210,320,90,25);
		box(110,380,30,100);

		box(320,160,200,10);

		//draw goal
		drawGoal(400, 11, 50, 15);

		//draw death area
		drawDeathArea(101, 255, 148, 25);
		drawDeathArea(21,320,188,20);
		drawDeathArea(250,400,30,49);
		drawDeathArea(350,150,135,30);
		drawDeathArea(310,80,30,100);
		drawDeathArea(401,420,98,30);
	}
	else if (level === 3) {
		//draw black boxes
		box(0, 0, 0, 500);
		box(500, 0, 0, 500);
		box(0, 450, 500, 50);

		box(300,100,50,400); //stolpe
		box(270,100,30,20);

		//venstre side
		box(200,400,100,50);
		box(50,320,80,30);
		box(250,250,50,30);
		box(120,150,50,30);
		box(130,75,30,5);

		//draw goal
		drawGoal(370, 440, 80, 9);

		//draw death area
		drawDeathArea(280,121,20,278);
		drawDeathArea(1, 0, 498, 2);
		//venstre side
		drawDeathArea(180,380,20,69);
		drawDeathArea(50,351,80,2);
		drawDeathArea(130,80,30,90);
		//høyre side
		drawDeathArea(400,70,30,60);
		drawDeathArea(351,250,90,30);
		drawDeathArea(470,380,30,69);
	}
	else if (level === 4) {
		//draw black boxes
		box(0, 0, 0, 500);
		box(0, 0, 500, 0);
		box(500, 0, 0, 500);
		box(0, 450, 500, 50);
		//sealing
		box(0,300,440,20);

		//Bottom
		box(0,300,30,150);
		box(100,400,30,100);
		box(200,400,30,100);
		box(270,370,100,30);
		box(340,370,30,80);
		box(480,390,20,20);
		//death area
		drawDeathArea(31,321,68,30);
		drawDeathArea(131,410,68,40);
		drawDeathArea(420,321,20,60);

		//blindfold
		if (stopTimerLeftCorner === false) {
			ctx.fillStyle="black";
			drawBox(0,300,500,100);
			drawBox(120,400,400,100);
		}

		//Top
		//"H"
		box(100,110,20,150);
		box(170,110,20,150);
		box(100,175,70,20);
		//"i"
		box(220,175,20,85);
		drawGoal(220,140,20,20);
		//"!"
		box(285,110,20,100);
		box(284,238,22,22);
	}
	else if (level === 5) {
		//draw shooter
		drawShooter(495, 80, 100, -5, 1);
		drawShooter(250, 30, 30, 2, 2);
		drawShooter(50, 225, 70, 3, 3);

		//draw black boxes
		box(0, 0, 0, 500);
		box(0, 0, 500, 0);
		box(500, 0, 0, 500);
		box(0, 450, 200, 50);
		box(250, 480, 100, 20);
		box(350, 450, 150, 50);
		box(0, 320, 20, 130);
		box(250, 250, 50, 70);
		box(180, 370, 70, 130);
		box(100, 300, 150, 20);
		box(400, 400, 100, 50);
		box(300, 250, 20, 140);
		box(0, 250, 100, 70);
		box(0, 200, 50, 50);
		box(120, 120, 80, 30);
		box(250, 100, 200, 20);
		box(250, 120, 20, 20);
		box(430, 120, 20, 20);
		box(200, 0, 50, 50);
		box(250, 0, 250, 20);
		box(390, 0, 70, 25);
		box(320, 300, 100, 20);
		box(420, 300, 20, 45);
		box(160, 370, 40, 20);

		//draw goal
		drawGoal(400, 11, 50, 15);

		//draw death area
		drawDeathArea(101, 255, 148, 45);
		drawDeathArea(170, 380, 17, 69);
		drawDeathArea(251, 460, 98, 20);
		drawDeathArea(321, 320, 98, 20);
		drawDeathArea(271, 120, 158, 10);
		drawDeathArea(200,50,50,5);
	}
	else if (level === 6) {
		//draw black boxes
		box(0, 0, 0, 500);
		box(0, 0, 500, 0);
		box(500, 0, 0, 500);
		//bottom
		box(40,450,50,10);

		//left side
		box(0,185,30,400);
		box(200,95,30,400);

		box(1,370,30,400);
		box(199,277,30,400);

		//right side
		box(230,95,200,28);
		box(300,160,200,30);
		box(230,225,50,28);
		box(380,225,50,28);
		drawBox(230,225,200,28);
		drawBoxFrame(230,225,200,28);

		//draw death area
		//bottom
		drawDeathArea(32, 455, 166, 50);
		drawDeathArea(231,455,268,50);

		//right side
		drawDeathArea(231,123,199,2);
		drawDeathArea(231,253,199,2);

		drawDeathArea(295,292,90,30);

		//draw warning
		ctx.fillStyle="yellow";
		drawBox(330,230,5,10);
		drawBox(330,242,5,5);

		//draw goal
		drawGoal(250,450,50,4);
	}
	else if (level === 7) {
		//draw black boxes
		//outline
		box(0, 0, 0, 500);
		box(0, 0, 500, 0);
		box(500, 0, 0, 500);

		//footing bottom row
		box(20, 450, 90, 50);
		box(420, 450, 90, 20);
		box(200, 450, 90, 50);
		//death bottom row
		drawDeathArea(111,453,88,200);
		drawDeathArea(330,320,20,150);
		drawDeathArea(400,453,100,200);
		
		//death area under map
		drawDeathArea(0,600,1000,100);
		
		//middle row
		//black
		box(150,340,5,30);
		box(351,350,10,20);
		box(351,345,5,10);
		//death area
		drawDeathArea(156,340,5,35);
		drawDeathArea(391,340,5,35);
		
		//lower top row
		box(50,285,30,5);
		
		drawDeathArea(44,250,5,40);
		drawDeathArea(81,250,5,40);
		
		//top row
		//left side
		box(100,200,5,5);
		box(50,145,30,5);
		box(120,90,29,15);
		//right side
		box(415,90,50,10);
		
		drawDeathArea(50,150,30,5);
		drawDeathArea(106,195,5,10);
		drawDeathArea(20,108,130,2);
		drawDeathArea(1, 0, 498, 2);
		
		drawDeathArea(200, 170,200,2);
		drawDeathArea(200,175,2,35);
		drawDeathArea(200, 213,40,2);
		drawDeathArea(200,218,2,25);
		
		drawGoal(205,175,30,35);
	}
	else if (level === 8) {
		box(0,0,10,500);
		box(0,450,500,500);
		box(490,0,10,450);
		box(120,390,20,10);
		box(170,350,20,50);
		box(160,350,10,10);
		box(120,400,10,50);
		box(220,310,20,50);
		box(270,350,40,20);
		box(270,340,40,10);
		box(240,340,40,20);
		box(270,410,230,50);
		box(10,260,100,30);
		box(170,220,50,20);
		box(90,240,20,30);
		box(90,240,30,50);
		box(200,200,20,20);
		box(200,190,30,50);
		box(270,340,50,30);
		box(10,180,10,80);
		box(90,120,30,40);
		box(10,180,20,80);
		box(200,170,30,20);
		box(190,150,40,80);
		box(180,130,50,100);
		box(170,130,40,110);
		box(10,180,30,80);
		box(10,80,110,40);
		box(90,80,40,50);
		box(260,20,40,20);
		box(10,0,160,10);
		box(160,0,40,10);
		box(340,0,20,80);
		box(300,80,60,20);
		box(250,20,10,160);
		box(360,0,130,10);
		box(300,100,10,50);
		box(310,140,10,10);
		box(400,100,10,100);
		box(390,100,20,100);
		box(450,300,10,10);
		box(440,180,10,130);
		box(450,180,40,10);
		box(480,230,10,10);
		box(310,280,20,90);
		box(310,280,30,80);
		box(400,180,10,30);
		box(250,430,20,30);
		box(260,420,10,10);
		box(240,440,10,10);
		
		
		//death area
		drawDeathArea(240,320,70,20);
		drawDeathArea(390,200,20,110);
		drawDeathArea(40,250,50,10);

		drawDeathArea(0,-20,500,0);

		//goal
		drawGoal(480,190,10,40);
	}
	//draw level 9
	if (level === 9) {
		box(20, 450, 90, 50);
		box(0, 0, 0, 500);
		box(0, 0, 500, 0);
		box(500, 0, 0, 500);
		box(0, 500, 500, 0);
		box(110,480,290,20);
		box(400,450,80,50);
		box(140,425,70,20);
		box(300,425,70,20);
		box(200,365,110,15);
		box(240,270,30,100);
		box(200,365,10,25);
		box(300,365,10,25);
		box(215,265,80,15);
		box(210,255,10,25);
		box(290,255,10,25);
		box(110,310,285,20);
		box(100,300,10,40);
		box(390,300,10,40);
		box(470,320,10,40);
		box(480,330,20,20);
		box(20,300,10,40);
		box(0,310,20,20);
		box(40,230,50,20);
		box(60,170,20,70);
		box(50,160,100,20);
		box(170,120,20,90);
		box(390,110,110,20);
		box(460,45,40,15);
		box(480,50,20,70);
		
		drawDeathArea(111,470,288,10);
		drawDeathArea(211,375,88,7);
		drawDeathArea(400,131,80,130);
		box(410,130,25,120);
		box(445,130,25,120);
		drawDeathArea(111,305,128,7);
		drawDeathArea(271,305,118,7);
		drawDeathArea(221,260,68,10);
		drawDeathArea(231,200,48,10);
		drawDeathArea(241,20,28,80);
		drawDeathArea(81,181,68,10);
		drawDeathArea(41,251,48,5);
		drawDeathArea(53,181,6,48);
		drawDeathArea(175,110,10,110);

		drawGoal(475,61,10,48);
		
	}
	//draw level 10
	if (level === 10) {
		box(20, 450, 90, 50);
		box(0, 0, 0, 500);
		box(0, 0, 500, 0);
		box(500, 0, 0, 500);
		box(0, 500, 500, 0);
		box(370, 450, 110, 50);
		drawDeathArea(110, 460, 260, 40);
		box(160, 380, 60, 20);
		box(310, 280, 40, 100);
		drawDeathArea(300, 270, 10, 120);
		drawDeathArea(350, 270, 10, 120);
		box(360, 280, 10, 100);
		box(460, 360, 30, 10);
		box(460, 317, 30, 10);
		drawDeathArea(470, 327, 10, 32);
		box(460, 190, 30, 10);
		box(460, 147, 30, 10);
		drawDeathArea(470, 157, 10, 32);
		drawDeathArea(460, 200, 30, 119);
		drawDeathArea(350, 130, 10, 130);
		box(340, 120, 10, 80);
		box(350, 120, 20, 10);
		box(360, 120, 10, 80);
		drawDeathArea(290, 70, 130, 10);
		box(280, 60, 20, 10);
		box(280, 60, 10, 30);
		box(280, 80, 20, 10);
		box(410, 60, 20, 10);
		box(410, 80, 20, 10);
		box(420, 60, 10, 30);
		drawDeathArea(420, 260, 80, 10);
		box(460, 271, 30, 9);
		box(460, 250, 30, 9);
		drawDeathArea(440, 60, 10, 90);
		drawDeathArea(280, 110, 10, 100);
		box(270, 100, 10, 20);
		box(290, 100, 10, 20);
		box(280, 100, 10, 10);
		box(160, 270, 60, 20);
		box(230, 290, 60, 20);
		box(280, 300, 10, 10);
		drawGoal(460, 110, 30, 30);
		box(0, 0, 500, 10);
		drawDeathArea(100, 220, 170, 10);
		box(90, 210, 10, 30);
		box(100, 230, 10, 10);
		box(100, 210, 10, 10);
		drawDeathArea(130, 190, 130, 10);
		drawDeathArea(160, 130, 10, 50);
		box(250, 180, 20, 10);
		box(260, 190, 10, 20);
		box(250, 200, 10, 10);
		drawDeathArea(20, 120, 90, 10);
		box(10, 110, 20, 10);
		box(10, 130, 20, 10);
		box(10, 120, 10, 10);
		drawDeathArea(230, 100, 20, 20);
	}
}


//visual
function toggleVisualVisablility() {
	var minimalTogglableClassArray = document.getElementsByClassName("minimalTogglable");
	var index;
	if (minimalTogglableClassArray[0].style.display == "none") {
		for (index = 0; index < minimalTogglableClassArray.length; index++) {
			minimalTogglableClassArray[index].style.display = "block"; //gjør klassen synlig
		}
	}
	else {
		for (index = 0; index < minimalTogglableClassArray.length; index++) {
			minimalTogglableClassArray[index].style.display = "none"; //gjør klassen usynlig
		}
	}
}
