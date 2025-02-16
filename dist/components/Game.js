var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import HebrewLetterDisplay from './HebrewLetterDisplay.js';
import { AssessmentController } from '../controllers/AssessmentController.js';
import { Statistics } from '../models/Statistics.js';
export class Game {
    constructor() {
        this.streak = 0;
        this.STREAK_THRESHOLD = 3;
        this.STREAK_LEVELS = [3, 6, 9];
        console.log('Game initialized');
        this.statistics = new Statistics();
        this.letterDisplay = new HebrewLetterDisplay(this.statistics);
        this.assessmentController = new AssessmentController();
        this.lettersShown = 0;
        this.initializeSounds();
        this.initializeHandlers();
        this.streak = 0;
        this.initializeSounds();
        this.initializeHandlers();
    }
    initializeSounds() {
        this.successSound = document.getElementById('successSound');
        this.errorSound = document.getElementById('errorSound');
        this.streakSound = document.getElementById('streakSound');
    }
    // Add this method to the Game class
    updateStatisticsDisplay() {
        const statsContainer = document.getElementById('nikud-stats');
        if (!statsContainer)
            return;
        // Clear existing stats
        statsContainer.innerHTML = '';
        // Get nikud list from HebrewLetterDisplay
        const nikudList = this.letterDisplay.getNikudList();
        const performance = this.statistics.calculateOverallPerformance();
        nikudList.forEach(({ nikud, name }) => {
            const stats = this.statistics.getStatistics(nikud);
            if (!stats)
                return;
            const statItem = document.createElement('div');
            statItem.className = 'nikud-stat-item';
            const successRate = stats.total > 0
                ? Math.round((stats.correct / stats.total) * 100)
                : 0;
            statItem.innerHTML = `
            <div class="nikud-symbol">${nikud}</div>
            <div class="nikud-name">${name}</div>
            <div class="nikud-progress">
                <div class="nikud-progress-bar" style="width: ${successRate}%"></div>
            </div>
            <div class="nikud-stats">
                <span class="success-rate">${successRate}%</span> 
                (${stats.correct}/${stats.total})
            </div>
        `;
            statsContainer.appendChild(statItem);
        });
    }
    playSound(isCorrect) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sound;
                if (!isCorrect) {
                    sound = this.errorSound;
                }
                else {
                    // For correct answers, choose between streak and success sounds
                    if (this.STREAK_LEVELS.includes(this.streak)) {
                        // Play streak sound only on milestone numbers (3,6,9)
                        sound = this.streakSound;
                        if (sound) {
                            sound.playbackRate = 1 + (this.streak / 10);
                        }
                    }
                    else {
                        // Play regular success sound for non-milestone numbers
                        sound = this.successSound;
                    }
                }
                if (!sound) {
                    console.error('Sound element not found');
                    return;
                }
                console.log('Playing sound:', isCorrect ?
                    (this.STREAK_LEVELS.includes(this.streak) ? 'streak' : 'success')
                    : 'error');
                sound.currentTime = 0;
                sound.volume = 0.5;
                yield sound.play();
            }
            catch (error) {
                console.error('Error playing sound:', error);
            }
        });
    }
    showLearningFeedback(nikud) {
        const stats = this.statistics.getStatistics(nikud);
        if (stats) {
            const accuracy = (stats.correct / stats.total * 100).toFixed(0);
            const milestone = document.getElementById('streak-milestone');
            if (milestone) {
                milestone.textContent = `Keep practicing ${nikud} - ${accuracy}% mastery`;
                milestone.classList.remove('milestone-show');
                void milestone.offsetWidth;
                milestone.classList.add('milestone-show');
            }
        }
    }
    handleAssessment(isCorrect) {
        console.log('Assessment:', isCorrect);
        const currentLetter = this.letterDisplay.getCurrentLetter();
        // Update statistics and counter
        this.statistics.updateStatistics(currentLetter.nikud, isCorrect);
        this.lettersShown++;
        this.updateCounter();
        this.updateStatisticsDisplay(); // Add this line
        // Handle streak and feedback
        if (isCorrect) {
            this.streak++;
            if (this.streak >= this.STREAK_THRESHOLD) {
                this.addStreakAnimation();
            }
        }
        else {
            this.streak = 0;
            this.showLearningFeedback(currentLetter.nikud);
        }
        // Update UI
        console.log('Streak:', this.streak);
        this.updateStreakDisplay();
        // Play sound effects
        this.playSound(isCorrect);
        // Show next letter
        this.showNextLetter();
    }
    addStreakAnimation() {
        const displayArea = document.getElementById('display-area');
        const milestone = document.getElementById('streak-milestone');
        if (!displayArea || !milestone)
            return;
        // Remove any existing streak animations
        displayArea.classList.remove('streak-animation-3', 'streak-animation-6', 'streak-animation-9');
        // Determine streak level
        let streakLevel = 0;
        for (let level of this.STREAK_LEVELS) {
            if (this.streak >= level)
                streakLevel = level;
        }
        if (streakLevel > 0) {
            // Add appropriate animation class
            displayArea.classList.add(`streak-animation-${streakLevel}`);
            // Show milestone message if exact streak level reached
            if (this.STREAK_LEVELS.includes(this.streak)) {
                this.showMilestoneMessage(streakLevel);
            }
            // Removed sound playing from here since it's handled in playSound method
        }
    }
    showMilestoneMessage(level) {
        const milestone = document.getElementById('streak-milestone');
        if (!milestone)
            return;
        const messages = {
            3: '🌟 Great Streak! 🌟',
            6: '🔥 Amazing! 🔥',
            9: '⭐ Incredible! ⭐'
        };
        milestone.textContent = messages[level];
        milestone.classList.remove('milestone-show');
        void milestone.offsetWidth; // Force reflow
        milestone.classList.add('milestone-show');
    }
    updateStreakDisplay() {
        const streakElement = document.getElementById('streak');
        if (streakElement) {
            streakElement.textContent = `${this.streak}`;
            // Update streak display style based on level
            let streakLevel = 0;
            for (let level of this.STREAK_LEVELS) {
                if (this.streak >= level)
                    streakLevel = level;
            }
            streakElement.className = streakLevel > 0 ? 'streak-highlight' : '';
            if (streakLevel > 0) {
                streakElement.style.color = this.getStreakColor(streakLevel);
                streakElement.style.fontSize = `${24 + (streakLevel * 2)}px`;
            }
            else {
                streakElement.style.color = '';
                streakElement.style.fontSize = '';
            }
        }
    }
    getStreakColor(level) {
        const colors = {
            3: '#ff4081',
            6: '#FFA500',
            9: '#4CAF50'
        };
        return colors[level];
    }
    initializeHandlers() {
        console.log('Initializing handlers');
        window.gameHandlers = {
            handleCorrect: () => {
                console.log('Correct clicked');
                this.handleAssessment(true);
            },
            handleIncorrect: () => {
                console.log('Incorrect clicked');
                this.handleAssessment(false);
            }
        };
    }
    updateCounter() {
        const counterElement = document.getElementById('counter');
        if (counterElement) {
            counterElement.textContent = this.lettersShown.toString();
        }
    }
    startGame() {
        console.log('Game started');
        this.lettersShown = 0;
        this.updateCounter();
        this.letterDisplay.updateDisplayedLetter();
    }
    showNextLetter() {
        this.letterDisplay.updateDisplayedLetter();
    }
}
