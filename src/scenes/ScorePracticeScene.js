import Phaser from 'phaser';
import THEME from '../styles/theme.js';
import createTextButton from '../ui/createTextButton.js';

const FU_VALUES = [20, 30, 40, 50, 60, 70];

function applyLimit(basePoints, han) {
    if (basePoints >= 2000) {
        return 2000;
    }
    return basePoints;

    // TODO: extend for han-based limits (mangan/haneman/baiman/sanbaiman/yakuman).
}

function calcPoints({ isDealer, winType, han, fu }) {
    const basePoints = applyLimit(fu * Math.pow(2, han + 2), han);
    const roundingUnit = winType === 'tsumo' ? 100 : 100;

    if (winType === 'ron') {
        const multiplier = isDealer ? 6 : 4;
        const total = basePoints * multiplier;
        return {
            type: 'ron',
            total: Math.ceil(total / roundingUnit) * roundingUnit
        };
    }

    if (isDealer) {
        const payment = Math.ceil(basePoints * 2 / roundingUnit) * roundingUnit;
        return {
            type: 'tsumo',
            main: payment,
            total: payment * 3
        };
    }

    const main = Math.ceil(basePoints * 2 / roundingUnit) * roundingUnit;
    const others = Math.ceil(basePoints / roundingUnit) * roundingUnit;
    return {
        type: 'tsumo',
        main,
        others,
        total: main + others * 2
    };

    // TODO: add mangan and above limit handling for han >= 4.
}

function buildQuestion() {
    const isDealer = Math.random() < 0.5;
    const han = Math.floor(Math.random() * 3) + 1;
    const fu = FU_VALUES[Math.floor(Math.random() * FU_VALUES.length)];
    const winType = fu === 20 ? 'tsumo' : Math.random() < 0.5 ? 'ron' : 'tsumo';

    return { isDealer, winType, han, fu };
}

function formatQuestion(question) {
    const seat = question.isDealer ? '親' : '子';
    const winType = question.winType === 'ron' ? 'ロン' : 'ツモ';
    return `${seat} / ${winType} / ${question.han}翻 / ${question.fu}符`;
}

function formatAnswer(points, isDealer) {
    if (points.type === 'ron') {
        return `${points.total}`;
    }
    if (isDealer) {
        return `${points.main}オール`;
    }
    return `${points.main}/${points.others}`;
}

