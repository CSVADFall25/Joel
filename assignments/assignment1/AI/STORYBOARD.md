# Bus Stop Animation Storyboard

## 30-Second Animation Timeline (1800 frames @ 60fps)

### Scene 1: Character 1 Arrives (0:00 - 0:07.5 / Frames 0-450)
**Action:** Character with brown hair and blue shirt walks from left side of screen to bus stop
- Starts off-screen at x = -100
- Walks smoothly to bus stop at x = 280
- Legs alternate in walking motion (using sin wave)
- Arrives at bus stop, stands waiting

**Visual Elements:**
- Blue sky with sun
- Gray sidewalk and road
- Yellow bus stop sign

### Scene 2: Character 2 Arrives & Greeting (0:07.5 - 0:15 / Frames 450-900)
**Action:** Second character (blonde hair, purple shirt) arrives and they greet each other
- Character 2 walks from left (x = -200 to x = 130)
- Both characters wave at each other (arms moving up and down)
- Both characters show happy expressions (smiling)
- They stand together at the bus stop

**Animations:**
- Continuous arm waving using sine waves
- Legs walking animation for Character 2
- Both faces have rosy cheeks (excited to see friend)

### Scene 3: Bus Arrives (0:15 - 0:22.5 / Frames 900-1350)
**Action:** Yellow bus drives in from the right side of the screen
- Bus starts off-screen at x = 1000
- Drives left to bus stop at x = 450
- Bus slows down and stops at the bus stop
- Wheels appear to rotate (visual detail)
- Characters watch bus arrive, continue waving slightly

**Bus Details:**
- Yellow body with orange stripe
- Three passenger windows + driver window
- Two large wheels with gray hubs
- Door on the side
- Headlights at front
- Bus number "11" displayed

### Scene 4: Boarding the Bus (0:22.5 - 0:30 / Frames 1350-1800)
**Action:** Both characters walk toward and board the bus
- Character 1 walks from x = 280 to x = 550 (bus door)
- Character 2 walks from x = 130 to x = 520 (bus door)
- Walking animation continues (legs alternate)
- Characters gradually move toward bus door
- Arms return to walking position
- They disappear into the bus (reaching the door area)

**Final Frame:**
- Bus with both characters inside
- Scene holds for final moments
- Ready to loop back to beginning

## Technical Details

**Canvas Size:** 800x600 pixels

**Frame Rate:** 60 FPS

**Total Duration:** 30 seconds (1800 frames)

**Animation Techniques Used (P5.js primitives only):**
- `sin()` and `cos()` for smooth cyclical motion
- `frameCount` for time-based animation
- Mathematical expressions for position interpolation
- No conditionals, loops, or custom functions beyond setup/draw

**Characters:**
- Character 1: Blue shirt, brown hair, skin tone #FFDCB1
- Character 2: Purple shirt, blonde hair, skin tone #FFD2AA

**Scene Elements:**
- Sky: Light blue (#87CEFA)
- Sun: Yellow (#FFFF96)
- Road: Dark gray (#5A5A5A)
- Sidewalk: Medium gray (#969696)
- Bus: Yellow (#FFC800) with orange stripe (#DC6400)
- Bus windows: Light blue (#96C8FF)

## Animation Mathematics

All position changes use continuous mathematical functions to avoid conditionals:

- **Walking motion:** `y_offset = sin(frameCount * speed) * amplitude`
- **Arm waving:** `arm_y = base_y + sin(frameCount * 0.15) * 8`
- **Position interpolation:** Linear interpolation over frame ranges
- **Continuous looping:** Can use `frameCount % 1800` to loop every 30 seconds

This creates smooth, organic motion using only basic 2D primitives (circle, ellipse, rect) and style methods (fill, stroke, strokeWeight) as required.
