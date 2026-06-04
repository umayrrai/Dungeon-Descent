class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        // assets will go here
    }

    create() {
        this.scene.start("titleScreen");
    }
}