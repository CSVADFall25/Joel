// Create a novel color picker (p5.js version)
// Inspired by Sihwa Park's Processing example

let colorNodes = [];
let edges = [];

let currentNode = null;
let currentEdge = null;
let selectedNode = null;
let potentialEdgeStart = false;

let hueChange = false;
let brightChange = false;
let saturationChange = false;
let radiusChange = false;
let move = false;
let drawConnector = false;

let gZIndex = 0;
let drawStroke = false;
let blendModeIndex = 0;
let blendModeArr = ['blend', 'add', 'screen'];
let lastColor;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 255);
  lastColor = color(0, 255, 255);
  selectedNode = null;
  potentialEdgeStart = false;
  
  // Simple UI
  let strokeCB = createCheckbox('Stroke', false);
  strokeCB.position(10, 10);
  strokeCB.changed(() => drawStroke = strokeCB.checked());

  let blendSelect = createSelect();
  blendSelect.position(10, 40);
  ['BLEND', 'ADD', 'SCREEN'].forEach((m, i) => blendSelect.option(m, i));
  blendSelect.changed(() => blendModeIndex = int(blendSelect.value()));

  let info = 
    "====How to Use====\n" +
    "Mouse\n" +
    "- Left click empty: add node\n" +
    "- Left click node: select (glows)\n" +
    "- Drag selected node: move it\n" +
    "- Mouse wheel on selected: cycle hue\n" +
    "- Right click node/edge: delete\n\n" +
    "Edge Creation\n" +
    "- Click & release on selected node: start\n" +
    "- Move mouse to draw edge line\n" +
    "- Click another node: finish\n\n" +
    "Keys\n" +
    "- Space: save screenshot\n" +
    "- Hold + drag from node:\n" +
    "  R: radius, H: hue, S: sat, B: bright\n";
  let infoDiv = createDiv('<pre>' + info + '</pre>');
  infoDiv.position(10, 70);
  infoDiv.style('color', '#888');
  infoDiv.style('font-size', '12px');
  infoDiv.style('background', '#222');
  infoDiv.style('padding', '8px');
  infoDiv.style('border-radius', '8px');
  infoDiv.style('max-width', '300px');
}

function draw() {
  background(0);
  resetMatrix();
  colorMode(RGB, 255);
  setBlendMode(blendModeArr[blendModeIndex]);
  
  // draw all edges
  for (let e of edges) {
    console.log('drawing edge from', e.startNode.pos.x, e.startNode.pos.y, 'to', e.endNode.pos.x, e.endNode.pos.y);
    e.draw();
  }
  setBlendMode('blend');

  // draw all nodes
  if (drawStroke) {
    stroke(255);
    strokeWeight(3);
  } else {
    noStroke();
  }
  for (let n of colorNodes) {
    n.draw();
  }

  // draw glow for selected node
  if (selectedNode) {
    stroke(255);
    strokeWeight(3);
    noFill();
    ellipse(selectedNode.pos.x, selectedNode.pos.y, selectedNode.radius * 2 + 10, selectedNode.radius * 2 + 10);
  }

  // draw connector and adjustments
  if (currentNode) {
    let m = createVector(mouseX - width/2, mouseY - height/2);
    let v = p5.Vector.sub(m, currentNode.pos);
    let angle = v.heading();

    if (hueChange || brightChange || saturationChange) {
      stroke(255);
      strokeWeight(3);
      point(currentNode.pos.x, currentNode.pos.y);
      strokeWeight(1);
      let endPoint = m.copy();
      if (v.mag() >= currentNode.radius) {
        endPoint.x = currentNode.radius;
        endPoint.y = 0;
        endPoint.rotate(angle);
        endPoint.add(currentNode.pos);
      }
      line(currentNode.pos.x, currentNode.pos.y, endPoint.x, endPoint.y);
    }

    if (drawConnector && currentEdge) {
      let sl = createVector(currentNode.radius * 0.25, 0).rotate(angle + PI * 0.5);
      let el = p5.Vector.add(sl, m);
      sl.add(currentNode.pos);
      let sr = createVector(currentNode.radius * 0.25, 0).rotate(angle - PI * 0.5);
      let er = p5.Vector.add(sr, m);
      sr.add(currentNode.pos);

      stroke(255);
      strokeWeight(1);
      beginShape(LINES);
      vertex(currentNode.pos.x, currentNode.pos.y, 0);
      vertex(sl.x, sl.y, 0);
      vertex(currentNode.pos.x, currentNode.pos.y, 0);
      vertex(sr.x, sr.y, 0);
      vertex(currentNode.pos.x, currentNode.pos.y, 0);
      vertex(mouseX - width/2, mouseY - height/2, 0);
      vertex(mouseX - width/2, mouseY - height/2, 0);
      vertex(el.x, el.y, 0);
      vertex(mouseX - width/2, mouseY - height/2, 0);
      vertex(er.x, er.y, 0);
      endShape();
      currentEdge.draw();
    }
  }
}

