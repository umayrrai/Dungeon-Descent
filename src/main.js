// Desert Descent - A top-down dungeon shooter inspired by Soul Knight
// Developer Comment: This game features top-down WASD movement, mouse-aimed shooting,
// three enemy types with distinct AI behaviors, a multi-state boss fight, 
// room-based level progression, and particle/screenshake polish.

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Load, TitleScreen, Level1, GameOver]
};

const game = new Phaser.Game(config);