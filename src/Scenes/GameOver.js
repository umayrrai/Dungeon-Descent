class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }

    create() {
        this.add.text(100, 100, "Game Over", { fontSize: "32px", fill: "#fff" });
        this.add.text(100, 150, "Press R to restart", { fontSize: "16px", fill: "#fff" });

        this.input.keyboard.once("keydown-R", () => {
            this.scene.start("Level1");
        });
    }
}