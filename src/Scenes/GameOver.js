class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }

    create() {
        // Set a dark orange background to match the desert theme
        this.cameras.main.setBackgroundColor('#1a0a00');

        // Game over title text
        this.add.text(240, 80, "GAME OVER", { 
            fontSize: "32px", 
            fill: "#ff4400",
            fontStyle: "bold"
        }).setOrigin(0.5);

        // Flavor text
        this.add.text(240, 130, "Your quest comes to an end...", { 
            fontSize: "10px", 
            fill: "#ffaa66" 
        }).setOrigin(0.5);

        // Restart prompt
        this.add.text(240, 200, "Press R to try again", { 
            fontSize: "10px", 
            fill: "#ffffff" 
        }).setOrigin(0.5);

        // Flashing secondary prompt using a tween animation
        this.tweens.add({
            targets: this.add.text(240, 220, "or ESC to quit", { 
                fontSize: "8px", 
                fill: "#888888" 
            }).setOrigin(0.5),
            alpha: 0,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Credits
        this.add.text(240, 300, "Created by Umayr Rai", {
            fontSize: "8px",
            fill: "#555555"
        }).setOrigin(0.5);

        // Restart the game from Level 1 when R is pressed
        this.input.keyboard.once("keydown-R", () => {
            this.scene.start("Level1");
        });
    }
}