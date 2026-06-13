class Level1 extends Phaser.Scene {
    constructor() {
        super("Level1");
    }

    create() {
        // Load and create the tilemap with ground and wall layers
        const map = this.make.tilemap({ key: "level1" });
        const tileset = map.addTilesetImage("desert", "tiles_packed");

        // Record the start time for the completion timer
        window.gameStartTime = Date.now();

        const groundLayer = map.createLayer("Ground", tileset, 0, 0);
        this.wallsLayer = map.createLayer("Walls", tileset, 0, 0);

        // Enable collision on tiles marked with collides: true in Tiled
        this.wallsLayer.setCollisionByProperty({ collides: true });

        // Set physics and camera boundaries to match the map size
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Spawn the player in the center of the map and have the camera follow them
        this.player = new Player(this, map.widthInPixels / 2, map.heightInPixels / 2);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Create groups for player bullets and enemy bullets
        this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.enemyBullets = this.physics.add.group({ classType: EnemyBullet, runChildUpdate: false });
        this.enemies = this.physics.add.group({ classType: Charger, runChildUpdate: false });

        // Build the enemy spawn queue for this level: 6 chargers, 3 shooters, 1 tank
        this.spawnQueue = [];
        for (let i = 0; i < 6; i++) this.spawnQueue.push("Charger");
        for (let i = 0; i < 3; i++) this.spawnQueue.push("Shooter");
        for (let i = 0; i < 1; i++) this.spawnQueue.push("Tank");
        Phaser.Utils.Array.Shuffle(this.spawnQueue);

        // Track how many enemies are left in total
        this.totalEnemies = this.spawnQueue.length;
        this.enemiesRemaining = this.totalEnemies;
        this.levelCleared = false;
        this.fireRate = 700;
        this.maxEnemiesOnScreen = 10;

        // Spawn the first 3 enemies immediately
        for (let i = 0; i < 3; i++) this.spawnNextEnemy();

        // Every second, spawn a new enemy from the queue if fewer than 10 are on screen
        this.spawnTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.spawnQueue.length > 0 && this.enemies.countActive() < this.maxEnemiesOnScreen) {
                    this.spawnNextEnemy();
                }
            },
            loop: true
        });

        // Wall collisions for player, enemies, and bullets
        this.physics.add.collider(this.player, this.wallsLayer);
        this.physics.add.collider(this.enemies, this.wallsLayer);
        this.physics.add.collider(this.enemies, this.enemies);

        this.physics.add.collider(this.bullets, this.wallsLayer, (bullet) => {
            if (!bullet.active) return;
            bullet.destroy();
        });

        this.physics.add.collider(this.enemyBullets, this.wallsLayer, (bullet) => {
            if (!bullet.active) return;
            bullet.destroy();
        });

        // When a player bullet hits an enemy, deal damage
        // 30% chance to heal the player by 1 HP if the enemy dies
        this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
            if (!bullet.active || !enemy.active) return;
            bullet.destroy();
            const wasAlive = enemy.active;
            enemy.takeDamage();
            if (wasAlive && !enemy.active) {
                if (Math.random() < 0.3 && this.player.health < 3) {
                    this.player.health++;
                }
            }
        });

        // When an enemy bullet hits the player, deal damage
        this.physics.add.overlap(this.player, this.enemyBullets, (player, bullet) => {
            if (!bullet.active) return;
            bullet.destroy();
            this.player.takeDamage();
        });

        // When an enemy touches the player directly, deal damage
        this.physics.add.overlap(this.player, this.enemies, () => {
            this.player.takeDamage();
        });

        // HUD - display player health and enemy count in the top left
        this.healthText = this.add.text(10, 10, "HP: 3", {
            fontSize: "8px", fill: "#ffffff"
        }).setScrollFactor(0).setDepth(10);

        this.enemyText = this.add.text(10, 20, "Enemies: " + this.enemiesRemaining, {
            fontSize: "8px", fill: "#ffffff"
        }).setScrollFactor(0).setDepth(10);

        this.shootCooldown = 0;
    }

    // Pops the next enemy type from the queue and spawns it at a random edge position
    spawnNextEnemy() {
        if (this.spawnQueue.length === 0) return;
        const type = this.spawnQueue.pop();
        const pos = this.getEdgePosition();
        let enemy;
        if (type === "Charger") enemy = new Charger(this, pos.x, pos.y);
        else if (type === "Shooter") enemy = new Shooter(this, pos.x, pos.y);
        else if (type === "Tank") enemy = new Tank(this, pos.x, pos.y);
        this.enemies.add(enemy);
    }

    // Returns a random position along one of the four map edges
    getEdgePosition() {
        const side = Phaser.Math.Between(0, 3);
        if (side === 0) return { x: Phaser.Math.Between(30, 450), y: 30 };
        if (side === 1) return { x: Phaser.Math.Between(30, 450), y: 290 };
        if (side === 2) return { x: 30, y: Phaser.Math.Between(30, 290) };
        return { x: 450, y: Phaser.Math.Between(30, 290) };
    }

    update(time, delta) {
        // Stop updating if the player is dead
        if (!this.player.active) return;

        this.player.update(delta);
        this.shootCooldown -= delta;

        // Shoot a bullet toward the mouse cursor while the mouse button is held
        if (this.input.activePointer.isDown && this.shootCooldown <= 0) {
            const pointer = this.input.activePointer;
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);
            const bullet = new Bullet(this, this.player.x, this.player.y);
            this.bullets.add(bullet);
            bullet.fire(this.player.x, this.player.y, angle);
            this.sound.play("shoot");
            this.shootCooldown = this.fireRate;
        }

        // Update each active enemy's AI
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.active) enemy.update(this.player, this.enemyBullets);
        });

        // Update the enemy counter
        const activeCount = this.enemies.countActive();
        this.enemiesRemaining = activeCount + this.spawnQueue.length;

        // Update HUD text
        this.healthText.setText("HP: " + this.player.health);
        this.enemyText.setText("Enemies: " + this.enemiesRemaining);

        // When all enemies are defeated, transition to Level 2
        if (this.enemiesRemaining === 0 && !this.levelCleared) {
            this.levelCleared = true;
            this.spawnTimer.remove();
            this.add.text(240, 160, "Moving to Next Level...", {
                fontSize: "12px", fill: "#ffffff"
            }).setOrigin(0.5).setScrollFactor(0).setDepth(10);
            this.time.delayedCall(1500, () => {
                this.scene.start("Level2");
            });
        }
    }
}