//Example adapted from Kyle McDonald's OpenCV Contour Detection example
//https://kylemcdonald.github.io/cv-examples/

let capture;
let src, dst;
let cap;
let ready = false;
let showThresholded = false;

// UI element references
let blurSlider, thresholdSlider;
let objectCountDiv;

// Audio
let customOscillator;
let harmonicOscillators = [];
let phase = 0;
let currentObjectCount = 0;



function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(windowWidth, windowHeight);
  capture.hide();
  capture.elt.setAttribute('playsinline', '');
  
  // Wait for video to be ready
  capture.elt.addEventListener('loadedmetadata', function() {
    console.log('Video metadata loaded');
  });
  
    // Create multiple oscillators for harmonics
  harmonicOscillators = [];
  for (let i = 0; i < 10; i++) { // Support up to 10 harmonics (100 objects)
    let osc = new p5.Oscillator();
    osc.setType('sine');
    osc.freq(41 * (i + 1)); // Harmonic frequencies
    osc.amp(0); // Start silent
    harmonicOscillators.push(osc);
  }
  
  // Ask user to enable sound
  setTimeout(() => {
    let enableSound = confirm("Enable sound?");
    if (enableSound) {
      harmonicOscillators.forEach(osc => osc.start());
    }
  }, 1000);
  
  // Create UI controls within the canvas
  let titleDiv = createDiv('Contour Detection Example');
  titleDiv.position(10, 10);
  titleDiv.style('color', '#fff');
  titleDiv.style('font-size', '18px');
  titleDiv.style('font-family', 'sans-serif');
  titleDiv.style('background', 'rgba(0,0,0,0.7)');
  titleDiv.style('padding', '5px 10px');
  titleDiv.style('border-radius', '4px');

  let blurLabel = createDiv('Blur Radius:');
  blurLabel.position(10, 45);
  blurLabel.style('color', '#fff');
  blurLabel.style('font-size', '14px');
  blurLabel.style('font-family', 'sans-serif');

  let blurSlider = createSlider(0, 100, 10);
  blurSlider.position(120, 45);
  blurSlider.style('width', '200px');

  let blurValue = createDiv('1.0px');
  blurValue.position(330, 45);
  blurValue.style('color', '#fff');
  blurValue.style('font-size', '14px');
  blurValue.style('font-family', 'sans-serif');

  let thresholdLabel = createDiv('Threshold:');
  thresholdLabel.position(10, 75);
  thresholdLabel.style('color', '#fff');
  thresholdLabel.style('font-size', '14px');
  thresholdLabel.style('font-family', 'sans-serif');

  let thresholdSlider = createSlider(0, 100, 50);
  thresholdSlider.position(120, 75);
  thresholdSlider.style('width', '200px');

  let thresholdValue = createDiv('127');
  thresholdValue.position(330, 75);
  thresholdValue.style('color', '#fff');
  thresholdValue.style('font-size', '14px');
  thresholdValue.style('font-family', 'sans-serif');

  let thresholdCheckbox = createCheckbox(' Show Thresholded', false);
  thresholdCheckbox.position(10, 105);
  thresholdCheckbox.style('color', '#fff');
  thresholdCheckbox.style('font-size', '14px');
  thresholdCheckbox.style('font-family', 'sans-serif');

  let contourCountDiv = createDiv('Objects: 0');
  contourCountDiv.position(10, 135);
  contourCountDiv.style('color', '#fff');
  contourCountDiv.style('font-size', '16px');
  contourCountDiv.style('font-family', 'sans-serif');
  contourCountDiv.style('background', 'rgba(0,0,0,0.7)');
  contourCountDiv.style('padding', '5px 10px');
  contourCountDiv.style('border-radius', '4px');

  // Store references for use in draw()
  this.blurSlider = blurSlider;
  this.thresholdSlider = thresholdSlider;
  this.contourCountDiv = contourCountDiv;

  // Set up event handlers
  blurSlider.input(() => {
    let val = map(blurSlider.value(), 0, 100, 1, 10);
    blurValue.html(val.toFixed(1) + 'px');
  });

  thresholdSlider.input(() => {
    let val = map(thresholdSlider.value(), 0, 100, 0, 255);
    thresholdValue.html(Math.round(val).toString());
  });

  thresholdCheckbox.changed(() => {
    showThresholded = thresholdCheckbox.checked();
  });
}

var captureMat, gray, blurred, thresholded;
var contours, hierarchy;

function cvSetup() {
  console.log('cvSetup');

  // If cv is not yet defined (OpenCV.js not loaded), poll until it is
  if (typeof cv === 'undefined' || !cv.Mat) {
    console.log('OpenCV.js not ready yet, waiting...');
    let waitInterval = setInterval(function() {
      if (typeof cv !== 'undefined' && cv.Mat) {
        clearInterval(waitInterval);
        initMats();
      }
    }, 100);
    return;
  }
  // If cv is already ready, initialize mats immediately
  initMats();
}

