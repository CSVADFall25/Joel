// EssentiaAnalyzer.js - Handles music analysis using Essentia.js

class EssentiaAnalyzer {
  constructor() {
    this.isInitialized = false;
    this.essentia = null;
  }

  async initialize() {
    try {
      if (typeof Essentia !== 'undefined') {
        this.essentia = new Essentia();
        this.isInitialized = true;
        console.log('Essentia.js initialized successfully');
      } else {
        console.warn('Essentia.js not available, using mock analysis');
        this.isInitialized = false;
      }
    } catch (error) {
      console.error('Error initializing Essentia.js:', error);
      this.isInitialized = false;
    }
  }

  // Analyze audio file for energy, mood, key, etc.
  async analyzeAudio(audioBuffer) {
    if (!this.isInitialized) {
      return this.generateMockAnalysis();
    }

    try {
      const analysis = {};
      
      // Convert audio buffer to format expected by Essentia
      const audioVector = this.essentia.arrayToVector(audioBuffer);
      
      // Energy analysis
      const rms = this.essentia.RMS(audioVector);
      analysis.energy = Math.min(rms.rms * 10, 1.0); // Normalize to 0-1
      
      // Spectral analysis for mood estimation
      const spectrum = this.essentia.Spectrum(audioVector);
      const spectralCentroid = this.essentia.SpectralCentroid(spectrum.spectrum);
      analysis.mood = Math.min(spectralCentroid.spectralCentroid / 5000, 1.0); // Rough mood estimation
      
      // Key detection
      const keyExtractor = this.essentia.KeyExtractor();
      const keyResult = keyExtractor(audioVector);
      analysis.key = keyResult.key;
      analysis.scale = keyResult.scale;
      
      // Tempo estimation
      const beatTracker = this.essentia.BeatTrackerMultiFeature();
      const beatResult = beatTracker(audioVector);
      analysis.tempo = beatResult.bpm;
      
      // Onset detection for structure analysis
      const onsetDetector = this.essentia.OnsetDetection();
      const onsets = onsetDetector(spectrum.spectrum);
      analysis.onsetRate = onsets.onsetDetection;
      
      // Estimate song structure based on onset rate and energy
      analysis.structure = this.estimateStructure(analysis);
      
      return analysis;
      
    } catch (error) {
      console.error('Error analyzing audio with Essentia:', error);
      return this.generateMockAnalysis();
    }
  }

  // Generate mock analysis when Essentia is not available
  generateMockAnalysis() {
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const structures = ['hook', 'verse', 'pre-chorus', 'chorus', 'outro'];
    
    return {
      energy: Math.random(),
      mood: Math.random(),
      key: keys[Math.floor(Math.random() * keys.length)],
      scale: Math.random() > 0.5 ? 'major' : 'minor',
      tempo: 60 + Math.random() * 120, // 60-180 BPM
      onsetRate: Math.random(),
      structure: structures[Math.floor(Math.random() * structures.length)]
    };
  }

  // Estimate song structure based on analysis features
  estimateStructure(analysis) {
    const energy = analysis.energy;
    const onsetRate = analysis.onsetRate || 0.5;
    
    // Simple heuristic for structure classification
    if (energy > 0.8 && onsetRate > 0.7) {
      return 'chorus';
    } else if (energy > 0.6 && onsetRate > 0.5) {
      return 'pre-chorus';
    } else if (energy < 0.3) {
      return 'outro';
    } else if (onsetRate > 0.6) {
      return 'hook';
    } else {
      return 'verse';
    }
  }

  // Convert key to circle of fifths position
  keyToCirclePosition(key) {
    const keyPositions = {
      'C': 0, 'G': 1, 'D': 2, 'A': 3, 'E': 4, 'B': 5,
      'F#': 6, 'C#': 7, 'G#': 8, 'D#': 9, 'A#': 10, 'F': 11
    };
    
    return keyPositions[key] || 0;
  }

  // Get coordinates for circle of fifths visualization
  getCircleOfFifthsCoordinates(key, radius = 150) {
    const position = this.keyToCirclePosition(key);
    const angle = (position * TWO_PI / 12) - PI/2;
    
    return {
      x: cos(angle) * radius,
      y: sin(angle) * radius,
      angle: angle,
      position: position
    };
  }

  // Get category coordinates for song structure visualization
  getStructureCoordinates(structure) {
    const categories = ['hook', 'verse', 'pre-chorus', 'chorus', 'outro'];
    const categoryIndex = categories.indexOf(structure);
    
    if (categoryIndex === -1) return { x: 0, y: 0 };
    
    const categoryWidth = 300;
    const categoryHeight = 60;
    const spacing = 20;
    
    return {
      x: -categoryWidth/2 + Math.random() * categoryWidth,
      y: (categoryIndex - 2) * (categoryHeight + spacing) + (Math.random() - 0.5) * categoryHeight * 0.8,
      category: structure,
      categoryIndex: categoryIndex
    };
  }
}