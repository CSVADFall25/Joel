//Example adapted from Kyle McDonald's OpenCV Contour Detection example
//https://kylemcdonald.github.io/cv-examples/

let capture;
let src, dst;
let cap;
let ready = false;
var w = 640;
var h = 480;
let showThresholded = false;



function setup() {
  createCanvas(w, h);
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();
  capture.elt.setAttribute('playsinline', '');
  
  // Wait for video to be ready
  capture.elt.addEventListener('loadedmetadata', function() {
    console.log('Video metadata loaded');
  });
  
  // Setup UI controls
  let blurSlider = select('#blurRadius');
  let thresholdSlider = select('#threshold');
  let thresholdCheckbox = select('#showThresholded');
  
  if (blurSlider) {
    blurSlider.input(function() {
      select('#blurValue').html(map(blurSlider.value(), 0, 100, 1, 10).toFixed(1));
    });
  }
  
  if (thresholdSlider) {
    thresholdSlider.input(function() {
      select('#thresholdValue').html(map(thresholdSlider.value(), 0, 100, 0, 255).toFixed(0));
    });
  }
  
  if (thresholdCheckbox) {
    thresholdCheckbox.changed(function() {
      showThresholded = thresholdCheckbox.checked();
    });
  }
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
  console.log('Initializing Mats');
  // cv.Mat(rows, cols, type)
  captureMat = new cv.Mat(h, w, cv.CV_8UC4);
  gray = new cv.Mat(h, w, cv.CV_8UC1);
  blurred = new cv.Mat(h, w, cv.CV_8UC1);
  thresholded = new cv.Mat(h, w, cv.CV_8UC1);
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
  image(capture, 0, 0, w, h);
  
  // Only process if we have pixels
  capture.loadPixels();
  if (capture.pixels && capture.pixels.length > 0) {
    try {
      // copy pixel data into OpenCV Mat
      captureMat.data.set(capture.pixels);

      var blurRadius = select('#blurRadius') ? select('#blurRadius').value() : 1;
      blurRadius = map(blurRadius, 0, 100, 1, 10);

      var threshold = select('#threshold') ? select('#threshold').value() : 50;
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
        image(capture, 0, 0, w, h);
      }

      contours = new cv.MatVector();
      hierarchy = new cv.Mat();
      cv.findContours(thresholded, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE, new cv.Point(0, 0));
      
      // Draw contours if not in thresholded mode
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
        }
        // free contours structures
        hierarchy.delete();
        contours.delete();
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
  resizeCanvas(640, 480);
}

function cleanup() {
  if (src && !src.isDeleted()) src.delete();
  if (dst && !dst.isDeleted()) dst.delete();
}
