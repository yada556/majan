import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

let logo;
let cursors;

function preload() {
    this.load.image('logo', 'https://phaser.io/images/img.png');
    this.load.image('pai_1man', '/images/p_ms1_1.gif');
}

function create() {
    logo = this.add.image(400, 300, 'logo');

    // 牌を表示（中央よりやや下）
    this.add.image(400, 400, 'pai_1man').setScale(0.5);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (cursors.left.isDown) {
        logo.x -= 5;
    } else if (cursors.right.isDown) {
        logo.x += 5;
    }
}
