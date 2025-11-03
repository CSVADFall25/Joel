// Global variables
let audioManager;
let essentiaAnalyzer;
let audioPlayerUIs = [];
let visualMode = 'energy-mood'; // 'energy-mood', 'circle-of-fifths', 'song-structure'
let modeDropdown;
let isLoading = true;

// Colors inspired by jaffx.audio (modern dark theme with orange accents)
const colors = {
  background: '#0f0f0f',
  surface: '#1a1a1a',
  primary: '#ff6b35',
  secondary: '#4a90e2',
  text: '#ffffff',
  textMuted: '#888888',
  accent: '#00ff88'
};

async function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize managers
  audioManager = new AudioManager();
  essentiaAnalyzer = new EssentiaAnalyzer();
  
  // Create mode selector dropdown
  createModeSelector();
  
  // Initialize the app
  await initializeApp();
}

function draw() {
  background(colors.background);
  
  if (isLoading) {
    drawLoadingScreen();
  } else {
    // Draw UI and visualizations based on current mode
    drawInterface();
    drawAudioPlayers();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  repositionAudioPlayers();
}

function createModeSelector() {
  // Create dropdown for visualization modes
  modeDropdown = createSelect();
  modeDropdown.position(20, 20);
  modeDropdown.option('Energy/Mood Grid', 'energy-mood');
  modeDropdown.option('Circle of Fifths', 'circle-of-fifths');
  modeDropdown.option('Song Structure', 'song-structure');
  modeDropdown.selected('energy-mood');
  modeDropdown.changed(onModeChange);
  modeDropdown.style('background-color', colors.surface);
  modeDropdown.style('color', colors.text);
  modeDropdown.style('border', `1px solid ${colors.primary}`);
  modeDropdown.style('font-family', 'Arial, sans-serif');
  modeDropdown.style('padding', '8px');
}

function onModeChange() {
  visualMode = modeDropdown.value();
  repositionAudioPlayers();
}

async function initializeApp() {
  console.log('Initializing EssentiaTest app...');
  
  try {
    // Initialize Essentia analyzer
    await essentiaAnalyzer.initialize();
    
    // Load audio dataset
    const audioFiles = await audioManager.loadAudioDataset();
    
    // Analyze audio files and create UI components
    await analyzeAndCreateUIComponents(audioFiles);
    
    isLoading = false;
    console.log('App initialization complete');
    
  } catch (error) {
    console.error('Error initializing app:', error);
    isLoading = false;
  }
}

async function analyzeAndCreateUIComponents(audioFiles) {
  audioPlayerUIs = [];
  
  for (let i = 0; i < audioFiles.length; i++) {
    const audioFile = audioFiles[i];
    
    // Generate analysis for the audio file
    audioFile.analysis = await essentiaAnalyzer.analyzeAudio(null); // Will use mock data for now
    
    // Create UI component for this audio file
    const ui = new AudioPlayerUI(audioManager, 0, 0, 280, 80);
    audioPlayerUIs.push({
      ui: ui,
      audioFile: audioFile,
      visualPosition: { x: 0, y: 0 }
    });
  }
  
  repositionAudioPlayers();
}

function repositionAudioPlayers() {
  if (audioPlayerUIs.length === 0) return;
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  audioPlayerUIs.forEach((playerData, index) => {
    const audioFile = playerData.audioFile;
    const analysis = audioFile.analysis;
    
    if (!analysis) return;
    
    let x, y;
    
    switch (visualMode) {
      case 'energy-mood':
        // Map energy (0-1) to X axis, mood (0-1) to Y axis
        x = centerX + (analysis.energy - 0.5) * 400;
        y = centerY - (analysis.mood - 0.5) * 300; // Invert Y for intuitive mapping
        break;
        
      case 'circle-of-fifths':
        const coords = essentiaAnalyzer.getCircleOfFifthsCoordinates(analysis.key, 200);
        x = centerX + coords.x;
        y = centerY + coords.y;
        break;
        
      case 'song-structure':
        const structCoords = essentiaAnalyzer.getStructureCoordinates(analysis.structure);
        x = centerX + structCoords.x;
        y = centerY + structCoords.y;
        break;
        
      default:
        x = 50 + (index % 3) * 300;
        y = 100 + Math.floor(index / 3) * 100;
    }
    
    // Ensure UI stays within canvas bounds
    x = constrain(x, 10, width - 290);
    y = constrain(y, 80, height - 90);
    
    playerData.ui.x = x;
    playerData.ui.y = y;
    playerData.visualPosition = { x, y };
  });
}

function drawLoadingScreen() {
  fill(colors.text);
  textAlign(CENTER);
  textSize(24);
  text('Loading EssentiaTest...', width/2, height/2 - 20);
  
  textSize(16);
  fill(colors.textMuted);
  text('Analyzing audio dataset with Essentia.js', width/2, height/2 + 20);
  
  // Loading animation
  const loadingDots = '.'.repeat((frameCount % 60) / 20 + 1);
  text(loadingDots, width/2 + 200, height/2 + 20);
}

function drawInterface() {
  // Title
  fill(colors.text);
  textAlign(LEFT);
  textSize(20);
  text('EssentiaTest: Music Analysis Visualization', 20, height - 50);
  
  // Mode indicator and stats
  textSize(14);
  fill(colors.textMuted);
  text(`Mode: ${getModeName(visualMode)} | Files: ${audioManager.audioFiles.length}`, 20, height - 30);
  
  if (audioManager.currentPlayingAudio) {
    text(`♪ Playing: ${audioManager.currentPlayingAudio.name}`, 20, height - 10);
  }
  
  // Draw visualization framework
  drawVisualizationMode();
}

function getModeName(mode) {
  switch(mode) {
    case 'energy-mood': return 'Energy/Mood Grid';
    case 'circle-of-fifths': return 'Circle of Fifths';
    case 'song-structure': return 'Song Structure Categories';
    default: return 'Unknown';
  }
}

function drawVisualizationMode() {
  // Draw the background framework for each visualization mode
  push();
  translate(width/2, height/2);
  
  switch(visualMode) {
    case 'energy-mood':
      drawEnergyMoodGrid();
      break;
    case 'circle-of-fifths':
      drawCircleOfFifths();
      break;
    case 'song-structure':
      drawSongStructure();
      break;
  }
  
  pop();
}

function drawEnergyMoodGrid() {
  stroke(colors.primary);
  strokeWeight(1);
  
  // Draw grid axes
  line(-200, 0, 200, 0); // Energy axis (horizontal)
  line(0, -150, 0, 150); // Mood axis (vertical)
  
  // Grid lines
  strokeWeight(0.5);
  stroke(colors.textMuted);
  for (let i = -150; i <= 150; i += 50) {
    if (i !== 0) {
      line(-200, i, 200, i);
      line(i, -150, i, 150);
    }
  }
  
  // Labels
  fill(colors.text);
  textAlign(CENTER);
  textSize(12);
  text('Low Energy', -150, 20);
  text('High Energy', 150, 20);
  text('Sad', -20, -130);
  text('Happy', -20, 140);
}

function drawCircleOfFifths() {
  stroke(colors.secondary);
  strokeWeight(2);
  noFill();
  
  // Draw circle
  circle(0, 0, 400);
  
  // Draw key positions
  const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
  for(let i = 0; i < keys.length; i++) {
    let angle = (i * TWO_PI / 12) - PI/2;
    let x = cos(angle) * 200;
    let y = sin(angle) * 200;
    
    // Key background
    fill(colors.surface);
    stroke(colors.primary);
    strokeWeight(1);
    circle(x, y, 30);
    
    fill(colors.text);
    noStroke();
    textAlign(CENTER);
    textSize(14);
    text(keys[i], x, y + 5);
  }
}

function drawSongStructure() {
  // Draw 5 categories
  const categories = ['Hook', 'Verse', 'Pre-Chorus', 'Chorus', 'Outro'];
  const categoryWidth = 300;
  const categoryHeight = 60;
  
  for(let i = 0; i < categories.length; i++) {
    let x = -categoryWidth/2;
    let y = (i - 2) * (categoryHeight + 20);
    
    fill(colors.surface);
    stroke(colors.primary);
    strokeWeight(2);
    rect(x, y, categoryWidth, categoryHeight, 8);
    
    fill(colors.text);
    noStroke();
    textAlign(CENTER);
    textSize(16);
    text(categories[i], 0, y + categoryHeight/2 + 6);
  }
}

function drawAudioPlayers() {
  // Draw all audio player UIs
  audioPlayerUIs.forEach(playerData => {
    playerData.ui.draw(playerData.audioFile);
  });
}

function mousePressed() {
  // Handle clicks on audio player UIs
  let handled = false;
  
  audioPlayerUIs.forEach(playerData => {
    if (playerData.ui.handleClick(mouseX, mouseY, playerData.audioFile)) {
      handled = true;
    }
  });
  
  return handled;
}

function mouseMoved() {
  // Update hover states
  audioPlayerUIs.forEach(playerData => {
    playerData.ui.checkHover(mouseX, mouseY);
  });
}