export default class ScorePracticeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ScorePracticeScene' });
        this.question = null;
        this.resultText = null;
        this.optionButtons = [];
        this.answerValue = null;
        this.answerPanel = null;
    }

    create() {
        this.cameras.main.setBackgroundColor(THEME.bg);
        const centerX = 400;

        this.add.text(centerX, 60, '点数計算練習', {
            fontSize: '28px',
            color: THEME.textStrong,
            padding: { top: 2, bottom: 2 }
        }).setOrigin(0.5, 0.5);

        this.question = buildQuestion();
        this.questionText = this.add.text(centerX, 130, formatQuestion(this.question), {
            fontSize: '20px',
            color: THEME.text,
            padding: { top: 2, bottom: 2 }
        }).setOrigin(0.5, 0.5);

        this.add.text(centerX, 200, '4択から正しい点数を選んでください', {
            fontSize: '14px',
            color: THEME.textMuted,
            padding: { top: 2, bottom: 2 }
        }).setOrigin(0.5, 0.5);

        this.answerPanel = { x: 120, y: 185, width: 560, height: 220 };
        const answerPanel = this.add.graphics();
        answerPanel.fillStyle(0xffffff, 1);
        answerPanel.fillRoundedRect(
            this.answerPanel.x,
            this.answerPanel.y,
            this.answerPanel.width,
            this.answerPanel.height,
            8
        );
        answerPanel.lineStyle(
            1,
            Phaser.Display.Color.HexStringToColor(THEME.border).color,
            1
        );
        answerPanel.strokeRoundedRect(
            this.answerPanel.x,
            this.answerPanel.y,
            this.answerPanel.width,
            this.answerPanel.height,
            8
        );

        this.add.text(140, 200, '回答（4択）', {
            fontSize: '14px',
            color: THEME.textMuted,
            padding: { top: 2, bottom: 2 }
        });

        this.add.text(centerX, 225, '正しい点数を選んでください', {
            fontSize: '16px',
            color: THEME.textStrong,
            padding: { top: 2, bottom: 2 }
        }).setOrigin(0.5, 0.5);

        createTextButton(
            this,
            centerX - 110,
            440,
            '次の問題',
            THEME,
            () => this.resetQuestion(),
            { minWidth: 140 }
        );

        createTextButton(
            this,
            centerX + 110,
            440,
            'メニューへ戻る',
            THEME,
            () => this.scene.start('MainMenuScene'),
            { minWidth: 180 }
        );

        this.add.text(centerX - 220, 480, '判定結果', {
            fontSize: '14px',
            color: THEME.textMuted,
            padding: { top: 2, bottom: 2 }
        });

        this.resultText = this.add.text(centerX, 510, '', {
            fontSize: '18px',
            color: THEME.text,
            padding: { top: 2, bottom: 2 }
        }).setOrigin(0.5, 0.5);

        this.buildOptions();
    }

    handleJudge() {
        if (!this.answerValue) {
            return;
        }

        const points = calcPoints(this.question);
        const expected = formatAnswer(points, this.question.isDealer);

        if (this.answerValue === expected) {
            this.setResult('正解！', THEME.success);
        } else {
            this.setResult(`不正解：正解は ${expected}`, THEME.error);
        }
    }

    resetQuestion() {
        this.question = buildQuestion();
        this.questionText.setText(formatQuestion(this.question));
        this.setResult('', THEME.text);
        this.answerValue = null;
        this.buildOptions();
    }

    setResult(message, color) {
        this.resultText.setText(message);
        this.resultText.setColor(color);
    }

    buildOptions() {
        const points = calcPoints(this.question);
        const correct = formatAnswer(points, this.question.isDealer);
        const options = new Set([correct]);
        this.answerValue = null;

        while (options.size < 4) {
            const fake = this.createFakeAnswer(points, this.question.isDealer);
            options.add(fake);
        }

        const optionList = Phaser.Utils.Array.Shuffle(Array.from(options));
        const panel = this.answerPanel ?? { x: 120, y: 185, width: 560, height: 220 };
        const panelCenterX = panel.x + panel.width / 2;
        const panelCenterY = panel.y + panel.height / 2 + 8;
        const gapX = 220;
        const gapY = 60;

        this.optionButtons.forEach((option) => option.ui.destroy());
        this.optionButtons = [];

        optionList.forEach((value, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const x = panelCenterX + (col === 0 ? -gapX / 2 : gapX / 2);
            const y = panelCenterY + (row === 0 ? -gapY / 2 : gapY / 2);
            const ui = createTextButton(
                this,
                x,
                y,
                value,
                THEME,
                () => {
                    this.answerValue = value;
                    this.optionButtons.forEach((opt) => opt.ui.setSelected(opt.value === value));
                    this.handleJudge();
                },
                { minWidth: 200 }
            );
            this.optionButtons.push({ value, ui });
        });
    }

    createFakeAnswer(points, isDealer) {
        const deltas = isDealer ? [100, 200, 300, 400] : [100, 200, 300];
        if (points.type === 'ron') {
            const delta = Phaser.Utils.Array.GetRandom(deltas);
            return `${Math.max(100, points.total + delta * (Math.random() < 0.5 ? -1 : 1))}`;
        }
        if (isDealer) {
            const delta = Phaser.Utils.Array.GetRandom(deltas);
            const value = Math.max(100, points.main + delta * (Math.random() < 0.5 ? -1 : 1));
            return `${value}オール`;
        }
        const delta = Phaser.Utils.Array.GetRandom(deltas);
        const main = Math.max(100, points.main + delta * (Math.random() < 0.5 ? -1 : 1));
        const others = Math.max(100, points.others + delta * (Math.random() < 0.5 ? -1 : 1));
        return `${main}/${others}`;
    }
}