function mousePressed() {
  potentialEdgeStart = false;

  // Finish edge if drawing and clicked on another node
  if (drawConnector && mouseButton === LEFT) {
    let node = nodesHitTest(mouseX - width/2, mouseY - height/2);
    if (node && node !== currentNode) {
      if (!currentNode.hasEdgeWith(node)) {
        currentEdge.setEndNode(node);
        edges.push(currentEdge);
        currentNode.addEdge(currentEdge);
        node.addEdge(currentEdge);
      }
      currentNode = null;
      drawConnector = false;
      currentEdge = null;
      return;
    }
  }

  // Cancel edge if drawing and not finished
  if (drawConnector) {
    drawConnector = false;
    currentEdge = null;
    currentNode = null;
    return;
  }

  // Ignore UI elements
  if (overAnyUI()) return;

  let node = nodesHitTest(mouseX - width/2, mouseY - height/2);
  if (node) {
    currentNode = node;
    if (mouseButton === LEFT) {
      if (node === selectedNode) {
        potentialEdgeStart = true;
      } else {
        selectedNode = node;
      }
    } else if (mouseButton === RIGHT) {
      // delete node
      let removeIndices = [];
      for (let edge of node.edges) {
        let idx = edges.indexOf(edge);
        if (idx !== -1) removeIndices.push(idx);
      }
      removeIndices.sort((a, b) => b - a);
      for (let idx of removeIndices) edges.splice(idx, 1);
      node.removeAllEdges();
      let idx = colorNodes.indexOf(node);
      if (idx !== -1) colorNodes.splice(idx, 1);
      if (node === selectedNode) selectedNode = null;
    }
  } else {
    let edge = edgesHitTest(mouseX - width/2, mouseY - height/2);
    if (edge) {
      currentEdge = edge;
      if (mouseButton === LEFT) {
        let c = get(mouseX, mouseY); // get color under mouse
        let midNode = new ColorNode(mouseX - width/2, mouseY - height/2, 50, color(c));
        colorNodes.push(midNode);
        lastColor = midNode.c;

        let edge1 = GradientEdgeRect.fromNodes(edge.startNode, midNode, 0, 0, gZIndex++);
        let edge2 = GradientEdgeRect.fromNodes(midNode, edge.endNode, 0, 0, gZIndex++);
        edges.push(edge1, edge2);
        edge.startNode.removeEdge(edge);
        edge.startNode.addEdge(edge1);
        midNode.addEdge(edge1);
        midNode.addEdge(edge2);
        edge.endNode.removeEdge(edge);
        edge.endNode.addEdge(edge2);

        let idx = edges.indexOf(edge);
        if (idx !== -1) edges.splice(idx, 1);
      } else if (mouseButton === RIGHT) {
        edge.startNode.removeEdge(edge);
        edge.endNode.removeEdge(edge);
        let idx = edges.indexOf(edge);
        if (idx !== -1) edges.splice(idx, 1);
      }
    } else {
      if (mouseButton === LEFT) {
        let cc = new ColorNode(mouseX - width/2, mouseY - height/2, 50, lastColor);
        colorNodes.push(cc);
        selectedNode = cc;
      }
    }
  }
}

