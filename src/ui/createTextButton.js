import Phaser from 'phaser';

export default function createTextButton(scene, x, y, label, theme, onClick, options = {}) {
    const {
        fontSize = '18px',
        minWidth = 120,
        minHeight = 44,
        paddingX = 16,
        paddingY = 10,
        radius = 8
    } = options;

    const text = scene.add.text(0, 0, label, {
        fontSize,
        color: theme.buttonText,
        padding: { top: 2, bottom: 2 }
    }).setOrigin(0.5, 0.5);

    let width = Math.max(minWidth, text.width + paddingX * 2);
    let height = Math.max(minHeight, text.height + paddingY * 2);
    const background = scene.add.graphics();

    const toPhaserColor = (color) => {
        if (typeof color === 'number') {
            return color;
        }
        return Phaser.Display.Color.HexStringToColor(color).color;
    };

    const drawBackground = (color) => {
        background.clear();
        background.fillStyle(toPhaserColor(color), 1);
        background.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
    };

    drawBackground(theme.buttonBg);

    const hitArea = scene.add.zone(0, 0, width, height).setOrigin(0.5, 0.5);
    hitArea.setInteractive({ useHandCursor: true });

    const container = scene.add.container(x, y, [background, text, hitArea]);

    let isPressed = false;
    let isSelected = false;

    const setSelected = (selected) => {
        isSelected = selected;
        if (isSelected) {
            drawBackground(theme.buttonBgSelected);
            text.setColor(theme.buttonTextSelected);
        } else {
            drawBackground(theme.buttonBg);
            text.setColor(theme.buttonText);
        }
    };

    const setLabel = (nextLabel) => {
        text.setText(nextLabel);
        width = Math.max(minWidth, text.width + paddingX * 2);
        height = Math.max(minHeight, text.height + paddingY * 2);
        hitArea.setSize(width, height);
        drawBackground(isSelected ? theme.buttonBgSelected : theme.buttonBg);
    };

    hitArea.on('pointerover', () => {
        if (!isPressed && !isSelected && theme.buttonBgHover) {
            drawBackground(theme.buttonBgHover);
        }
    });

    hitArea.on('pointerdown', () => {
        isPressed = true;
        container.setScale(0.98);
        if (!isSelected) {
            drawBackground(theme.buttonBgPressed);
        }
    });

    hitArea.on('pointerup', () => {
        if (!isPressed) {
            return;
        }
        isPressed = false;
        container.setScale(1);
        if (!isSelected) {
            drawBackground(theme.buttonBg);
        }
        if (onClick) {
            onClick();
        }
    });

    hitArea.on('pointerout', () => {
        isPressed = false;
        container.setScale(1);
        if (!isSelected) {
            drawBackground(theme.buttonBg);
        }
    });

    hitArea.on('pointerupoutside', () => {
        isPressed = false;
        container.setScale(1);
        if (!isSelected) {
            drawBackground(theme.buttonBg);
        }
    });

    return { container, setLabel, setSelected };
}
