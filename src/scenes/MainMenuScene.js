import Phaser from 'phaser';
import THEME from '../styles/theme.js';
import createTextButton from '../ui/createTextButton.js';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor(THEME.bg);
        const centerX = 400;

        this.add.text(centerX, 120, '麻雀トレーニング', {
            fontSize: '32px',
            color: THEME.textStrong,
            padding: { top: 2, bottom: 2 }
        }).setOrigin(0.5, 0.5);

        const disabledColor = THEME.textMuted;

        createTextButton(
            this,
            centerX,
            240,
            '点数計算練習（翻・符→点数）',
            THEME,
            () => this.scene.start('ScorePracticeScene'),
            { fontSize: '20px', minWidth: 360 }
        );

        this.add.text(centerX, 300, '役判定（保留）', {
            fontSize: '20px',
            color: disabledColor,
            padding: { top: 2, bottom: 2 }
        }).setOrigin(0.5, 0.5);
    }
}
