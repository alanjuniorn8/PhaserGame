(function () {
    let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    let game = new Phaser.Game(config);
    let ground;
    let player;
    let cursors;
    let stars;
    let baddie;
    let baddietwo;
    let bombs;
    let diamonds;
    let score = 0;
    let scoreText;
    let life = 3;
    let lifeText;
    let x;

    function preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('diamond', 'assets/diamond.png')
        this.load.spritesheet('dude', 'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.spritesheet('baddie', 'assets/baddie.png',
            { frameWidth: 32, frameHeight: 32 }
        );
        this.load.spritesheet('baddietwo', 'assets/baddie.png',
            { frameWidth: 32, frameHeight: 32 }
        );
    }

    function create() {
        this.add.image(400, 300, 'sky');

        ground = this.physics.add.staticGroup();

        ground.create(400, 570, 'platform').setScale(2).refreshBody();

        ground.create(600, 400, 'platform');
        ground.create(50, 250, 'platform');

        player = this.physics.add.sprite(100, 450, 'dude');
        player.setCollideWorldBounds(true);
        player.setBounce(0.3);

        baddie = this.physics.add.sprite(20, 200, 'baddie');
        baddie.setCollideWorldBounds(false);
        baddie.setBounce(0.3);

        baddietwo = this.physics.add.sprite(780, 0, 'baddie');
        baddietwo.setCollideWorldBounds(false);
        baddietwo.setBounce(0.3);
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'leftBaddie',
            frames: this.anims.generateFrameNumbers('baddie', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'rightBaddie',
            frames: this.anims.generateFrameNumbers('baddie', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        
        this.physics.add.collider(player, ground);
        this.physics.add.collider(baddie, ground);
        this.physics.add.collider(baddietwo, ground);

        cursors = this.input.keyboard.createCursorKeys();

        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        this.physics.add.collider(stars, ground);

        function collectStar(player, star) {
            star.disableBody(true, true);

            score += 1;
            scoreText.setText('Score: ' + score);

            if (stars.countActive(true) === 0 ){
                stars.children.iterate(function (child) {
        
                    child.enableBody(true, child.x, 0, true, true);
        
                });
                
                x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                
                let bomb = bombs.create(x, 16, 'bomb');
                    bomb.setBounce(1);
                    bomb.setCollideWorldBounds(true);
                    bomb.setVelocity(Phaser.Math.Between(-200, 200),20);
                
                let diamond = diamonds.create(x, 16, 'diamond');
                    diamond.setBounce(0.9);
                    diamond.setCollideWorldBounds(false);
                    diamond.setVelocity(Phaser.Math.Between(-200, 200), 20);
                }
            
        }

        this.physics.add.overlap(player, stars, collectStar, null, this);

        scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        lifeText = this.add.text(684, 18, 'Life: 3', { fontSize: '24px', fill: '#000' });

        bombs = this.physics.add.group();
        this.physics.add.collider(bombs, ground);

        diamonds = this.physics.add.group();
        this.physics.add.collider(diamonds, ground);

        function hitBomb(player, bomb) {
            bomb.disableBody(true, true);

            life -= 1;
            lifeText.setText('Life: ' + life);

        }

        function hitDiamond(player, diamond){
            diamond.disableBody(true, true);

            score += 5;
            scoreText.setText('Score: ' + score);
        }

        function hitBaddie(player, baddie){
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
        }

        this.physics.add.collider(player, bombs, hitBomb, null, this);
        this.physics.add.overlap(player, diamonds, hitDiamond, null, this);
        this.physics.add.collider(player,baddie,hitBaddie,null,this);
        this.physics.add.collider(player,baddietwo,hitBaddie,null,this);
        this.physics.add.overlap(baddie,stars,collectStar,null,this);
        this.physics.add.overlap(baddietwo,stars,collectStar,null,this);

    }



    function update() {

        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }
        
        if (cursors.up.isDown && player.body.touching.down ) {
            player.setVelocityY(-330);
        }
        else if (cursors.down.isDown) {
            player.setVelocityY(330);
        }
        

        if (life === 0){
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
        }

        if ( life>=1 && baddie.x <= 400 && baddie.body.touching.down){
            baddie.setVelocityX(80);
            baddie.anims.play('rightBaddie', true);
        }

        if ( life>=1 && baddietwo.x >= 400 && baddietwo.body.touching.down){
            baddietwo.setVelocityX(-80);
            baddietwo.anims.play('leftBaddie', true);
        }


    }

}());