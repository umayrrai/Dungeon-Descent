class Victory extends Phaser.Scene {
    constructor() {
        super("victory");
    }

    create() {
        // Calculate elapsed time since the game started in Level 1
        const elapsed = Date.now() - window.gameStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const timeStr = `${minutes}m ${seconds}s`;

        // Set a dark blue victory background
        this.cameras.main.setBackgroundColor('#000033');

        // Victory title
        this.add.text(240, 80, "VICTORY!", {
            fontSize: "32px", fill: "#ffff00", fontStyle: "bold"
        }).setOrigin(0.5);

        // Flavor text
        this.add.text(240, 130, "You defeated the Desert Boss!", {
            fontSize: "10px", fill: "#ffffff"
        }).setOrigin(0.5);

        // Display the player's completion time
        this.add.text(240, 160, `Completion Time: ${timeStr}`, {
            fontSize: "12px", fill: "#00ffff"
        }).setOrigin(0.5);

        // Restart prompt
        this.add.text(240, 210, "Press R to play again", {
            fontSize: "10px", fill: "#ffffff"
        }).setOrigin(0.5);

        // Credits
        this.add.text(240, 300, "Created by Umayr Rai", {
            fontSize: "8px", fill: "#555555"
        }).setOrigin(0.5);

        // Restart the game from Level 1 when R is pressed
        this.input.keyboard.once("keydown-R", () => {
            this.scene.start("Level1");
        });
    }
}