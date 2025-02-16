import { Game } from './components/Game.js';
console.log('Script loaded');
function initializeGame() {
    console.log('Try Initializing app...');
    try {
        console.log('Initializing app...');
        const app = new Game();
        app.startGame();
    }
    catch (error) {
        console.error('Error in initialization:', error);
        const debugElement = document.getElementById('debug');
        if (debugElement) {
            debugElement.textContent = `Init Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
}
else {
    initializeGame();
}
