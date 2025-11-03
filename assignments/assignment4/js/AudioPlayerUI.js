// AudioPlayerUI.js - UI components for audio playback controls

class AudioPlayerUI {
  constructor(audioManager, x, y, width, height) {
    this.audioManager = audioManager;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isHovered = false;
  }

  // Draw the audio player UI
  draw(audioFile) {
    push();
    translate(this.x, this.y);
    
    // Background
    fill(this.isHovered ? colors.surface : color(26, 26, 26));
    stroke(audioFile.isPlaying ? colors.accent : colors.primary);
    strokeWeight(audioFile.isPlaying ? 2 : 1);
    rect(0, 0, this.width, this.height, 8);
    
    // Track name
    fill(colors.text);
    textAlign(LEFT);
    textSize(12);
    text(audioFile.name, 10, 20);
    
    // Time display
    const currentTimeStr = this.audioManager.formatTime(audioFile.currentTime);
    const durationStr = this.audioManager.formatTime(audioFile.duration);
    textAlign(RIGHT);
    text(`${currentTimeStr} / ${durationStr}`, this.width - 10, 20);
    
    // Progress bar
    const progressBarY = 30;
    const progressBarHeight = 4;
    const progressBarWidth = this.width - 20;
    
    // Background track
    fill(colors.background);
    noStroke();
    rect(10, progressBarY, progressBarWidth, progressBarHeight, 2);
    
    // Progress
    const progress = audioFile.duration > 0 ? audioFile.currentTime / audioFile.duration : 0;
    fill(audioFile.isPlaying ? colors.accent : colors.primary);
    rect(10, progressBarY, progressBarWidth * progress, progressBarHeight, 2);
    
    // Control buttons
    this.drawControlButtons(audioFile);
    
    pop();
  }

  drawControlButtons(audioFile) {
    const buttonY = 45;
    const buttonSize = 20;
    const buttonSpacing = 30;
    
    // Play/Pause button
    const playButtonX = 10;
    fill(audioFile.isPlaying ? colors.accent : colors.primary);
    noStroke();
    
    if (audioFile.isPlaying) {
      // Pause icon
      rect(playButtonX + 6, buttonY + 5, 3, 10);
      rect(playButtonX + 11, buttonY + 5, 3, 10);
    } else {
      // Play icon
      triangle(playButtonX + 6, buttonY + 5, 
               playButtonX + 6, buttonY + 15, 
               playButtonX + 14, buttonY + 10);
    }
    
    // Restart button
    const restartButtonX = playButtonX + buttonSpacing;
    fill(colors.secondary);
    rect(restartButtonX + 2, buttonY + 8, 16, 4);
    triangle(restartButtonX, buttonY + 10, 
             restartButtonX + 6, buttonY + 6, 
             restartButtonX + 6, buttonY + 14);
  }

  // Check if mouse is over this UI element
  checkHover(mouseX, mouseY) {
    this.isHovered = mouseX >= this.x && mouseX <= this.x + this.width &&
                     mouseY >= this.y && mouseY <= this.y + this.height;
    return this.isHovered;
  }

  // Handle mouse clicks
  handleClick(mouseX, mouseY, audioFile) {
    if (!this.checkHover(mouseX, mouseY)) return false;
    
    const localX = mouseX - this.x;
    const localY = mouseY - this.y;
    
    // Check progress bar click (scrubbing)
    if (localY >= 30 && localY <= 34 && localX >= 10 && localX <= this.width - 10) {
      const progress = (localX - 10) / (this.width - 20);
      const seekTime = progress * audioFile.duration;
      this.audioManager.seekTo(audioFile, seekTime);
      return true;
    }
    
    // Check play/pause button
    if (localY >= 45 && localY <= 65 && localX >= 10 && localX <= 30) {
      if (audioFile.isPlaying) {
        this.audioManager.pauseAudio(audioFile);
      } else {
        this.audioManager.playAudio(audioFile);
      }
      return true;
    }
    
    // Check restart button
    if (localY >= 45 && localY <= 65 && localX >= 40 && localX <= 60) {
      this.audioManager.seekTo(audioFile, 0);
      if (!audioFile.isPlaying) {
        this.audioManager.playAudio(audioFile);
      }
      return true;
    }
    
    return false;
  }
}