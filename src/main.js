import Phaser from 'phaser';
import MainMenuScene from './scenes/MainMenuScene.js';
import ScorePracticeScene from './scenes/ScorePracticeScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    dom: {
        createContainer: true
    },
    scene: [MainMenuScene, ScorePracticeScene]
};

new Phaser.Game(config);

// Run: npm run dev
