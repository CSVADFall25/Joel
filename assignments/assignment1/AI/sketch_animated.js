function setup() {
  createCanvas(800, 600);
  frameRate(60);
}

function draw() {
  // Sky gradient background
  background(135, 206, 235);
  
  // Sun
  fill(255, 255, 100);
  stroke(255, 200, 0);
  strokeWeight(2);
  circle(700, 100, 60);
  
  // Ground
  fill(100, 100, 100);
  stroke(80, 80, 80);
  strokeWeight(2);
  rect(0, 500, 800, 100);
  
  // Sidewalk
  fill(150, 150, 150);
  rect(0, 450, 800, 50);
  
  // Sidewalk lines
  fill(120, 120, 120);
  rect(100, 470, 80, 5);
  rect(250, 470, 80, 5);
  rect(400, 470, 80, 5);
  rect(550, 470, 80, 5);
  
  // Bus stop sign
  fill(200, 200, 200);
  stroke(0);
  strokeWeight(2);
  rect(395, 300, 10, 150);
  
  fill(255, 255, 0);
  rect(350, 250, 100, 60);
  
  fill(0);
  strokeWeight(1);
  rect(375, 270, 50, 25);
  
  // Clouds
  fill(255, 255, 255);
  stroke(200, 200, 200);
  strokeWeight(1);
  circle(100, 80, 40);
  circle(130, 75, 50);
  circle(160, 80, 40);
  circle(500, 120, 50);
  circle(535, 115, 45);
  circle(570, 120, 40);
  
  // Scene timing (30 seconds = 1800 frames at 60fps)
  // Using continuous mathematical functions for smooth animation
  
  // Character 1 X position
  // 0-450: -100 + (400/450)*frameCount = moves to 300
  // 450-1350: stays at 300
  // 1350-1800: 300 + (250/450)*(frameCount-1350) = moves to 550
  
  // Character 2 X position  
  // 0-450: stays at -200 (off screen)
  // 450-750: -200 + (350/300)*(frameCount-450) = moves to 150
  // 750-1350: stays at 150
  // 1350-1800: 150 + (400/450)*(frameCount-1350) = moves to 550
  
  // Bus X position
  // 0-900: stays at 1100 (off screen)
  // 900-1200: 1100 - (650/300)*(frameCount-900) = moves to 450
  // 1200+: stays at 450
  
  // Using min/max to constrain positions (simulating conditionals)
  
  // Draw bus first (background layer)
  drawBus();
  
  // Draw characters (foreground layer)
  drawCharacter2();
  drawCharacter1();
}

function drawCharacter1() {
  // Calculate position using mathematical expressions
  // Walking animation: legs alternate
  
  // Body (simplified using rectangle)
  fill(100, 150, 200);
  stroke(0);
  strokeWeight(2);
  rect(260, 380, 80, 100);
  
  // Arms - right arm waves during scene 2
  fill(100, 150, 200);
  rect(240, 390, 20, 60);
  // Right arm - wave between frames 450-900
  rect(340, 390 - sin(frameCount * 0.2) * 10, 20, 60);
  
  // Legs - walking animation
  rect(270, 480 + sin(frameCount * 0.3) * 3, 25, 50);
  rect(305, 480 - sin(frameCount * 0.3) * 3, 25, 50);
  
  // Face
  fill(255, 220, 177);
  circle(300, 350, 70);
  
  // Hair (brown)
  fill(139, 69, 19);
  stroke(101, 67, 33);
  strokeWeight(1);
  circle(280, 330, 20);
  circle(290, 325, 22);
  circle(300, 323, 23);
  circle(310, 325, 22);
  circle(320, 330, 20);
  
  // Eyebrows
  fill(101, 67, 33);
  stroke(0);
  rect(285, 338, 15, 3);
  rect(305, 338, 15, 3);
  
  // Left eye
  fill(255);
  stroke(0);
  strokeWeight(1);
  circle(290, 345, 12);
  fill(0);
  circle(290, 345, 6);
  fill(255);
  circle(292, 343, 2);
  
  // Right eye
  fill(255);
  circle(310, 345, 12);
  fill(0);
  circle(310, 345, 6);
  fill(255);
  circle(312, 343, 2);
  
  // Nose
  fill(255, 200, 150);
  ellipse(300, 355, 6, 8);
  fill(200, 150, 120);
  ellipse(297, 357, 3, 2);
  ellipse(303, 357, 3, 2);
  
  // Mouth (smiling)
  fill(200, 50, 50);
  stroke(150, 0, 0);
  strokeWeight(1);
  ellipse(300, 365, 20, 10);
  
  // Rosy cheeks
  fill(255, 200, 200, 100);
  stroke(255, 200, 200);
  circle(285, 355, 10);
  circle(315, 355, 10);
}

