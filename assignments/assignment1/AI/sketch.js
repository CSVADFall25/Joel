function setup() {
  createCanvas(800, 600);
  frameRate(60);
}

function draw() {
  // Sky gradient background
  background(135, 206, 235);
  
  // Ground
  fill(100, 100, 100);
  stroke(80, 80, 80);
  strokeWeight(2);
  rect(0, 500, 800, 100);
  
  // Sidewalk
  fill(150, 150, 150);
  rect(0, 450, 800, 50);
  
  // Scene timing (30 seconds = 1800 frames at 60fps)
  // Scene 1: 0-450 frames (0-7.5s) - Character 1 walks to bus stop
  // Scene 2: 450-900 frames (7.5-15s) - Character 2 arrives, they wave
  // Scene 3: 900-1350 frames (15-22.5s) - Bus arrives from right
  // Scene 4: 1350-1800 frames (22.5-30s) - Both characters board bus
  
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
  
  // Character 1 position (walking in from left, then stops at bus stop)
  // Character 2 position (walking in from left later, then stops next to Character 1)
  // Bus position (comes from right)
  
  // Scene 1: Character 1 walks to bus stop (0-450 frames)
  // Scene 2: Character 2 arrives (450-900 frames)
  // Scene 3: Bus arrives (900-1350 frames)
  // Scene 4: Board bus (1350-1800 frames)
  
  // Calculate positions based on frame count
  // Character 1
  // Character 2
  // Bus
  
  // Draw Character 1 (original face)
  // Draw Character 2 (friend - different colors)
  // Draw Bus
  
  drawCharacter1();
  drawCharacter2();
  drawBus();
}

function drawCharacter1() {
  // Position animation
  // Frames 0-450: Walk from x=-100 to x=300
  // Frames 450+: Stay at x=300
  // Calculate scale (0.4 for smaller character in scene)
  
  // Save current state
  // Translate and scale would be nice but we can't use them
  // Instead, we'll draw at calculated positions
  
  // Scene timing
  // 0-450: Walking to bus stop
  // 450-900: Standing, waving to friend
  // 900-1350: Standing, watching bus
  // 1350-1800: Moving toward bus and boarding
  
  // Face position
  // Body (simplified using rectangle)
  fill(100, 150, 200);
  stroke(0);
  strokeWeight(2);
  rect(260, 380, 80, 100);
  
  // Arms
  rect(240, 390, 20, 60);
  rect(340, 390, 20, 60);
  
  // Legs
  rect(270, 480, 25, 50);
  rect(305, 480, 25, 50);
  
  // Face
  fill(255, 220, 177);
  circle(300, 350, 70);
  
  // Hair
  fill(139, 69, 19);
  stroke(101, 67, 33);
  strokeWeight(1);
  circle(280, 330, 20);
  circle(290, 325, 22);
  circle(300, 323, 23);
  circle(310, 325, 22);
  circle(320, 330, 20);
  
  // Left eye
  fill(255);
  stroke(0);
  circle(290, 345, 12);
  fill(0);
  circle(290, 345, 6);
  
  // Right eye
  fill(255);
  circle(310, 345, 12);
  fill(0);
  circle(310, 345, 6);
  
  // Nose
  fill(255, 200, 150);
  ellipse(300, 355, 6, 8);
  
  // Mouth (smiling)
  fill(200, 50, 50);
  stroke(150, 0, 0);
  ellipse(300, 365, 15, 8);
}

function drawCharacter2() {
  // Position animation
  // Frames 0-450: Off screen (x=-200)
  // Frames 450-750: Walk from x=-200 to x=150
  // Frames 750+: Stay at x=150
  
  // Body (different colored shirt)
  fill(150, 100, 150);
  stroke(0);
  strokeWeight(2);
  rect(110, 380, 80, 100);
  
  // Arms (waving animation in scene 2)
  rect(90, 390, 20, 60);
  rect(190, 390, 20, 60);
  
  // Legs
  rect(120, 480, 25, 50);
  rect(155, 480, 25, 50);
  
  // Face (friend with different features)
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
  
  // Left eye
  fill(255);
  stroke(0);
  circle(140, 345, 12);
  fill(0);
  circle(140, 345, 6);
  
  // Right eye
  fill(255);
  circle(160, 345, 12);
  fill(0);
  circle(160, 345, 6);
  
  // Nose
  fill(255, 200, 150);
  ellipse(150, 355, 6, 8);
  
  // Mouth (smiling)
  fill(200, 50, 50);
  stroke(150, 0, 0);
  ellipse(150, 365, 15, 8);
}

function drawBus() {
  // Position animation
  // Frames 0-900: Off screen (x=1000)
  // Frames 900-1200: Drive from x=1000 to x=500
  // Frames 1200+: Stop at x=500
  
  // Bus body
  fill(255, 200, 0);
  stroke(0);
  strokeWeight(3);
  rect(500, 320, 250, 150);
  
  // Bus windows
  fill(150, 200, 255);
  strokeWeight(2);
  rect(520, 340, 50, 40);
  rect(590, 340, 50, 40);
  rect(660, 340, 50, 40);
  
  // Bus front window
  rect(520, 390, 210, 50);
  
  // Bus wheels
  fill(50, 50, 50);
  stroke(0);
  strokeWeight(2);
  circle(550, 470, 40);
  circle(700, 470, 40);
  
  // Wheel hubs
  fill(180, 180, 180);
  circle(550, 470, 15);
  circle(700, 470, 15);
  
  // Bus door
  fill(100, 100, 100);
  rect(730, 380, 15, 80);
  
  // Bus headlights
  fill(255, 255, 200);
  circle(740, 350, 20);
}

function mousePressed() {
  saveCanvas('bus_stop_animation', 'jpg');
}
