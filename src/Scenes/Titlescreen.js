class TitleScreen extends Phaser.Scene {
    constructor() {
        super("titleScreen");
    }

    create() {
        this.add.text(100, 100, "Desert Descent", { fontSize: "32px", fill: "#fff" });
        this.add.text(100, 150, "Press SPACE to start", { fontSize: "16px", fill: "#fff" });

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("Level1");
        });
    }
}