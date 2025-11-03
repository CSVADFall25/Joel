---
mode: agent
model: Claude Sonnet 4.5 (copilot)
---

# Asynch Essentia

Your task is to take the existing project in `assignments/assignment4`, and augment the `essentia.js` functionality to enable asynchronous analysis.

The current project fetches audio files at init time- essentia analysis takes time, so the page takes forever to load.

Instead, the page should load after the first audio file has been processed, and then the additional files should be added to the grid as they finish processing. 

The processing of the audio files by essential should not slow down the UI.