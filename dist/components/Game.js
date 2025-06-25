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
import { LevelManager } from '../models/LevelManager.js';
import { updateNikudSettings } from '../utils/letterUtils.js';
export class Game {
    constructor() {
        this.streak = 0;
        this.STREAK_THRESHOLD = 3;
        this.STREAK_LEVELS = [3, 6, 9];
        this.ACHIEVEMENTS = {
            QUICK_LEARNER: { id: 'quick-learner', title: '⚡ Quick Learner', description: '5 correct answers in a row!' },
            SUPER_READER: { id: 'super-reader', title: '📚 Super Reader', description: '10 correct answers in a row!' },
            MASTER_READER: { id: 'master-reader', title: '👑 Master Reader', description: '20 correct answers in a row!' },
            NIKUD_EXPERT: { id: 'nikud-expert', title: '✨ Nikud Expert', description: 'Mastered a Nikud type!' },
            PERSISTENT: { id: 'persistent', title: '🎯 Practice Star', description: '50 letters practiced!' },
            DEDICATED: { id: 'dedicated', title: '🌟 Super Star', description: '100 letters practiced!' },
            SPEED_DEMON: { id: 'speed-demon', title: '🚀 Speed Champion', description: '5 correct answers in 10 seconds!' },
            PERFECT_STREAK: { id: 'perfect-streak', title: '💫 Perfect Streak', description: 'No mistakes in 15 answers!' },
            COMEBACK_KID: { id: 'comeback-kid', title: '🌈 Comeback Kid', description: '5 correct after a mistake!' },
            NIKUD_MASTER: { id: 'nikud-master', title: '🏆 Nikud Master', description: 'Mastered all Nikud types!' }
        };
        this.soundsEnabled = true;
        this.soundVolume = 1.0; // Max volume by default
        this.soundFiles = {
            success: [
                new Audio('./public/sounds/success.mp3'),
            ],
            streak: [
                new Audio('./public/sounds/streak.mp3'),
                new Audio('./public/sounds/streak2.mp3'),
                new Audio('./public/sounds/streak3.mp3'),
                new Audio('./public/sounds/streak4.mp3'),
            ],
            achievement: [
                new Audio('./public/sounds/aachievment.mp3'),
                new Audio('./public/sounds/achievment1.mp3'),
                new Audio('./public/sounds/achievment2.mp3')
            ],
            error: new Audio('./public/sounds/error.mp3')
        };
        this.SUCCESS_MESSAGES = [
            '✨ כל הכבוד! ✨',
            '🌟 איזה יופי! 🌟',
            '🎯 מדויק! 🎯',
            '🎨 נפלא! 🎨',
            '🎉 מצוין! 🎉',
            '💫 כל הכבוד! 💫',
            '⭐ נהדר! ⭐',
            '✨ יופי של קריאה! ✨',
            '🌟 ממש מדויק! 🌟',
            '⭐ קריאה נפלאה! ⭐',
            '✨ אלוף/ה! ✨',
            '🎉 ידע מדהים! 🎉',
            '💫 התקדמות נהדרת! 💫',
            '⭐ קוראים מצוין! ⭐',
            '✨ הצלחה גדולה! ✨'
        ];
        this.achievementsEarned = new Set();
        console.log('Game initialized');
        this.statistics = new Statistics();
        this.levelManager = new LevelManager();
        this.letterDisplay = new HebrewLetterDisplay(this.statistics, this.levelManager);
        this.assessmentController = new AssessmentController();
        this.lettersShown = 0;
        this.initializeSounds();
        this.initializeLevelUI();
        this.streak = 0;
    }
    initializeSounds() {
        // Initialize all audio elements with default volume
        Object.values(this.soundFiles).flat().forEach(sound => {
            if (sound instanceof Audio) {
                sound.volume = this.soundVolume;
            }
        });
        // Initialize volume control
        const volumeControl = document.getElementById('volumeControl');
        if (volumeControl) {
            volumeControl.value = String(this.soundVolume * 100);
            volumeControl.addEventListener('input', (e) => {
                this.soundVolume = parseFloat(e.target.value) / 100;
                this.updateVolume(this.soundVolume);
            });
        }
        // Initialize sound toggle
        const soundToggle = document.getElementById('enableSounds');
        if (soundToggle) {
            soundToggle.checked = this.soundsEnabled;
            soundToggle.addEventListener('change', (e) => {
                this.soundsEnabled = e.target.checked;
            });
        }
        // Initialize cache control buttons
        this.initializeCacheControls();
    }
    initializeCacheControls() {
        console.log('Initializing cache controls...');
        // Clear current level button
        const clearCurrentLevelBtn = document.getElementById('clearCurrentLevelBtn');
        console.log('Clear current level button:', clearCurrentLevelBtn);
        if (clearCurrentLevelBtn) {
            // Add both click and touchend events for better mobile support
            clearCurrentLevelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearCurrentLevel();
            });
            clearCurrentLevelBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.clearCurrentLevel();
            });
            console.log('Added event listeners to clear current level button');
        }
        // Clear all levels button  
        const clearAllLevelsBtn = document.getElementById('clearAllLevelsBtn');
        console.log('Clear all levels button:', clearAllLevelsBtn);
        if (clearAllLevelsBtn) {
            // Add both click and touchend events for better mobile support
            clearAllLevelsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearAllLevels();
            });
            clearAllLevelsBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.clearAllLevels();
            });
            console.log('Added event listeners to clear all levels button');
        }
    }
    updateVolume(volume) {
        this.soundVolume = volume;
        Object.values(this.soundFiles).flat().forEach(sound => {
            if (sound instanceof Audio) {
                sound.volume = volume;
            }
        });
    }
    createStars() {
        const leftStars = document.createElement('div');
        leftStars.className = 'success-stars left';
        const rightStars = document.createElement('div');
        rightStars.className = 'success-stars right';
        for (let i = 0; i < 3; i++) {
            const starLeft = document.createElement('div');
            const starRight = document.createElement('div');
            starLeft.innerHTML = '⭐';
            starRight.innerHTML = '⭐';
            starLeft.style.fontSize = '2rem';
            starRight.style.fontSize = '2rem';
            starLeft.style.animation = `starPop ${1 + Math.random()}s ease-out forwards`;
            starRight.style.animation = `starPop ${1 + Math.random()}s ease-out forwards`;
            leftStars.appendChild(starLeft);
            rightStars.appendChild(starRight);
        }
        document.body.appendChild(leftStars);
        document.body.appendChild(rightStars);
        setTimeout(() => {
            document.body.removeChild(leftStars);
            document.body.removeChild(rightStars);
        }, 2000);
    }
    checkAchievements() {
        // Check streak-based achievements
        if (this.streak === 5)
            this.awardAchievement(this.ACHIEVEMENTS.QUICK_LEARNER);
        if (this.streak === 10)
            this.awardAchievement(this.ACHIEVEMENTS.MASTER_READER);
        // Check total letters achievement
        if (this.lettersShown === 50)
            this.awardAchievement(this.ACHIEVEMENTS.PERSISTENT);
        if (this.lettersShown === 100)
            this.awardAchievement(this.ACHIEVEMENTS.DEDICATED);
        // Check Nikud mastery (90% success rate with at least 10 attempts)
        const performance = this.statistics.calculateOverallPerformance();
        Object.entries(performance).forEach(([nikud, rate]) => {
            const stats = this.statistics.getStatistics(nikud);
            if (stats && stats.total >= 10 && rate >= 90) {
                this.awardAchievement(this.ACHIEVEMENTS.NIKUD_EXPERT);
            }
        });
    }
    awardAchievement(achievement) {
        if (this.achievementsEarned.has(achievement.id))
            return;
        this.achievementsEarned.add(achievement.id);
        this.showAchievementBanner(achievement);
        this.createConfetti();
        this.playAchievementSound();
    }
    showAchievementBanner(achievement) {
        const banner = document.createElement('div');
        banner.className = 'achievement-banner';
        banner.innerHTML = `
            <h2>${achievement.title}</h2>
            <p>${achievement.description}</p>
        `;
        document.body.appendChild(banner);
        setTimeout(() => document.body.removeChild(banner), 2000);
    }
    createConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.backgroundColor = this.getRandomColor();
            confetti.style.animationDuration = `${Math.random() * 2 + 1}s`;
            document.body.appendChild(confetti);
            setTimeout(() => document.body.removeChild(confetti), 2000);
        }
    }
    getRandomColor() {
        const colors = ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', '#9C27B0'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    playAchievementSound() {
        if (!this.soundsEnabled)
            return;
        const randomIndex = Math.floor(Math.random() * this.soundFiles.achievement.length);
        const sound = this.soundFiles.achievement[randomIndex];
        sound.currentTime = 0;
        sound.volume = this.soundVolume;
        sound.play().catch(console.error);
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
            if (!this.soundsEnabled)
                return;
            try {
                let sound;
                if (!isCorrect) {
                    sound = this.soundFiles.error;
                }
                else {
                    if (this.STREAK_LEVELS.includes(this.streak)) {
                        // Get appropriate streak sound based on level
                        const streakIndex = this.STREAK_LEVELS.indexOf(this.streak);
                        sound = this.soundFiles.streak[streakIndex];
                    }
                    else {
                        // Randomly select a success sound
                        const randomIndex = Math.floor(Math.random() * this.soundFiles.success.length);
                        sound = this.soundFiles.success[randomIndex];
                    }
                }
                if (!sound) {
                    console.error('Sound element not found');
                    return;
                }
                sound.currentTime = 0;
                sound.volume = this.soundVolume;
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
                milestone.textContent = `תמשיך להתמיד ותהיה אלוף!`; //`Keep practicing ${nikud} - ${accuracy}% mastery`;
                milestone.classList.remove('milestone-show');
                void milestone.offsetWidth;
                milestone.classList.add('milestone-show');
            }
        }
    }
    handleAssessment(isCorrect) {
        var _a;
        const currentLetter = this.letterDisplay.getCurrentLetter();
        // Record progress in level manager
        const result = this.levelManager.recordAnswer(isCorrect);
        if (isCorrect) {
            this.streak++;
            (_a = document.querySelector('.letter-display')) === null || _a === void 0 ? void 0 : _a.classList.add('letter-success');
            setTimeout(() => {
                var _a;
                (_a = document.querySelector('.letter-display')) === null || _a === void 0 ? void 0 : _a.classList.remove('letter-success');
            }, 500);
            this.showSuccessMessage('יפה מאוד!');
            // Handle level completion and automatic advancement
            if (result.levelCompleted) {
                this.showLevelCompletionMessage(result.autoAdvanced);
                if (result.autoAdvanced) {
                    // Update the level UI to reflect the new level
                    this.updateLevelUI();
                }
            }
            if (this.STREAK_LEVELS.includes(this.streak)) {
                this.showMilestoneMessage(this.streak);
            }
        }
        else {
            this.streak = 0;
            this.showLearningFeedback(currentLetter.nikud);
        }
        this.statistics.updateStatistics(currentLetter.nikud, isCorrect);
        this.lettersShown++;
        this.updateCounter();
        this.updateStatisticsDisplay();
        this.updateLevelDisplay();
        this.updateStreakDisplay();
        this.checkAchievements();
        this.playSound(isCorrect);
        this.showNextLetter();
    }
    showSuccessMessage(message) {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = this.SUCCESS_MESSAGES[Math.floor(Math.random() * this.SUCCESS_MESSAGES.length)];
        document.body.appendChild(successMsg);
        // Remove the createStars call and just set a timeout to remove the message
        setTimeout(() => document.body.removeChild(successMsg), 2000);
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
                // Play corresponding streak sound
                const sound = this.soundFiles.streak[streakLevel - 1];
                if (sound) {
                    sound.currentTime = 0;
                    sound.volume = this.soundVolume;
                    sound.play().catch(console.error);
                }
            }
        }
    }
    initializeLevelUI() {
        this.updateLevelDisplay();
        this.initializeLevelButtons();
    }
    updateLevelDisplay() {
        const currentLevel = this.levelManager.getCurrentLevel();
        const progress = this.levelManager.getCurrentLevelProgress();
        if (!currentLevel || !progress)
            return;
        // Update level info display
        const levelNameElement = document.getElementById('current-level-name');
        const levelDescElement = document.getElementById('current-level-description');
        const levelProgressElement = document.getElementById('level-progress');
        if (levelNameElement) {
            levelNameElement.textContent = currentLevel.name;
        }
        if (levelDescElement) {
            levelDescElement.textContent = currentLevel.description;
        }
        if (levelProgressElement) {
            const completion = this.levelManager.getCompletionPercentage(currentLevel.id);
            levelProgressElement.textContent = `${progress.correctAnswers}/${currentLevel.completionRequirement} (${completion.toFixed(0)}%)`;
        }
    }
    initializeLevelButtons() {
        const levelSelectButton = document.getElementById('level-select-btn');
        if (levelSelectButton) {
            levelSelectButton.addEventListener('click', () => this.showLevelSelector());
        }
    }
    showLevelSelector() {
        // Create level selector modal
        const modal = document.createElement('div');
        modal.className = 'level-selector-modal';
        modal.innerHTML = this.generateLevelSelectorHTML();
        document.body.appendChild(modal);
        // Add event listeners
        this.attachLevelSelectorEvents(modal);
    }
    generateLevelSelectorHTML() {
        const levels = this.levelManager.getAllLevels();
        const unlockedLevels = this.levelManager.getUnlockedLevels();
        let html = `
            <div class="level-selector-content">
                <div class="level-selector-header">
                    <h2>בחר רמה</h2>
                    <button class="close-modal">×</button>
                </div>
                <div class="levels-grid">
        `;
        levels.forEach(level => {
            const progress = this.levelManager.getLevelProgress(level.id);
            const isUnlocked = unlockedLevels.some(ul => ul.id === level.id);
            const completion = this.levelManager.getCompletionPercentage(level.id);
            html += `
                <div class="level-card ${isUnlocked ? 'unlocked' : 'locked'} ${(progress === null || progress === void 0 ? void 0 : progress.isCompleted) ? 'completed' : ''}" 
                     data-level-id="${level.id}">
                    <div class="level-icon">${level.icon}</div>
                    <div class="level-info">
                        <h3>${level.name}</h3>
                        <p>${level.description}</p>
                        <div class="level-progress-bar">
                            <div class="progress-fill" style="width: ${completion}%"></div>
                        </div>
                        <div class="level-stats">
                            ${progress ? `${progress.correctAnswers}/${level.completionRequirement}` : '0/0'}
                        </div>
                    </div>
                    ${!isUnlocked ? '<div class="lock-overlay">🔒</div>' : ''}
                </div>
            `;
        });
        html += `
                </div>
            </div>
        `;
        return html;
    }
    attachLevelSelectorEvents(modal) {
        // Close button
        const closeButton = modal.querySelector('.close-modal');
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        // Level cards
        const levelCards = modal.querySelectorAll('.level-card.unlocked');
        levelCards.forEach(card => {
            card.addEventListener('click', () => {
                const levelId = card.getAttribute('data-level-id');
                if (levelId && this.levelManager.setCurrentLevel(levelId)) {
                    this.updateLevelDisplay();
                    this.letterDisplay.updateDisplayedLetter();
                    document.body.removeChild(modal);
                }
            });
        });
    }
    updateCounter() {
        const counterElement = document.getElementById('letters-count');
        if (counterElement) {
            counterElement.textContent = this.lettersShown.toString();
        }
    }
    showNextLetter() {
        this.letterDisplay.updateDisplayedLetter();
    }
    startGame() {
        console.log('Starting Hebrew Reading Game with Level System');
        this.letterDisplay.updateDisplayedLetter();
        this.updateLevelDisplay();
        // Initialize game handlers for global access
        window.gameHandlers = {
            handleCorrect: () => this.handleAssessment(true),
            handleIncorrect: () => this.handleAssessment(false),
            setPreset: (preset) => this.setNikudPreset(preset),
            clearCurrentLevel: () => this.clearCurrentLevel(),
            clearAllLevels: () => this.clearAllLevels(),
            updateNikudSettings: (nikud, enabled) => updateNikudSettings(nikud, enabled)
        };
    }
    setNikudPreset(preset) {
        // Legacy support for existing preset system
        const presets = {
            beginner: ['Patah', 'Qamats', 'Hiriq'],
            intermediate: ['Patah', 'Qamats', 'Hiriq', 'Tsere', 'Segol'],
            advanced: ['Patah', 'Qamats', 'Hiriq', 'Tsere', 'Segol', 'Sheva', 'Holam', 'FullShuruk']
        };
        // This could be enhanced to work with levels in the future
        console.log(`Setting preset: ${preset}`, presets[preset]);
    }
    showLevelCompletionMessage(autoAdvanced) {
        const message = autoAdvanced
            ? '🎉 כל הכבוד! השלמת את הרמה ועברת לרמה הבאה! 🎉'
            : '🎉 כל הכבוד! השלמת את הרמה! 🎉';
        this.showAchievementBanner({ title: 'Level Completed', description: message });
        // Play achievement sound
        if (this.soundsEnabled) {
            const achievementSounds = this.soundFiles.achievement;
            const sound = achievementSounds[Math.floor(Math.random() * achievementSounds.length)];
            sound.play().catch(e => console.log('Could not play achievement sound'));
        }
    }
    updateLevelUI() {
        // Update the level display and progress
        this.initializeLevelUI();
        // Refresh the letter display to use the new level configuration
        // Generate a new letter for the new level
        this.letterDisplay.updateDisplayedLetter();
    }
    clearCurrentLevel() {
        console.log('Clear current level clicked');
        const currentLevel = this.levelManager.getCurrentLevel();
        if (currentLevel) {
            const confirmed = confirm(`האם אתה בטוח שברצונך לנקות את כל ההתקדמות של הרמה "${currentLevel.name}"?`);
            if (confirmed) {
                this.levelManager.clearCurrentLevelProgress();
                this.updateLevelDisplay();
                this.updateStatisticsDisplay();
                this.showSuccessMessage('הרמה נוכחית נוקתה בהצלחה!');
                console.log('Current level cleared successfully');
            }
        }
    }
    clearAllLevels() {
        console.log('Clear all levels clicked');
        const confirmed = confirm('האם אתה בטוח שברצונך לנקות את כל ההתקדמות של כל הרמות? פעולה זו לא ניתנת לביטול!');
        if (confirmed) {
            const doubleConfirmed = confirm('זוהי פעולה בלתי הפיכה! האם אתה בטוח לחלוטין?');
            if (doubleConfirmed) {
                this.levelManager.clearAllLevelsProgress();
                this.statistics = new Statistics(); // Reset statistics as well
                this.updateLevelDisplay();
                this.updateStatisticsDisplay();
                this.showSuccessMessage('כל הרמות נוקו בהצלחה!');
                // Reload the game to reset to first level
                this.updateLevelUI();
                console.log('All levels cleared successfully');
            }
        }
    }
}
