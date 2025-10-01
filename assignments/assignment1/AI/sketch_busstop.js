function setup() {
  createCanvas(800, 600);
  frameRate(60);
}

function draw() {
  // STORYBOARD: 30-second animation (1800 frames)
  // Scene 1 (0-7.5s): Character 1 walks to bus stop
  // Scene 2 (7.5-15s): Character 2 arrives and they wave
  // Scene 3 (15-22.5s): Bus arrives
  // Scene 4 (22.5-30s): Both board the bus
  
  // Sky
  background(135, 206, 250);
  
  // Sun
  fill(255, 255, 150);
  stroke(255, 230, 100);
  strokeWeight(2);
  circle(700, 100, 60);
  
  // Ground
  fill(90, 90, 90);
  stroke(70, 70, 70);
  strokeWeight(2);
  rect(0, 500, 800, 100);
  
  // Sidewalk
  fill(150, 150, 150);
  rect(0, 450, 800, 50);
  
  // Bus stop pole
  fill(200, 200, 200);
  stroke(0);
  strokeWeight(2);
  rect(395, 300, 10, 150);
  
  // Bus stop sign
  fill(255, 255, 0);
  rect(350, 250, 100, 60);
  fill(0);
  strokeWeight(1);
  rect(375, 270, 50, 25);
  
  // BUS (drawn first - background layer)
  fill(255, 200, 0);
  stroke(0);
  strokeWeight(3);
  rect(450, 320, 250, 150);
  
  // Bus stripe
  fill(220, 100, 0);
  strokeWeight(1);
  rect(450, 360, 250, 15);
  
  // Bus windows
  fill(150, 200, 255);
  strokeWeight(2);
  rect(470, 340, 50, 40);
  rect(540, 340, 50, 40);
  rect(610, 340, 50, 40);
  
  // Bus driver window
  rect(470, 390, 80, 50);
  
  // Bus wheels with rotation animation
  fill(50, 50, 50);
  strokeWeight(2);
  circle(500, 470, 40);
  circle(650, 470, 40);
  
  // Wheel centers
  fill(180, 180, 180);
  circle(500, 470, 15);
  circle(650, 470, 15);
  
  // Bus door
  fill(100, 100, 100);
  rect(680, 380, 15, 80);
  
  // Headlights
  fill(255, 255, 200);
  strokeWeight(1);
  circle(690, 350, 18);
  circle(690, 430, 15);
  
  // CHARACTER 1 (blue shirt, brown hair)
  // Body
  fill(100, 150, 200);
  stroke(0);
  strokeWeight(2);
  rect(260, 380, 80, 100);
  
  // Arms (right arm waves)
  fill(100, 150, 200);
  rect(240, 390, 20, 60);
  rect(340, 390 + sin(frameCount * 0.15) * 8, 20, 60);
  
  // Legs (walking animation)
  fill(100, 150, 200);
  rect(270, 480 + sin(frameCount * 0.25) * 4, 25, 50);
  rect(305, 480 - sin(frameCount * 0.25) * 4, 25, 50);
  
  // Head
  fill(255, 220, 177);
  strokeWeight(2);
  circle(300, 350, 70);
  
  // Hair (brown, volumous)
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
  ellipse(300, 365, 18, 9);
  
  // Cheeks
  fill(255, 200, 200, 100);
  stroke(255, 200, 200);
  circle(285, 355, 10);
  circle(315, 355, 10);
  
  // CHARACTER 2 (purple shirt, blonde hair)
  // Body
  fill(150, 100, 150);
  stroke(0);
  strokeWeight(2);
  rect(110, 380, 80, 100);
  
  // Arms (left arm waves)
  fill(150, 100, 150);
  rect(90, 390 + sin(frameCount * 0.15 + 1) * 8, 20, 60);
  rect(190, 390, 20, 60);
  
  // Legs (walking animation, offset from char1)
  fill(150, 100, 150);
  rect(120, 480 + sin(frameCount * 0.25 + 1) * 4, 25, 50);
  rect(155, 480 - sin(frameCount * 0.25 + 1) * 4, 25, 50);
  
  // Head
  fill(255, 210, 170);
  strokeWeight(2);
  circle(150, 350, 70);
  
  // Hair (blonde, volumous)
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
  ellipse(150, 365, 18, 9);
  
  // Cheeks
  fill(255, 200, 200, 100);
  stroke(255, 200, 200);
  circle(135, 355, 10);
  circle(165, 355, 10);
}

function mousePressed() {
  saveCanvas('bus_stop_scene', 'jpg');
}
