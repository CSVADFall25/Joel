// AudioManager.js - Handles audio playback and state management

class AudioManager {
  constructor() {
    this.audioFiles = [];
    this.currentPlayingAudio = null;
    this.loadedAudioObjects = new Map();
  }

  // Load audio files from Hugging Face dataset
  async loadAudioDataset() {
    try {
      console.log('Loading audio dataset from Hugging Face...');
      
      // Hugging Face dataset API endpoint
      const datasetUrl = 'https://huggingface.co/api/datasets/joeljaffesd/jamlog/tree/main';
      
      const response = await fetch(datasetUrl);
      const data = await response.json();
      
      // Filter for audio files
      const audioFiles = data.filter(file => 
        file.type === 'file' && 
        (file.path.endsWith('.mp3') || file.path.endsWith('.wav') || file.path.endsWith('.ogg'))
      );
      
      console.log(`Found ${audioFiles.length} audio files`);
      
      // Create audio file objects with metadata
      this.audioFiles = audioFiles.map((file, index) => ({
        id: index,
        name: file.path.split('/').pop(),
        url: `https://huggingface.co/datasets/joeljaffesd/jamlog/resolve/main/${file.path}`,
        path: file.path,
        duration: 0,
        analysis: null,
        audioElement: null,
        isLoaded: false,
        isPlaying: false,
        currentTime: 0
      }));
      
      return this.audioFiles;
      
    } catch (error) {
      console.error('Error loading audio dataset:', error);
      
      // Fallback: create dummy data for testing
      this.audioFiles = this.createDummyAudioData();
      return this.audioFiles;
    }
  }

  createDummyAudioData() {
    // Create dummy audio data for testing when dataset isn't available
    return [
      {
        id: 0,
        name: 'guitar_sample_1.mp3',
        url: null, // Will be handled differently for dummy data
        duration: 120,
        analysis: {
          energy: 0.7,
          mood: 0.6,
          key: 'C',
          tempo: 120,
          structure: 'verse'
        },
        isLoaded: true,
        isPlaying: false,
        currentTime: 0
      },
      {
        id: 1,
        name: 'bass_sample_1.mp3',
        url: null,
        duration: 95,
        analysis: {
          energy: 0.8,
          mood: 0.3,
          key: 'G',
          tempo: 140,
          structure: 'chorus'
        },
        isLoaded: true,
        isPlaying: false,
        currentTime: 0
      },
      {
        id: 2,
        name: 'guitar_sample_2.mp3',
        url: null,
        duration: 180,
        analysis: {
          energy: 0.4,
          mood: 0.8,
          key: 'F',
          tempo: 90,
          structure: 'hook'
        },
        isLoaded: true,
        isPlaying: false,
        currentTime: 0
      },
      {
        id: 3,
        name: 'bass_sample_2.mp3',
        url: null,
        duration: 156,
        analysis: {
          energy: 0.6,
          mood: 0.5,
          key: 'D',
          tempo: 110,
          structure: 'pre-chorus'
        },
        isLoaded: true,
        isPlaying: false,
        currentTime: 0
      },
      {
        id: 4,
        name: 'guitar_sample_3.mp3',
        url: null,
        duration: 203,
        analysis: {
          energy: 0.2,
          mood: 0.7,
          key: 'A',
          tempo: 75,
          structure: 'outro'
        },
        isLoaded: true,
        isPlaying: false,
        currentTime: 0
      }
    ];
  }

  // Load and analyze audio file
  async loadAudio(audioFile) {
    if (audioFile.isLoaded) return audioFile;

    try {
      if (audioFile.url) {
        // Load real audio file
        const audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audio.src = audioFile.url;
        
        return new Promise((resolve, reject) => {
          audio.addEventListener('loadedmetadata', () => {
            audioFile.duration = audio.duration;
            audioFile.audioElement = audio;
            audioFile.isLoaded = true;
            this.loadedAudioObjects.set(audioFile.id, audio);
            resolve(audioFile);
          });
          
          audio.addEventListener('error', (e) => {
            console.error('Error loading audio:', e);
            reject(e);
          });
          
          audio.load();
        });
      } else {
        // Dummy data is already "loaded"
        audioFile.isLoaded = true;
        return audioFile;
      }
      
    } catch (error) {
      console.error('Error loading audio file:', error);
      return audioFile;
    }
  }

  // Play audio file
  async playAudio(audioFile) {
    // Stop any currently playing audio
    this.stopAll();
    
    if (!audioFile.isLoaded) {
      await this.loadAudio(audioFile);
    }
    
    if (audioFile.audioElement) {
      audioFile.audioElement.play();
      audioFile.isPlaying = true;
      this.currentPlayingAudio = audioFile;
      
      // Set up event listeners
      audioFile.audioElement.addEventListener('timeupdate', () => {
        audioFile.currentTime = audioFile.audioElement.currentTime;
      });
      
      audioFile.audioElement.addEventListener('ended', () => {
        audioFile.isPlaying = false;
        this.currentPlayingAudio = null;
      });
    } else {
      // For dummy data, simulate playback
      audioFile.isPlaying = true;
      this.currentPlayingAudio = audioFile;
      console.log(`Playing dummy audio: ${audioFile.name}`);
    }
  }

  // Pause audio
  pauseAudio(audioFile) {
    if (audioFile.audioElement) {
      audioFile.audioElement.pause();
    }
    audioFile.isPlaying = false;
    if (this.currentPlayingAudio === audioFile) {
      this.currentPlayingAudio = null;
    }
  }

  // Stop all audio
  stopAll() {
    this.audioFiles.forEach(audioFile => {
      if (audioFile.isPlaying) {
        this.pauseAudio(audioFile);
      }
      if (audioFile.audioElement) {
        audioFile.audioElement.currentTime = 0;
        audioFile.currentTime = 0;
      }
    });
    this.currentPlayingAudio = null;
  }

  // Seek to specific time
  seekTo(audioFile, time) {
    if (audioFile.audioElement) {
      audioFile.audioElement.currentTime = time;
      audioFile.currentTime = time;
    }
  }

  // Get formatted time string
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}