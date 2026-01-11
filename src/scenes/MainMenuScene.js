import Phaser from 'phaser';
import THEME from '../styles/theme.js';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor(THEME.bg);
        const centerX = 400;

        this.add.text(centerX, 120, '麻雀トレーニング', {
            fontSize: '32px',
            color: THEME.textStrong
        }).setOrigin(0.5, 0.5);

        const activeColor = THEME.accent;
        const hoverColor = THEME.accentHover;
        const disabledColor = THEME.textMuted;

        const scorePractice = this.add.text(centerX, 240, '点数計算練習（翻・符→点数）', {
            fontSize: '20px',
            color: activeColor
        }).setOrigin(0.5, 0.5);
        scorePractice.setInteractive({ useHandCursor: true });
        scorePractice.on('pointerover', () => scorePractice.setColor(hoverColor));
        scorePractice.on('pointerout', () => scorePractice.setColor(activeColor));
        scorePractice.on('pointerdown', () => {
            this.scene.start('ScorePracticeScene');
        });

        this.add.text(centerX, 300, '役判定（保留）', {
            fontSize: '20px',
            color: disabledColor
        }).setOrigin(0.5, 0.5);
    }
}
