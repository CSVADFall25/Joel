# Prompt Dialogue:

Tooling used: GitHub Copilot Agent Mode

## Prompt #1:

*"Using only basic 2D primitives (ellipse, circle, rect, square, triangle) and style methods (background, fill, stroke, strokeWeight), draw a basic face.* 

*Only use the methods listed under 2D Primitives and Color in the P5.js reference. No loops, conditionals, functions, etc."*

(Copied directly from assignment page)

**Output**:
[Pass1.jpg](./Pass1.jpg)

Model used: Claude Sonnet 4

## Prompt #2:

"Add a feature where the output is saved as `.jpg` of reasonable size when the page is clicked"

**Output**:
```javascript
function mousePressed() {
  saveCanvas('face', 'jpg');
}
```

Model used: Grok Code Fast 1

## Prompt #3:

"Make the face have far more intricate detail, respecting the original rules, and add animation."

**Output**:
[Pass2.jpg](./Pass2.jpg)

Model used: Grok Code Fast 1

## Prompt #4:

"Storyboard and create a short video (30 seconds) of the face meeting a friend at a bus stop, and then the bus arriving, and then them getting on the bus."

**Output**:
[Pass3.jpg](./Pass3.jpg)

Model used: Claude Sonnet 4.5