class Level1 extends Phaser.Scene {
    constructor() {
        super("Level1");
    }

    create() {
        this.add.text(100, 100, "Level 1 - Coming Soon", { fontSize: "16px", fill: "#fff" });
    }
}