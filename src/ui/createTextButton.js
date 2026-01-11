import Phaser from 'phaser';

const DEFAULT_THEME = {
    buttonBg: '#e2e8f0',
    buttonBgHover: '#dbeafe',
    buttonBgPressed: '#cbd5f5',
    buttonBgSelected: '#93c5fd',
    buttonText: '#111827',
    buttonTextSelected: '#0f172a'
};

export default function createTextButton(scene, x, y, label, theme, onClick, options = {}) {
    const {
        fontSize = '18px',
        minWidth = 160,
        paddingX = 16,
        paddingY = 10,
        radius = 10
    } = options;
    const resolvedTheme = { ...DEFAULT_THEME, ...(theme ?? {}) };

    const text = scene.add.text(0, 0, label, {
        fontSize,
        color: resolvedTheme.buttonText,
        padding: { top: 2, bottom: 2 }
    }).setOrigin(0.5, 0.5);

    let width = Math.max(minWidth, text.width + paddingX * 2);
    let height = Math.max(44, text.height + paddingY * 2);
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

    drawBackground(resolvedTheme.buttonBg);

    const hitArea = scene.add.zone(0, 0, width, height).setOrigin(0.5, 0.5);
    hitArea.setInteractive({ useHandCursor: true });

    const container = scene.add.container(x, y, [background, text, hitArea]);
    container.setSize(width, height);

    let isPressed = false;
    let isSelected = false;
    let isEnabled = true;

    const refreshVisual = () => {
        if (!isEnabled) {
            container.setAlpha(0.5);
            drawBackground(resolvedTheme.buttonBg);
            text.setColor(resolvedTheme.buttonText);
            return;
        }
        container.setAlpha(1);
        if (isSelected) {
            drawBackground(resolvedTheme.buttonBgSelected);
            text.setColor(resolvedTheme.buttonTextSelected);
            return;
        }
        drawBackground(resolvedTheme.buttonBg);
        text.setColor(resolvedTheme.buttonText);
    };

    const setSelected = (selected) => {
        isSelected = Boolean(selected);
        refreshVisual();
    };

    const setEnabled = (enabled) => {
        isEnabled = Boolean(enabled);
        hitArea.input.enabled = isEnabled;
        refreshVisual();
    };

    const setLabel = (nextLabel) => {
        text.setText(nextLabel);
        width = Math.max(minWidth, text.width + paddingX * 2);
        height = Math.max(44, text.height + paddingY * 2);
        container.setSize(width, height);
        hitArea.setSize(width, height);
        refreshVisual();
    };

    hitArea.on('pointerover', () => {
        if (!isEnabled || isSelected || isPressed) {
            return;
        }
        if (resolvedTheme.buttonBgHover) {
            drawBackground(resolvedTheme.buttonBgHover);
        }
    });

    hitArea.on('pointerdown', () => {
        if (!isEnabled) {
            return;
        }
        isPressed = true;
        container.setScale(0.98);
        if (!isSelected) {
            drawBackground(resolvedTheme.buttonBgPressed);
        }
    });

    hitArea.on('pointerup', () => {
        if (!isEnabled || !isPressed) {
            return;
        }
        isPressed = false;
        container.setScale(1);
        refreshVisual();
        if (onClick) {
            onClick();
        }
    });

    hitArea.on('pointerout', () => {
        if (!isEnabled) {
            return;
        }
        isPressed = false;
        container.setScale(1);
        refreshVisual();
    });

    hitArea.on('pointerupoutside', () => {
        if (!isEnabled) {
            return;
        }
        isPressed = false;
        container.setScale(1);
        refreshVisual();
    });

    const destroy = () => {
        container.destroy();
    };

    return {
        container,
        setSelected,
        setEnabled,
        setLabel,
        destroy
    };
}