function drawCharacter2() {
  // Body (purple shirt)
  fill(150, 100, 150);
  stroke(0);
  strokeWeight(2);
  rect(110, 380, 80, 100);
  
  // Arms - left arm waves
  fill(150, 100, 150);
  rect(90, 390 - sin(frameCount * 0.2 + 1) * 10, 20, 60);
  rect(190, 390, 20, 60);
  
  // Legs - walking animation
  rect(120, 480 + sin(frameCount * 0.3 + 1) * 3, 25, 50);
  rect(155, 480 - sin(frameCount * 0.3 + 1) * 3, 25, 50);
  
  // Face (slightly different skin tone)
  fill(255, 210, 170);
  circle(150, 350, 70);
  
  // Hair (blonde)
  fill(255, 220, 100);
  stroke(200, 180, 80);
  strokeWeight(1);
  circle(130, 330, 20);
  circle(140, 325, 22);
  circle(150, 323, 23);
  circle(160, 325, 22);
  circle(170, 330, 20);
  
  // Eyebrows
  fill(200, 180, 80);
  stroke(0);
  rect(135, 338, 15, 3);
  rect(155, 338, 15, 3);
  
  // Left eye
  fill(255);
  stroke(0);
  strokeWeight(1);
  circle(140, 345, 12);
  fill(0);
  circle(140, 345, 6);
  fill(255);
  circle(142, 343, 2);
  
  // Right eye
  fill(255);
  circle(160, 345, 12);
  fill(0);
  circle(160, 345, 6);
  fill(255);
  circle(162, 343, 2);
  
  // Nose
  fill(255, 200, 150);
  ellipse(150, 355, 6, 8);
  fill(200, 150, 120);
  ellipse(147, 357, 3, 2);
  ellipse(153, 357, 3, 2);
  
  // Mouth (smiling)
  fill(200, 50, 50);
  stroke(150, 0, 0);
  strokeWeight(1);
  ellipse(150, 365, 20, 10);
  
  // Rosy cheeks
  fill(255, 200, 200, 100);
  stroke(255, 200, 200);
  circle(135, 355, 10);
  circle(165, 355, 10);
}

function drawBus() {
  // Bus body
  fill(255, 200, 0);
  stroke(0);
  strokeWeight(3);
  rect(450, 320, 250, 150);
  
  // Black stripe
  fill(50, 50, 50);
  strokeWeight(1);
  rect(450, 360, 250, 15);
  
  // Bus windows
  fill(150, 200, 255);
  strokeWeight(2);
  rect(470, 340, 50, 40);
  rect(540, 340, 50, 40);
  rect(610, 340, 50, 40);
  
  // Window frames
  stroke(100, 100, 100);
  strokeWeight(1);
  rect(470, 340, 50, 40);
  rect(540, 340, 50, 40);
  rect(610, 340, 50, 40);
  
  // Bus front windshield
  fill(150, 200, 255);
  stroke(100, 100, 100);
  strokeWeight(2);
  rect(470, 390, 210, 50);
  
  // Driver silhouette
  fill(80, 80, 80);
  circle(500, 410, 25);
  rect(485, 420, 30, 25);
  
  // Bus wheels
  fill(50, 50, 50);
  stroke(0);
  strokeWeight(2);
  circle(500, 470, 40);
  circle(650, 470, 40);
  
  // Wheel hubs
  fill(180, 180, 180);
  circle(500, 470, 15);
  circle(650, 470, 15);
  
  // Wheel spokes (rotating)
  fill(100, 100, 100);
  rect(495, 465, 10, 2);
  rect(495, 475, 10, 2);
  rect(645, 465, 10, 2);
  rect(645, 475, 10, 2);
  
  // Bus door
  fill(100, 100, 100);
  stroke(70, 70, 70);
  strokeWeight(2);
  rect(680, 380, 15, 80);
  
  // Door handle
  fill(200, 200, 200);
  circle(685, 420, 5);
  
  // Bus headlights
  fill(255, 255, 200);
  stroke(200, 200, 0);
  strokeWeight(2);
  circle(690, 350, 20);
  circle(690, 410, 15);
  
  // Bus number sign
  fill(255);
  stroke(0);
  strokeWeight(1);
  rect(660, 310, 35, 20);
  fill(0);
  rect(672, 315, 3, 10);
  rect(682, 315, 3, 10);
}

function mousePressed() {
  saveCanvas('bus_stop_animation', 'jpg');
}
