import Phaser from 'phaser';

class TilePreviewScene extends Phaser.Scene {
    preload() {
        const manzu = [
            { key: 'ms1', path: '/images/p_ms1_1.gif' },
            { key: 'ms2', path: '/images/p_ms2_1.gif' },
            { key: 'ms3', path: '/images/p_ms3_1.gif' },
            { key: 'ms4', path: '/images/p_ms4_1.gif' },
            { key: 'ms5', path: '/images/p_ms5_1.gif' },
            { key: 'ms6', path: '/images/p_ms6_1.gif' },
            { key: 'ms7', path: '/images/p_ms7_1.gif' },
            { key: 'ms8', path: '/images/p_ms8_1.gif' },
            { key: 'ms9', path: '/images/p_ms9_1.gif' }
        ];
        const pinzu = [
            { key: 'ps1', path: '/images/p_ps1_1.gif' },
            { key: 'ps2', path: '/images/p_ps2_1.gif' },
            { key: 'ps3', path: '/images/p_ps3_1.gif' },
            { key: 'ps4', path: '/images/p_ps4_1.gif' },
            { key: 'ps5', path: '/images/p_ps5_1.gif' },
            { key: 'ps6', path: '/images/p_ps6_1.gif' },
            { key: 'ps7', path: '/images/p_ps7_1.gif' },
            { key: 'ps8', path: '/images/p_ps8_1.gif' },
            { key: 'ps9', path: '/images/p_ps9_1.gif' }
        ];
        const souzu = [
            { key: 'ss1', path: '/images/p_ss1_1.gif' },
            { key: 'ss2', path: '/images/p_ss2_1.gif' },
            { key: 'ss3', path: '/images/p_ss3_1.gif' },
            { key: 'ss4', path: '/images/p_ss4_1.gif' },
            { key: 'ss5', path: '/images/p_ss5_1.gif' },
            { key: 'ss6', path: '/images/p_ss6_1.gif' },
            { key: 'ss7', path: '/images/p_ss7_1.gif' },
            { key: 'ss8', path: '/images/p_ss8_1.gif' },
            { key: 'ss9', path: '/images/p_ss9_1.gif' }
        ];
        const jihai = [
            { key: 'ji_e', path: '/images/p_ji_e_1.gif' },
            { key: 'ji_s', path: '/images/p_ji_s_1.gif' },
            { key: 'ji_w', path: '/images/p_ji_w_1.gif' },
            { key: 'ji_n', path: '/images/p_ji_n_1.gif' },
            { key: 'ji_h', path: '/images/p_ji_h_1.gif' },
            { key: 'ji_c', path: '/images/p_ji_c_1.gif' },
            { key: 'ji_no', path: '/images/p_no_1.gif' }
        ];

        const tiles = [...manzu, ...pinzu, ...souzu, ...jihai];
        tiles.forEach(({ key, path }) => this.load.image(key, path));

        this.tileRows = [
            { label: 'manzu', keys: manzu.map((tile) => tile.key) },
            { label: 'pinzu', keys: pinzu.map((tile) => tile.key) },
            { label: 'souzu', keys: souzu.map((tile) => tile.key) },
            { label: 'jihai', keys: jihai.map((tile) => tile.key) }
        ];
    }

    create() {
        const marginX = 20;
        const marginY = 20;
        const rowGap = 10;
        const sampleKey = this.tileRows[0].keys[0];
        const sampleImage = this.textures.get(sampleKey).getSourceImage();
        const availableWidth = 800 - marginX * 2;
        const tileScale = Math.min(0.7, availableWidth / (sampleImage.width * 9));
        const tileWidth = sampleImage.width * tileScale;
        const tileHeight = sampleImage.height * tileScale;

        this.tileRows.forEach((row, rowIndex) => {
            const y = marginY + rowIndex * (tileHeight + rowGap);
            const rowWidth = row.keys.length * tileWidth;
            const startX = marginX + (availableWidth - rowWidth) / 2 + tileWidth / 2;

            row.keys.forEach((key, index) => {
                const x = startX + index * tileWidth;
                this.add.image(x, y, key).setScale(tileScale);
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
