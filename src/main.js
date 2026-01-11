import Phaser from 'phaser';

const TILE_DEFS = {
    manzu: [
        { key: 'ms1', path: '/images/p_ms1_1.gif' },
        { key: 'ms2', path: '/images/p_ms2_1.gif' },
        { key: 'ms3', path: '/images/p_ms3_1.gif' },
        { key: 'ms4', path: '/images/p_ms4_1.gif' },
        { key: 'ms5', path: '/images/p_ms5_1.gif' },
        { key: 'ms6', path: '/images/p_ms6_1.gif' },
        { key: 'ms7', path: '/images/p_ms7_1.gif' },
        { key: 'ms8', path: '/images/p_ms8_1.gif' },
        { key: 'ms9', path: '/images/p_ms9_1.gif' }
    ],
    pinzu: [
        { key: 'ps1', path: '/images/p_ps1_1.gif' },
        { key: 'ps2', path: '/images/p_ps2_1.gif' },
        { key: 'ps3', path: '/images/p_ps3_1.gif' },
        { key: 'ps4', path: '/images/p_ps4_1.gif' },
        { key: 'ps5', path: '/images/p_ps5_1.gif' },
        { key: 'ps6', path: '/images/p_ps6_1.gif' },
        { key: 'ps7', path: '/images/p_ps7_1.gif' },
        { key: 'ps8', path: '/images/p_ps8_1.gif' },
        { key: 'ps9', path: '/images/p_ps9_1.gif' }
    ],
    souzu: [
        { key: 'ss1', path: '/images/p_ss1_1.gif' },
        { key: 'ss2', path: '/images/p_ss2_1.gif' },
        { key: 'ss3', path: '/images/p_ss3_1.gif' },
        { key: 'ss4', path: '/images/p_ss4_1.gif' },
        { key: 'ss5', path: '/images/p_ss5_1.gif' },
        { key: 'ss6', path: '/images/p_ss6_1.gif' },
        { key: 'ss7', path: '/images/p_ss7_1.gif' },
        { key: 'ss8', path: '/images/p_ss8_1.gif' },
        { key: 'ss9', path: '/images/p_ss9_1.gif' }
    ],
    jihai: [
        { key: 'ji_e', path: '/images/p_ji_e_1.gif' },
        { key: 'ji_s', path: '/images/p_ji_s_1.gif' },
        { key: 'ji_w', path: '/images/p_ji_w_1.gif' },
        { key: 'ji_n', path: '/images/p_ji_n_1.gif' },
        { key: 'ji_h', path: '/images/p_ji_h_1.gif' },
        { key: 'ji_c', path: '/images/p_ji_c_1.gif' },
        { key: 'ji_no', path: '/images/p_no_1.gif' }
    ]
};

const TILE_ROWS = [
    { label: 'manzu', keys: TILE_DEFS.manzu.map((tile) => tile.key) },
    { label: 'pinzu', keys: TILE_DEFS.pinzu.map((tile) => tile.key) },
    { label: 'souzu', keys: TILE_DEFS.souzu.map((tile) => tile.key) },
    { label: 'jihai', keys: TILE_DEFS.jihai.map((tile) => tile.key) }
];

class TilePreviewScene extends Phaser.Scene {
    constructor() {
        super();
        this.selectedTileIds = new Set();
        this.selectedTileList = [];
        this.selectedSprites = new Map();
        this.tileImages = new Map();
        this.resultText = null;
        this.taskText = null;
        this.selectionArea = null;
        this.tileScale = 1;
        this.tileWidth = 0;
        this.tileHeight = 0;
        this.liftOffset = 12;
    }

    preload() {
        Object.values(TILE_DEFS).flat().forEach(({ key, path }) => {
            this.load.image(key, path);
        });
    }

