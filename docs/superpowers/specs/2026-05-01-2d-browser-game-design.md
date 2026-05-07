---
name: 2D Browser Game Design
description: Multi-bird hard-mode dodging game with splash damage mechanics
type: game
date: 2026-05-01
---

# 2D Browser Game Design Specification

## Game Overview
A fast-paced 2D browser game where the player controls a land animal dodging falling objects dropped by multiple birds. Features hard-mode difficulty from the start, progressive scaling, and splash damage mechanics.

## Core Mechanics

### Gameplay Loop
- 60fps game loop using `requestAnimationFrame`
- Continuous drop spawning from multiple birds
- Player movement: left/right to avoid falling objects
- Real-time collision detection and damage calculation

### Scoring System
- +1 point per drop that hits ground without hitting player
- Win condition: 10,000 points
- Score displayed in top-left corner

### Health System
- Player starts with 3 splash health points
- Direct hit by falling object = instant game over
- Inside splash zone on ground impact = -1 health point
- 0 health points = game over
- Health displayed as hearts/points in top-right

## Difficulty Progression (Hard Mode)

### Initial State
- 1 bird, high drop frequency, fast fall speed
- Drops spawn continuously - no waiting for ground impact

### Progressive Scaling
- **Early game (0-2,000 drops):** Increase difficulty every 100 drops
- **Mid game (2,000-5,000 drops):** Increase difficulty every 200 drops  
- **Late game (5,000+ drops):** Increase difficulty every 500 drops

### Bird Progression
- Start: 1 bird
- 2,000 drops: Add 2nd bird
- 4,000 drops: Add 3rd bird
- 6,000 drops: Add 4th bird
- 8,000 drops: Add 5th bird

Each bird drops independently in rapid succession.

## Visual Design

### Color Palette (Minimalist/Clean)
- Background: Dark gray (#1a1a2e)
- Player: Bright cyan (#00d4ff) - rectangle
- Birds: Orange (#ff6b35) - rectangles
- Drops: Brown (#8b4513) - circles
- Splash zones: Red (#ff4757) with transparency
- UI text: White (#ffffff)
- Health hearts: Red (#ff4757)

### Visual Elements
- **Player:** 40x60px rectangle, smooth movement
- **Birds:** 50x30px rectangles, horizontal movement
- **Drops:** Circles with varying sizes:
  - Small: 15px radius
  - Medium: 25px radius  
  - Large: 35px radius
- **Splash zones:** Expanding circles that fade out over 1-2 seconds
- **Screen shake:** Subtle camera shake on bomb drops

### Responsive Design
- Canvas fills entire browser window
- Elements scale proportionally to screen size
- Touch controls: Left half = move left, right half = move right
- UI elements positioned relative to screen edges

## Technical Architecture

### File Structure
```
index.html
styles/
  main.css
js/
  game.js
  player.js
  bird.js
  drops.js
  splashes.js
  collision.js
  difficulty.js
  ui.js
  input.js
```

### Core Components

#### Game Engine (game.js)
- Main game loop, state management, coordination
- State machine: menu, playing, gameover, win
- Delta time calculation for frame-rate independence

#### Player (player.js)
- Position, velocity, movement logic
- Input response (keyboard + touch)
- Collision box management

#### Bird (bird.js)
- Horizontal movement, direction changes
- Drop spawning logic and timing
- Movement pattern with randomness

#### Drop System (drops.js)
- Falling objects with size variations
- Physics (gravity, velocity)
- Type classification (normal/bomb)

#### Splash System (splashes.js)
- Impact zones, damage areas
- Persistence and lifetime management
- Visual effects (expansion, fade)

#### Collision Manager (collision.js)
- Rectangle-circle collision detection
- Distance-based splash radius checks
- Damage calculation

#### Difficulty Manager (difficulty.js)
- Progressive scaling thresholds
- Parameter adjustment over time
- Bird spawning logic

#### UI Manager (ui.js)
- Score and health display
- Game over/win screens
- Restart functionality

#### Input Handler (input.js)
- Keyboard event processing
- Touch event handling
- Input state management

### Performance Considerations
- Object pooling for drops and splashes
- Efficient collision detection
- Delta time for consistent movement
- Canvas optimization (batch rendering)

### Input Controls
- **Keyboard:** Arrow keys or A/D for movement
- **Touch:** Left/right screen halves for mobile
- **Restart:** R key or tap on game over screen

## Game States

### Menu
- Title screen with instructions
- Start button

### Playing
- Active gameplay
- Real-time score and health updates

### Game Over
- "Game Over" message
- Final score display
- Restart option

### Win
- "You Win" message
- Final score display
- Restart option

## Implementation Notes

### Responsive Canvas
- Resize event listener for canvas dimensions
- Relative positioning using screen percentages
- Touch event handling for mobile controls

### Animations
- Smooth player movement with acceleration/deceleration
- Bird direction changes with slight pause
- Drop falling with gravity
- Splash zone expansion and fade
- Screen shake effect

### Asset Placeholder Strategy
- Simple geometric shapes for all game elements
- Easy replacement with real assets later
- Consistent sizing and positioning for asset swapping