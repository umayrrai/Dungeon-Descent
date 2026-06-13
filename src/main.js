// Dungeon Descent: A top down dungeon shooter inspired by Soul Knight

// Developer Comment: 
// This game features WASD movement with normalized diagonal speed,
// mouse-aimed auto-fire shooting with an orbiting gun sprite, 
// three enemy types with
// distinct AI behaviors (Charger, Shooter, Tank), 
// a wave-based spawn system with a
// max of 10 enemies on screen at once, 
// four hand-crafted Tiled maps with embedded tileset collision, 
// a multi-phase boss fight with homing projectiles, 
// increasing fire rate across levels, 
// invincibility frames, 
// 30% heal-on-kill mechanic,
// and a completion timer displayed on the victory screen.

const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 320,
    pixelArt: true,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Load, TitleScreen, Level1, Level2, Level3, Boss1, Victory, GameOver]
};

const game = new Phaser.Game(config);