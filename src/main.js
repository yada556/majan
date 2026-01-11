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
        const liftOffset = 12;

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

                image.on('pointerdown', () => {
                    const isSelected = image.getData('isSelected');
                    const nextSelected = !isSelected;
                    image.setData('isSelected', nextSelected);

                    if (nextSelected) {
                        this.selectedTileIds.add(tileId);
                        image.setY(y - liftOffset);
                        image.setAlpha(0.85);
                    } else {
                        this.selectedTileIds.delete(tileId);
                        image.setY(y);
                        image.setAlpha(1);
                    }

                    console.log(Array.from(this.selectedTileIds));
                });
            });
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: TilePreviewScene
};

new Phaser.Game(config);
