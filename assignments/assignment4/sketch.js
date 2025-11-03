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
  // Create custom dropdown container
  let dropdownContainer = createDiv('');
  dropdownContainer.position(20, 20);
  dropdownContainer.style('z-index', '1000');
  dropdownContainer.style('position', 'absolute');

  // Create dropdown button
  let dropdownButton = createButton('Energy/Mood Grid ▼');
  dropdownButton.parent(dropdownContainer);
  dropdownButton.style('background-color', colors.surface);
  dropdownButton.style('color', colors.text);
  dropdownButton.style('border', `1px solid ${colors.primary}`);
  dropdownButton.style('border-radius', '4px');
  dropdownButton.style('font-family', 'Arial, sans-serif');
  dropdownButton.style('padding', '8px');
  dropdownButton.style('outline', 'none');
  dropdownButton.style('cursor', 'pointer');
  dropdownButton.style('text-align', 'left');
  dropdownButton.style('transition', 'all 0.3s ease');
  dropdownButton.style('white-space', 'nowrap');

  // Create dropdown menu (hidden initially)
  let dropdownMenu = createDiv('');
  dropdownMenu.parent(dropdownContainer);
  dropdownMenu.style('display', 'none');
  dropdownMenu.style('position', 'absolute');
  dropdownMenu.style('top', '100%');
  dropdownMenu.style('left', '0');
  dropdownMenu.style('background-color', colors.surface);
  dropdownMenu.style('border', `1px solid ${colors.primary}`);
  dropdownMenu.style('border-radius', '4px');
  dropdownMenu.style('z-index', '1001');
  dropdownMenu.style('box-shadow', '0 4px 8px rgba(0,0,0,0.3)');
  dropdownMenu.style('white-space', 'nowrap');

  // Create menu options
  const modes = [
    { label: 'Energy/Mood Grid', value: 'energy-mood' },
    { label: 'Circle of Fifths', value: 'circle-of-fifths' },
    { label: 'Song Structure', value: 'song-structure' }
  ];

  modes.forEach(mode => {
    let option = createDiv(mode.label);
    option.parent(dropdownMenu);
    option.style('padding', '8px 12px');
    option.style('cursor', 'pointer');
    option.style('color', colors.text);
    option.style('border-bottom', mode.value !== 'song-structure' ? '1px solid #333' : 'none');
    option.style('transition', 'background-color 0.2s ease');

    option.mouseOver(() => {
      option.style('background-color', colors.primary + '40');
    });
    option.mouseOut(() => {
      option.style('background-color', 'transparent');
    });

    option.mousePressed(() => {
      visualMode = mode.value;
      dropdownButton.html(mode.label + ' ▼');
      dropdownMenu.style('display', 'none');
      repositionAudioPlayers();
      console.log('Mode changed to:', mode.value);
    });
  });

  // Toggle dropdown on button click
  let isOpen = false;
  dropdownButton.mousePressed(() => {
    isOpen = !isOpen;
    dropdownMenu.style('display', isOpen ? 'block' : 'none');
    dropdownButton.html(dropdownButton.html().replace(isOpen ? '▼' : '▲', isOpen ? '▲' : '▼'));
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdownContainer.elt.contains(e.target)) {
      isOpen = false;
      dropdownMenu.style('display', 'none');
      dropdownButton.html(dropdownButton.html().replace('▲', '▼'));
    }
  });

  console.log('Custom dropdown created successfully');
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
    
    console.log(`Analyzing ${audioFile.name}...`);
    
    // Load audio buffer for Essentia analysis
    const audioBuffer = await audioManager.loadAudioBuffer(audioFile);
    
    // Analyze with Essentia (will use mock if buffer loading fails)
    audioFile.analysis = await essentiaAnalyzer.analyzeAudio(audioBuffer);
    
    console.log(`Analysis complete for ${audioFile.name}:`, audioFile.analysis);
    
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
  
  // Calculate available space (leave room for dropdown at top and UI at bottom)
  const availableWidth = width - 40; // 20px margin on each side
  const availableHeight = height - 120; // 80px for dropdown/top margin, 40px for bottom UI
  const maxRadius = Math.min(availableWidth, availableHeight) / 2 * 0.9; // 90% of available space
  
  audioPlayerUIs.forEach((playerData, index) => {
    const audioFile = playerData.audioFile;
    const analysis = audioFile.analysis;
    
    if (!analysis) return;
    
    let x, y;
    let attempts = 0;
    const maxAttempts = 50; // Limit attempts to prevent infinite loops
    
    // Keep trying to find a non-overlapping position
    do {
      switch (visualMode) {
        case 'energy-mood':
          // Map energy (0-1) to X axis, mood (0-1) to Y axis
          // Constrain to grid space (80% of available space)
          const gridWidth = availableWidth * 0.8;
          const gridHeight = availableHeight * 0.8;
          
          x = centerX + (analysis.energy - 0.5) * gridWidth;
          y = centerY - (analysis.mood - 0.5) * gridHeight; // Invert Y for intuitive mapping
          
          // Add small random offset to prevent exact overlaps, but stay within grid
          if (attempts > 0) {
            x += (Math.random() - 0.5) * 60 * attempts;
            y += (Math.random() - 0.5) * 60 * attempts;
          }
          
          // Always constrain to grid boundaries, accounting for UI element size
          const uiMarginX = playerData.ui.minimized ? 25 : 140; // radius or half width
          const uiMarginY = playerData.ui.minimized ? 25 : 40;  // radius or half height
          x = constrain(x, centerX - gridWidth/2 + uiMarginX, centerX + gridWidth/2 - uiMarginX);
          y = constrain(y, centerY - gridHeight/2 + uiMarginY, centerY + gridHeight/2 - uiMarginY);
          break;
          
        case 'circle-of-fifths':
          // Get key position (0-11)
          const keyPosition = essentiaAnalyzer.keyToCirclePosition(analysis.key);
          const sliceAngle = TWO_PI / 12;
          const baseAngle = (keyPosition * sliceAngle) - PI/2;
          
          // Place UI element within pie slice, not too far out (to avoid obscuring key label)
          const minRadius = maxRadius * 0.2; // Inner boundary
          const maxRadiusForUI = maxRadius * 0.7; // Outer boundary (before key labels)
          const randomRadius = minRadius + Math.random() * (maxRadiusForUI - minRadius);
          
          // Random angle within the slice (with some padding)
          const slicePadding = sliceAngle * 0.1;
          const randomAngle = baseAngle + (Math.random() - 0.5) * (sliceAngle - slicePadding * 2);
          
          x = centerX + cos(randomAngle) * randomRadius;
          y = centerY + sin(randomAngle) * randomRadius;
          
          // Add offset on subsequent attempts
          if (attempts > 0) {
            const offsetRadius = 30 * attempts;
            const offsetAngle = randomAngle + (Math.random() - 0.5) * sliceAngle * 0.5;
            x = centerX + cos(offsetAngle) * constrain(randomRadius + offsetRadius, minRadius, maxRadiusForUI);
            y = centerY + sin(offsetAngle) * constrain(randomRadius + offsetRadius, minRadius, maxRadiusForUI);
          }
          break;
          
        case 'song-structure':
          const structCoords = essentiaAnalyzer.getStructureCoordinates(analysis.structure, availableWidth, availableHeight);
          x = centerX + structCoords.x;
          y = centerY + structCoords.y;
          break;
          
        default:
          x = 50 + (index % 3) * 300;
          y = 100 + Math.floor(index / 3) * 100;
      }
      
      // Constrain UI position based on visualization mode
      // For energy-mood and circle-of-fifths, positions are already constrained above
      // Only apply general canvas constraints for song-structure and default modes
      if (visualMode === 'song-structure' || visualMode === 'default') {
        const marginX = playerData.ui.minimized ? 30 : 20;
        const marginY = playerData.ui.minimized ? 80 : 100;
        const bottomMargin = visualMode === 'song-structure' ? 120 : (playerData.ui.minimized ? 50 : 100);
        x = constrain(x, marginX, width - (playerData.ui.minimized ? 30 : 300));
        y = constrain(y, marginY, height - bottomMargin);
      }
      
      attempts++;
      
    } while (checkOverlap(playerData, x, y) && attempts < maxAttempts);
    
    playerData.ui.x = x;
    playerData.ui.y = y;
    playerData.visualPosition = { x, y };
  });
}