function initMats() {
  console.log('Initializing Mats with dimensions:', width, height);
  
  // Clean up existing Mats if they exist
  if (captureMat && !captureMat.isDeleted()) captureMat.delete();
  if (gray && !gray.isDeleted()) gray.delete();
  if (blurred && !blurred.isDeleted()) blurred.delete();
  if (thresholded && !thresholded.isDeleted()) thresholded.delete();
  
  // cv.Mat(rows, cols, type)
  captureMat = new cv.Mat(height, width, cv.CV_8UC4);
  gray = new cv.Mat(height, width, cv.CV_8UC1);
  blurred = new cv.Mat(height, width, cv.CV_8UC1);
  thresholded = new cv.Mat(height, width, cv.CV_8UC1);
}

function onOpenCvReady() {
  document.getElementById('status').innerText = 'OpenCV.js is ready!';
  ready = true;
  cvSetup();
}


function draw() {
  if (!ready) {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Loading OpenCV.js...", width / 2, height / 2);
    return;
  }
  
  // Check if capture is ready
  if (!capture || !capture.loadedmetadata) {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Waiting for camera...", width / 2, height / 2);
    return;
  }
  
  // Clear background
  background(0);
  
  // Display the video feed
  image(capture, 0, 0, width, height);
  
  // Only process if we have pixels
  capture.loadPixels();
  if (capture.pixels && capture.pixels.length > 0) {
    try {
      // copy pixel data into OpenCV Mat
      captureMat.data.set(capture.pixels);

      var blurRadius = this.blurSlider ? this.blurSlider.value() : 10;
      blurRadius = map(blurRadius, 0, 100, 1, 10);

      var threshold = this.thresholdSlider ? this.thresholdSlider.value() : 50;
      threshold = map(threshold, 0, 100, 0, 255);

      // use OpenCV.js constants
      cv.cvtColor(captureMat, gray, cv.COLOR_RGBA2GRAY);
      cv.blur(gray, blurred, new cv.Size(Math.max(1, Math.round(blurRadius)), Math.max(1, Math.round(blurRadius))));
      cv.threshold(blurred, thresholded, threshold, 255, cv.THRESH_BINARY);

      if (showThresholded) {
        var src = thresholded.data;
        var dst = capture.pixels;
        var n = src.length;
        var j = 0;
        for (var i = 0; i < n; i++) {
          dst[j++] = src[i];
          dst[j++] = src[i];
          dst[j++] = src[i];
          dst[j++] = 255;
        }
        capture.updatePixels();
        // Redisplay the modified capture
        image(capture, 0, 0, width, height);
      }

      contours = new cv.MatVector();
      hierarchy = new cv.Mat();
      cv.findContours(thresholded, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE, new cv.Point(0, 0));
      
      let objectCount = 0;
      
      // Draw contours and bounding boxes if not in thresholded mode
      if (contours && !showThresholded) {
        noStroke();
        for (var i = 0; i < contours.size(); i++) {
          fill(0, 0, 255, 128);
          var contour = contours.get(i);
          beginShape();
          // contour points are stored in contour.data32S as [x0,y0,x1,y1,...]
          var pts = contour.data32S;
          for (var p = 0; p < pts.length; p += 2) {
            var x = pts[p];
            var y = pts[p + 1];
            vertex(x, y);
          }
          endShape(CLOSE);

          noFill();
          stroke(255, 255, 255);
          var box = cv.boundingRect(contour);
          rect(box.x, box.y, box.width, box.height);

          // free contour Mat
          contour.delete();
          objectCount++; // Count each bounding box drawn
        }
        // free contours structures
        hierarchy.delete();
        contours.delete();
      }
      
      // Update object count display and audio
      if (this.contourCountDiv) {
        this.contourCountDiv.html('Objects: ' + objectCount);
        updateHarmonics(objectCount);
      }
    } catch (error) {
      console.error('OpenCV processing error:', error);
      fill(255, 0, 0);
      textAlign(CENTER, CENTER);
      text("OpenCV Error", width / 2, height / 2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (capture) {
    capture.size(width, height);
  }
  if (ready) {
    initMats();
  }
}

function cleanup() {
  if (src && !src.isDeleted()) src.delete();
  if (dst && !dst.isDeleted()) dst.delete();
}

function updateHarmonics(objectCount) {
  let numHarmonics = 1 + Math.floor(objectCount / 10);
  
  for (let i = 0; i < harmonicOscillators.length; i++) {
    if (i < numHarmonics) {
      // Calculate amplitude: each harmonic is 1/3 the amplitude of the previous
      let amplitude = 0.2 * Math.pow(1/3, i);
      harmonicOscillators[i].amp(amplitude, 0.1); // Smooth transition
    } else {
      harmonicOscillators[i].amp(0, 0.1); // Fade out unused harmonics
    }
  }
}
