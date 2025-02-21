import HebrewLetterDisplay from './HebrewLetterDisplay.js';
import { AssessmentController } from '../controllers/AssessmentController.js';
import { Statistics } from '../models/Statistics.js';
import { updateNikudSettings } from '../utils/letterUtils.js';


export class Game {
    private letterDisplay: HebrewLetterDisplay;
    private assessmentController: AssessmentController;
    private statistics: Statistics;
    private lettersShown: number;
    private successSound!: HTMLAudioElement;
    private errorSound!: HTMLAudioElement;

    private streak: number = 0;
    private streakSound!: HTMLAudioElement;
    private readonly STREAK_THRESHOLD = 3;

    private readonly STREAK_LEVELS = [3, 6, 9];


    private readonly ACHIEVEMENTS = {
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

    private soundsEnabled: boolean = true;
    private soundVolume: number = 0.5;
    private readonly soundFiles = {
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
    
    private readonly SUCCESS_MESSAGES = [
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

    constructor() {
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

    private initializeSounds(): void {
        // Initialize all audio elements with default volume
        Object.values(this.soundFiles).flat().forEach(sound => {
            if (sound instanceof Audio) {
                sound.volume = this.soundVolume;
            }
        });

        // Initialize volume control
        const volumeControl = document.getElementById('volumeControl') as HTMLInputElement;
        if (volumeControl) {
            volumeControl.value = String(this.soundVolume * 100);
            volumeControl.addEventListener('input', (e) => {
                this.soundVolume = parseFloat((e.target as HTMLInputElement).value) / 100;
                this.updateVolume(this.soundVolume);
            });
        }

        // Initialize sound toggle
        const soundToggle = document.getElementById('enableSounds') as HTMLInputElement;
        if (soundToggle) {
            soundToggle.checked = this.soundsEnabled;
            soundToggle.addEventListener('change', (e) => {
                this.soundsEnabled = (e.target as HTMLInputElement).checked;
            });
        }
    }

    private updateVolume(volume: number): void {
        this.soundVolume = volume;
        Object.values(this.soundFiles).flat().forEach(sound => {
            if (sound instanceof Audio) {
                sound.volume = volume;
            }
        });
    }

   
    
    
    
    private createStars(): void {
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

    
    
    private achievementsEarned: Set<string> = new Set();
    
    private checkAchievements(): void {
        // Check streak-based achievements
        if (this.streak === 5) this.awardAchievement(this.ACHIEVEMENTS.QUICK_LEARNER);
        if (this.streak === 10) this.awardAchievement(this.ACHIEVEMENTS.MASTER_READER);
        
        // Check total letters achievement
        if (this.lettersShown === 50) this.awardAchievement(this.ACHIEVEMENTS.PERSISTENT);
        if (this.lettersShown === 100) this.awardAchievement(this.ACHIEVEMENTS.DEDICATED);
        
        // Check Nikud mastery (90% success rate with at least 10 attempts)
        const performance = this.statistics.calculateOverallPerformance();
        Object.entries(performance).forEach(([nikud, rate]) => {
            const stats = this.statistics.getStatistics(nikud);
            if (stats && stats.total >= 10 && rate >= 90) {
                this.awardAchievement(this.ACHIEVEMENTS.NIKUD_EXPERT);
            }
        });
    }
    
    private awardAchievement(achievement: { id: string; title: string; description: string }): void {
        if (this.achievementsEarned.has(achievement.id)) return;
        
        this.achievementsEarned.add(achievement.id);
        this.showAchievementBanner(achievement);
        this.createConfetti();
        this.playAchievementSound();
    }
    
    private showAchievementBanner(achievement: { title: string; description: string }): void {
        const banner = document.createElement('div');
        banner.className = 'achievement-banner';
        banner.innerHTML = `
            <h2>${achievement.title}</h2>
            <p>${achievement.description}</p>
        `;
        document.body.appendChild(banner);
        
        setTimeout(() => document.body.removeChild(banner), 2000);
    }
    
    private createConfetti(): void {
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
    
    private getRandomColor(): string {
        const colors = ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', '#9C27B0'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    private playAchievementSound(): void {
        if (!this.soundsEnabled) return;

        const randomIndex = Math.floor(Math.random() * this.soundFiles.achievement.length);
        const sound = this.soundFiles.achievement[randomIndex];
        sound.currentTime = 0;
        sound.volume = this.soundVolume;
        sound.play().catch(console.error);
    }

    // Add this method to the Game class
private updateStatisticsDisplay(): void {
    const statsContainer = document.getElementById('nikud-stats');
    if (!statsContainer) return;

    // Clear existing stats
    statsContainer.innerHTML = '';

    // Get nikud list from HebrewLetterDisplay
    const nikudList = this.letterDisplay.getNikudList();
    const performance = this.statistics.calculateOverallPerformance();
 
    nikudList.forEach(({ nikud, name }) => {
        const stats = this.statistics.getStatistics(nikud);
        if (!stats) return;

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

private async playSound(isCorrect: boolean): Promise<void> {
    if (!this.soundsEnabled) return;

    try {
        let sound: HTMLAudioElement;
        
        if (!isCorrect) {
            sound = this.soundFiles.error;
        } else {
            if (this.STREAK_LEVELS.includes(this.streak)) {
                // Get appropriate streak sound based on level
                const streakIndex = this.STREAK_LEVELS.indexOf(this.streak);
                sound = this.soundFiles.streak[streakIndex];
            } else {
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
        await sound.play();
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}
    private showLearningFeedback(nikud: string): void {
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


    private handleAssessment(isCorrect: boolean): void {
        const currentLetter = this.letterDisplay.getCurrentLetter();
        
        if (isCorrect) {
            this.streak++;
            document.querySelector('.letter-display')?.classList.add('letter-success');
            setTimeout(() => {
                document.querySelector('.letter-display')?.classList.remove('letter-success');
            }, 500);
            
            this.showSuccessMessage('יפה מאוד!');
            if (this.STREAK_LEVELS.includes(this.streak)) {
                this.showMilestoneMessage(this.streak);
            }
        } else {
            this.streak = 0;
            this.showLearningFeedback(currentLetter.nikud);
        }
        
        this.statistics.updateStatistics(currentLetter.nikud, isCorrect);
        this.lettersShown++;
        this.updateCounter();
        this.updateStatisticsDisplay();
        this.updateStreakDisplay();
        this.checkAchievements();
        this.playSound(isCorrect);
        this.showNextLetter();
    }

    private showSuccessMessage(message: string): void {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = this.SUCCESS_MESSAGES[Math.floor(Math.random() * this.SUCCESS_MESSAGES.length)];
        document.body.appendChild(successMsg);
        
        // Remove the createStars call and just set a timeout to remove the message
        setTimeout(() => document.body.removeChild(successMsg), 2000);
    }


private addStreakAnimation(): void {
    const displayArea = document.getElementById('display-area');
    const milestone = document.getElementById('streak-milestone');
    
    if (!displayArea || !milestone) return;

    // Remove any existing streak animations
    displayArea.classList.remove('streak-animation-3', 'streak-animation-6', 'streak-animation-9');

    // Determine streak level
    let streakLevel = 0;
    for (let level of this.STREAK_LEVELS) {
        if (this.streak >= level) streakLevel = level;
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
    private showMilestoneMessage(level: number): void {
        const milestone = document.getElementById('streak-milestone');
        if (!milestone) return;
    
        const messages = {
            3: '🌟 Great Streak! 🌟',
            6: '🔥 Amazing! 🔥',
            9: '⭐ Incredible! ⭐'
        };
    
        milestone.textContent = messages[level as keyof typeof messages];
        milestone.classList.remove('milestone-show');
        void milestone.offsetWidth; // Force reflow
        milestone.classList.add('milestone-show');
    }

    private updateStreakDisplay(): void {
    const streakElement = document.getElementById('streak');
    if (streakElement) {
        streakElement.textContent = `${this.streak}`;
        
        // Update streak display style based on level
        let streakLevel = 0;
        for (let level of this.STREAK_LEVELS) {
            if (this.streak >= level) streakLevel = level;
        }

        streakElement.className = streakLevel > 0 ? 'streak-highlight' : '';
        if (streakLevel > 0) {
            streakElement.style.color = this.getStreakColor(streakLevel);
            streakElement.style.fontSize = `${24 + (streakLevel * 2)}px`;
        } else {
            streakElement.style.color = '';
            streakElement.style.fontSize = '';
        }
    }
}

private getStreakColor(level: number): string {
    const colors = {
        3: '#ff4081',
        6: '#FFA500',
        9: '#4CAF50'
    };
    return colors[level as keyof typeof colors];
}

private setNikudPreset(nikudList: string[]): void {
    // Update checkboxes in UI
    document.querySelectorAll('.nikud-toggle input').forEach(checkbox => {
        if (checkbox instanceof HTMLInputElement) {
            const nikud = checkbox.dataset.nikud;
            checkbox.checked = nikudList.includes(nikud || '');
            if (nikud) {
                updateNikudSettings(nikud, checkbox.checked);
            }
        }
    });
    this.showNextLetter();
}

private initializeHandlers(): void {
    console.log('Initializing handlers');
    (window as any).gameHandlers = {
        setPreset: (level: string) => {
            switch(level) {
                case 'beginner':
                    this.setNikudPreset(['Qamats', 'Patah', 'Hiriq']);
                    break;
                case 'intermediate':
                    this.setNikudPreset(['Qamats', 'Patah', 'Hiriq', 'Tsere', 'Segol']);
                    break;
                case 'advanced':
                    this.setNikudPreset(['Sheva', 'Holam', 'FullShuruk', 'FullHolam']);
                    break;
            }
        },

        handleCorrect: () => {
            console.log('Correct clicked');
            this.handleAssessment(true);
        },
        handleIncorrect: () => {
            console.log('Incorrect clicked');
            this.handleAssessment(false);
        },
        updateNikudSettings: (nikud: string, enabled: boolean) => {
            console.log(`Updating Nikud settings: ${nikud} -> ${enabled}`);
            updateNikudSettings(nikud, enabled);
            this.showNextLetter();
        }
    };
}

    private updateCounter(): void {
        const counterElement = document.getElementById('counter');
        if (counterElement) {
            counterElement.textContent = this.lettersShown.toString();
        }
    }
    
    public startGame(): void {
        console.log('Game started');
        this.lettersShown = 0;
        this.updateCounter();
        this.letterDisplay.updateDisplayedLetter();
    }

    private showNextLetter(): void {
        this.letterDisplay.updateDisplayedLetter();
    }


   
}