// Check if a player would overlap with any existing players at the given position
function checkOverlap(currentPlayerData, newX, newY) {
  const minDistance = currentPlayerData.ui.minimized ? 60 : 150; // Minimum distance between UI elements
  
  for (let otherPlayerData of audioPlayerUIs) {
    // Skip checking against self
    if (otherPlayerData === currentPlayerData) continue;
    
    // Skip if other player doesn't have a position yet
    if (!otherPlayerData.visualPosition) continue;
    
    const dx = newX - otherPlayerData.visualPosition.x;
    const dy = newY - otherPlayerData.visualPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Adjust minimum distance based on whether players are minimized
    const adjustedMinDistance = (currentPlayerData.ui.minimized && otherPlayerData.ui.minimized) ? 60 : 150;
    
    if (distance < adjustedMinDistance) {
      return true; // Overlap detected
    }
  }
  
  return false; // No overlap
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
  // Calculate available space for the grid
  const availableWidth = width - 40;
  const availableHeight = height - 120;
  const gridWidth = availableWidth * 0.8;
  const gridHeight = availableHeight * 0.8;
  
  stroke(colors.primary);
  strokeWeight(1);
  
  // Draw grid axes
  line(-gridWidth/2, 0, gridWidth/2, 0); // Energy axis (horizontal)
  line(0, -gridHeight/2, 0, gridHeight/2); // Mood axis (vertical)
  
  // Grid lines
  strokeWeight(0.5);
  stroke(colors.textMuted);
  const stepX = gridWidth / 8;
  const stepY = gridHeight / 6;
  for (let i = -gridHeight/2; i <= gridHeight/2; i += stepY) {
    if (Math.abs(i) > 1) {
      line(-gridWidth/2, i, gridWidth/2, i);
    }
  }
  for (let i = -gridWidth/2; i <= gridWidth/2; i += stepX) {
    if (Math.abs(i) > 1) {
      line(i, -gridHeight/2, i, gridHeight/2);
    }
  }
  
  // Labels (positioned outside the grid)
  fill(colors.text);
  textAlign(CENTER);
  textSize(12);
  text('Low Energy', -gridWidth/2 - 60, 0);
  text('High Energy', gridWidth/2 + 60, 0);
  text('Sad', 0, gridHeight/2 + 30);
  text('Happy', 0, -gridHeight/2 - 30);
}

