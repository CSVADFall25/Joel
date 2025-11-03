---
mode: agent
model: Claude Sonnet 4 (copilot)
---

# EssentiaTest: A Data Visualization Demonstration 

## Primary Goal:

Create an app in `assignments/assignment4` that demonstrates pulling a dataset from Hugging Face and analyzing it with `essentia.js` inside a `p5.js` project

## Starter Code

`assignments/assignment4` currently contains a bare-bones p5js project. This code should be modified to make the canvas fullscreen, and respond nicely to screen re-sizing.

## The Data

I've uploaded a collection of audio files (recordings of solo guitar and bass guitar) to https://huggingface.co/datasets/joeljaffesd/jamlog.

## Data Visualization 

The goal of this tool is to analyze the dataset to provide compelling sorting and visualization to the user.

`essentia.js` is a library for music information retrieval (MIR) both imperative and neural methods. This library should be used to analyze the data. Both imperative methods and neural methods (using pre-trained models that ship with essentia) should be demonstrated.

## UI

Each audio file should be presented as an object with playback control, showing a scrubbable length with timestamps, play/pause button, and restart button. 

Only one audio clip should be playable at a time: there needs to be a state manager that guarantees this. When a new clip is played, any other playing clips need to be paused. 

The user should be presented with multiple modes of engaging with the dataset, with a dropdown for changing the mode.

All modes will display all audio clips at once on the screen, changing their positions relative to the sorting algorithm.

One mode should sort the data on a cartesian grid, tracking energy level (low-high) against some sort of affect/mood parameter, such as happy/sad.

Another mode should should display the circle of fifths, placing each audio clip based on its key as reported by essentia.

A third mode should sort clips into 5 categories: hook, verse, pre-chorus, chorus, outro

## Design

The overall design of the app should be modern and sleek, and use the color palette from https://jaffx.audio.