function mouseDragged() {
  if (potentialEdgeStart) potentialEdgeStart = false;
  if (mouseButton === RIGHT) return;
  if (currentNode) {
    if (hueChange) currentNode.changeHue(mouseX - width/2, mouseY - height/2);
    else if (brightChange) currentNode.changeBright(mouseX - width/2, mouseY - height/2);
    else if (saturationChange) currentNode.changeSaturation(mouseX - width/2, mouseY - height/2);
    else if (radiusChange) currentNode.changeRadius(mouseX - width/2, mouseY - height/2);
    else if (move) currentNode.move(createVector(mouseX-pmouseX, mouseY-pmouseY));
    else if (selectedNode && !hueChange && !brightChange && !saturationChange && !radiusChange && !move) {
      selectedNode.move(createVector(mouseX - pmouseX, mouseY - pmouseY));
    }
    lastColor = currentNode.c;
  }
}

function mouseReleased() {
  if (potentialEdgeStart && selectedNode && selectedNode.hitTest(mouseX - width/2, mouseY - height/2)) {
    drawConnector = true;
    currentEdge = GradientEdgeRect.fromNodes(selectedNode, null, mouseX - width/2, mouseY - height/2, gZIndex++);
    currentNode = selectedNode;
  } else {
    currentNode = null;
    drawConnector = false;
    currentEdge = null;
  }
  potentialEdgeStart = false;
}

function mouseMoved() {
  if (drawConnector && currentEdge) {
    currentEdge.setEndMid(mouseX - width/2, mouseY - height/2);
    let node = nodesHitTest(mouseX - width/2, mouseY - height/2);
    if (!node) {
      currentEdge.setEndColor(currentNode.c);
    } else if (node !== currentNode) {
      currentEdge.setEndColor(node.c);
    }
  }
}

function mouseWheel(event) {
  if (selectedNode) {
    let delta = event.deltaY > 0 ? 10 : -10;
    selectedNode.hue = (selectedNode.hue + delta + 256) % 256;
    colorMode(HSB, 255);
    selectedNode.c = color(selectedNode.hue, selectedNode.sat, selectedNode.bri);
    selectedNode.updateEdgesColor();
  }
}

function keyPressed() {
  if (drawConnector) return;
  if (key === 'h' || key === 'H') hueChange = true;
  else if (key === 's' || key === 'S') brightChange = true;
  else if (key === 'b' || key === 'B') saturationChange = true;
  else if (key === 'm' || key === 'M') move = true;
  else if (key === 'r' || key === 'R') radiusChange = true;
  else if (key === ' ') saveCanvas('screenshot', 'png');
}

function keyReleased() {
  hueChange = false;
  brightChange = false;
  saturationChange = false;
  move = false;
  radiusChange = false;
}

// ----- Helper and Class Definitions -----

function overAnyUI() {
  // crude: ignore if mouse is on left 220px or right 170px
  return mouseX < 230 || mouseX > width - 170;
}

function nodesHitTest(x, y) {
  for (let i = colorNodes.length - 1; i >= 0; i--) {
    if (colorNodes[i].hitTest(x, y)) return colorNodes[i];
  }
  return null;
}

function edgesHitTest(x, y) {
  for (let i = edges.length - 1; i >= 0; i--) {
    if (edges[i].hitTest(x, y)) return edges[i];
  }
  return null;
}

function setBlendMode(mode) {
  if (mode === 'blend') blendMode(BLEND);
  else if (mode === 'add') blendMode(ADD);
  else if (mode === 'screen') blendMode(SCREEN);
}


// Helper: point-line distance
function distToSegment(p, v, w) {
  let l2 = p5.Vector.dist(v, w)**2;
  if (l2 === 0) return p5.Vector.dist(p, v);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = max(0, min(1, t));
  let proj = createVector(v.x + t * (w.x - v.x), v.y + t * (w.y - v.y));
  return p5.Vector.dist(p, proj);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scale = sqrt(pow(windowWidth, 2) + pow(windowHeight, 2))/2;
}