function drawCircleOfFifths() {
  // Calculate available space for the circle
  const availableWidth = width - 40;
  const availableHeight = height - 120;
  const maxRadius = Math.min(availableWidth, availableHeight) / 2 * 0.9;
  
  // Draw pie slices
  const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
  const sliceAngle = TWO_PI / 12;
  
  for(let i = 0; i < keys.length; i++) {
    let angle = (i * sliceAngle) - PI/2;
    
    // Draw slice lines from center to edge
    stroke(colors.textMuted);
    strokeWeight(1);
    let x1 = cos(angle) * maxRadius;
    let y1 = sin(angle) * maxRadius;
    line(0, 0, x1, y1);
  }
  
  // Draw outer circle
  stroke(colors.secondary);
  strokeWeight(2);
  noFill();
  circle(0, 0, maxRadius * 2);
  
  // Draw key positions
  for(let i = 0; i < keys.length; i++) {
    let angle = (i * sliceAngle) - PI/2;
    let x = cos(angle) * maxRadius;
    let y = sin(angle) * maxRadius;
    
    // Key background
    fill(colors.surface);
    stroke(colors.primary);
    strokeWeight(1);
    circle(x, y, Math.max(30, maxRadius * 0.15)); // Scale circle size with radius
    
    fill(colors.text);
    noStroke();
    textAlign(CENTER);
    textSize(Math.max(12, maxRadius * 0.075)); // Scale text size
    text(keys[i], x, y + 5);
  }
}

function drawSongStructure() {
  // Calculate available space for structure categories
  const availableWidth = width - 40;
  const availableHeight = height - 160; // Leave more space at bottom for UI text
  
  // Draw 5 categories side by side
  const categories = ['Hook', 'Verse', 'Pre-Chorus', 'Chorus', 'Outro'];
  const categoryWidth = availableWidth / categories.length;
  const categoryHeight = 60;
  const headerY = -availableHeight/2 + categoryHeight/2; // Top of the visualization area
  
  for(let i = 0; i < categories.length; i++) {
    let x = -availableWidth/2 + i * categoryWidth + categoryWidth/2;
    let y = headerY;
    
    // Draw category header background
    fill(colors.surface);
    stroke(colors.primary);
    strokeWeight(2);
    rect(x - categoryWidth/2 + 10, y - categoryHeight/2, categoryWidth - 20, categoryHeight, 8);
    
    // Draw category label
    fill(colors.text);
    noStroke();
    textAlign(CENTER);
    textSize(16);
    text(categories[i], x, y + 6);
    
    // Draw vertical line to separate columns (centered between containers)
    if (i < categories.length - 1) {
      stroke(colors.primary);
      strokeWeight(1);
      line(x + categoryWidth/2, y - categoryHeight/2, x + categoryWidth/2, availableHeight/2);
    }
  }
}

function drawAudioPlayers() {
  // Draw all audio player UIs
  // Automatically minimize UIs that are not currently playing
  const currentlyPlayingFile = audioManager.currentPlayingAudio;
  
  audioPlayerUIs.forEach(playerData => {
    // Minimize UI if it's not the currently playing audio and not starting playback
    if ((!currentlyPlayingFile || playerData.audioFile !== currentlyPlayingFile) && !playerData.ui.isStartingPlayback) {
      playerData.ui.minimize();
    }
    // The currently playing UI or UI starting playback will be expanded
    
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
