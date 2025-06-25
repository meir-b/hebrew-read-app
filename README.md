# Hebrew Reading App

## Overview
The Hebrew Reading App is designed to help children learn to read Hebrew letters with Nikud through a structured level-based progression system. The application displays Hebrew letters and syllables appropriate to the current level, allowing parents to assess their child's pronunciation and track their proficiency. The app incorporates game-like features and achievements to enhance engagement and motivation.

## Features
- **Level-Based Learning**: Progressive levels focusing on different aspects of Hebrew reading
- **Random Hebrew Letter/Syllable Display**: Shows appropriate content based on the current level
- **Pronunciation Assessment**: Allows parents to assess their child's pronunciation and provide feedback
- **Statistics Tracking**: Monitors the child's proficiency with different Nikud and tracks progress over time
- **Level Selection**: Choose from unlocked levels or continue with the current progression
- **Engaging Gameplay**: Incorporates game-like elements to make learning fun and interactive

## Levels

The game consists of multiple levels, each focusing on different aspects of Hebrew reading:

### Level 1: Reading with Letters א - ב and Dagesh
- Distinguishing between vowels (Nikud) using letters א-ב
- Building a silent vowel with "אב"
- Starting to combine open and silent vowels
- Distinguishing Nikud with letters א-ב
- Combining open and silent vowels with letters א-ב

### Level 2: Reading All Letters with Open Vowels
- Building syllables from two open vowels
- Forming words from two open vowels
- Combining three open vowels

### Current Level Focus
- Building syllables composed of two open vowels:
  - Two open vowels with Kamatz
  - Two open vowels with Kamatz and Patach
  - Two open vowels with Patach and Tzireh
  - Two open vowels with Kamatz and Segol
  - Two open vowels with Patach and Cholem
  - Two open vowels with Patach and Chirik
  - Two open vowels with Segol and Chirik
  - Two open vowels with Patach and Kubutz
  - Two open vowels with Cholem and Kubutz
  - Two open vowels with Patach and Shuruk
- Review of open vowels from "א" to "ת" with various combinations

## Project Structure
```
hebrew-reading-app
├── src
│   ├── index.ts
│   ├── components
│   │   ├── HebrewLetterDisplay.ts
│   │   └── Game.ts
│   ├── controllers
│   │   └── AssessmentController.ts
│   ├── models
│   │   ├── Statistics.ts
│   │   └── LevelManager.ts
│   ├── utils
│   │   └── letterUtils.ts
│   └── types
│       └── index.ts
├── public
│   └── sounds
│       ├── success.mp3
│       ├── error.mp3
│       ├── streak.mp3
│       └── achievement.mp3
├── package.json
├── tsconfig.json
├── index.html
└── README.md
```

## Level System

### Level Management
The app includes a comprehensive level management system that:
- Tracks progress through structured learning levels
- Unlocks new levels as previous ones are completed
- Provides appropriate content for each skill level
- Saves progress locally using browser storage

### Level Selection
Players can:
- View all available levels in a visual grid
- See completion progress for each level
- Switch between unlocked levels
- View level descriptions and requirements

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd hebrew-reading-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
To start the application, run:
```
npm start
```
This will initialize the app and open it in your default web browser.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
 


How to run:

```
   cd <Code Location>
   npm run build  
   npx live-server

```
=======