    create() {
        const marginX = 20;
        const marginY = 20;
        const rowGap = 10;
        const sampleKey = TILE_ROWS[0].keys[0];
        const sampleImage = this.textures.get(sampleKey).getSourceImage();
        const availableWidth = 800 - marginX * 2;
        const tileScale = Math.min(0.7, availableWidth / (sampleImage.width * 9));
        const tileWidth = sampleImage.width * tileScale;
        const tileHeight = sampleImage.height * tileScale;
        const headerY = 10;
        const selectionArea = {
            x: 20,
            y: 420,
            width: 760,
            height: 160
        };

        this.selectionArea = selectionArea;
        this.tileScale = tileScale;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this.taskText = this.add.text(20, headerY, 'お題：タンヤオ（1・9・字牌なし）', {
            fontSize: '18px',
            color: '#222'
        });

        const judgeButton = this.add.text(600, headerY, '判定', {
            fontSize: '18px',
            color: '#2c3e50'
        });
        judgeButton.setInteractive({ useHandCursor: true });
        judgeButton.on('pointerdown', () => {
            const tileKeys = this.selectedTileList.map((tileId) => this.getTileKey(tileId));
            if (tileKeys.length === 0) {
                this.setResultMessage('牌を選択してください', '#c0392b');
                return;
            }
            const result = evaluateTanyao(tileKeys);
            if (result.ok) {
                this.setResultMessage('正解！', '#2e7d32');
                this.clearAllSelection();
            } else {
                this.setResultMessage(`不正解：${result.reason}`, '#c0392b');
            }
        });

        this.resultText = this.add.text(20, headerY + 24, '', {
            fontSize: '16px',
            color: '#333'
        });

        const selectionFrame = this.add.graphics();
        selectionFrame.lineStyle(2, 0x666666, 1);
        selectionFrame.strokeRect(
            selectionArea.x,
            selectionArea.y,
            selectionArea.width,
            selectionArea.height
        );
        this.add.text(selectionArea.x + 10, selectionArea.y + 8, '選択中', {
            fontSize: '16px',
            color: '#333'
        });

        const clearButton = this.add.text(
            selectionArea.x + selectionArea.width - 80,
            selectionArea.y + 8,
            '全解除',
            { fontSize: '16px', color: '#c0392b' }
        );
        clearButton.setInteractive({ useHandCursor: true });
        clearButton.on('pointerdown', () => {
            this.clearAllSelection();
        });

        TILE_ROWS.forEach((row, rowIndex) => {
            const y = marginY + rowIndex * (tileHeight + rowGap);
            const rowWidth = row.keys.length * tileWidth;
            const startX = marginX + (availableWidth - rowWidth) / 2 + tileWidth / 2;

            row.keys.forEach((key, index) => {
                const x = startX + index * tileWidth;
                const tileId = `${key}#${rowIndex}_${index}`;
                const image = this.add.image(x, y, key).setScale(tileScale);
                image.setInteractive({ useHandCursor: true });
                image.setData('tileId', tileId);
                image.setData('baseY', y);
                image.setData('isSelected', false);
                this.tileImages.set(tileId, image);

                image.on('pointerdown', () => {
                    if (image.getData('isSelected')) {
                        this.deselectTile(tileId);
                    } else {
                        this.selectTile(tileId, key);
                    }
                    this.layoutSelectedTiles(selectionArea, tileScale, tileWidth, tileHeight);
                    this.logSelection();
                });
            });
        });
    }

    selectTile(tileId, key) {
        const image = this.tileImages.get(tileId);
        if (!image || this.selectedTileIds.has(tileId)) {
            return;
        }
        image.setData('isSelected', true);
        image.setY(image.getData('baseY') - this.liftOffset);
        image.setAlpha(0.85);
        this.selectedTileIds.add(tileId);
        this.selectedTileList.push(tileId);

        const copy = this.add.image(0, 0, key);
        this.selectedSprites.set(tileId, copy);
    }

    deselectTile(tileId) {
        const image = this.tileImages.get(tileId);
        if (image) {
            image.setData('isSelected', false);
            image.setY(image.getData('baseY'));
            image.setAlpha(1);
        }

        const sprite = this.selectedSprites.get(tileId);
        if (sprite) {
            sprite.destroy();
            this.selectedSprites.delete(tileId);
        }

        this.selectedTileIds.delete(tileId);
        this.selectedTileList = this.selectedTileList.filter((id) => id !== tileId);
    }

    layoutSelectedTiles(selectionArea, tileScale, tileWidth, tileHeight) {
        const startX = selectionArea.x + 20 + tileWidth / 2;
        const centerY = selectionArea.y + selectionArea.height / 2 + tileHeight * 0.1;

        this.selectedTileList.forEach((tileId, index) => {
            const sprite = this.selectedSprites.get(tileId);
            if (!sprite) {
                return;
            }
            sprite.setScale(tileScale);
            sprite.setPosition(startX + index * tileWidth, centerY);
        });
    }

    logSelection() {
        console.log(Array.from(this.selectedTileIds));
        console.log([...this.selectedTileList]);
    }

    clearAllSelection() {
        this.selectedTileList.slice().forEach((tileId) => {
            this.deselectTile(tileId);
        });
        this.layoutSelectedTiles(this.selectionArea, this.tileScale, this.tileWidth, this.tileHeight);
        this.logSelection();
    }

    getTileKey(tileId) {
        return tileId.split('#')[0];
    }

    setResultMessage(message, color) {
        if (!this.resultText) {
            return;
        }
        this.resultText.setText(message);
        this.resultText.setColor(color);
    }
}

function evaluateTanyao(tileKeys) {
    for (const key of tileKeys) {
        if (key.startsWith('ji_')) {
            return { ok: false, reason: '字牌が含まれています' };
        }
        const number = Number(key.slice(2));
        if (Number.isNaN(number)) {
            return { ok: false, reason: '不明な牌が含まれています' };
        }
        if (number === 1 || number === 9) {
            return { ok: false, reason: '1または9の数牌が含まれています' };
        }
    }
    return { ok: true };
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: TilePreviewScene
};

new Phaser.Game(config);
