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
    let firstaids;
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
        this.load.image('firstaid', 'assets/firstaid.png')
        this.load.spritesheet('dude', 'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.spritesheet('baddie', 'assets/baddie.png',
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

        baddie = this.physics.add.sprite(350, 20, 'baddie');
        baddie.setCollideWorldBounds(true);
        baddie.setBounce(0.3);

        baddietwo = this.physics.add.sprite(700, 350, 'baddie');
        baddietwo.setCollideWorldBounds(true);
        baddietwo.setBounce(0.3);

        baddiethree = this.physics.add.sprite(100, 20, 'baddie');
        baddiethree.setCollideWorldBounds(true);
        baddiethree.setBounce(0.3);

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
        this.physics.add.collider(baddiethree, ground);

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

            score += 2;
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
                    diamond.setCollideWorldBounds(true);
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

        firstaids = this.physics.add.group();
        this.physics.add.collider(firstaids, ground);

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

        function hitFirstaid(player, firstaid){
            firstaid.disableBody(true, true);

            life += 1;
            lifeText.setText('Life: ' + life);
        }

        function collectStar2 (baddie, star){
            star.disableBody(true, true);

            if (stars.countActive(true) === 0 ){
                stars.children.iterate(function (child) {
        
                    child.enableBody(true, child.x, 0, true, true);
                    
                });
                
                x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                
                let bomb = bombs.create(x, 16, 'bomb');
                    bomb.setBounce(1);
                    bomb.setCollideWorldBounds(true);
                    bomb.setVelocity(Phaser.Math.Between(-200, 200),20);
                    
                let firstaid = firstaids.create(x, 16, 'firstaid');
                    firstaid.setBounce(1);
                    firstaid.setCollideWorldBounds(true);
                    firstaid.setVelocity(Phaser.Math.Between(-200, 200),20);
                }
            
        }

        this.physics.add.collider(player, bombs, hitBomb, null, this);
        this.physics.add.overlap(player, diamonds, hitDiamond, null, this);
        this.physics.add.overlap(player, firstaids, hitFirstaid, null, this);
        this.physics.add.collider(player,baddie,hitBaddie,null,this);
        this.physics.add.collider(player,baddietwo,hitBaddie,null,this);
        this.physics.add.collider(player,baddiethree,hitBaddie,null,this);
        this.physics.add.overlap(baddie,stars,collectStar2,null,this);
        this.physics.add.overlap(baddietwo,stars,collectStar2,null,this);
        this.physics.add.overlap(baddiethree,stars,collectStar2,null,this);



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

        if ( baddie.body.touching.down && player.x > baddie.x ){
            baddie.setVelocityX(100);
            baddie.anims.play('rightBaddie', true);
        }
        else if ( baddie.body.touching.down && player.x < baddie.x ){
            baddie.setVelocityX(-100);
            baddie.anims.play('leftBaddie', true);
        }

        if ( baddietwo.body.touching.down && player.x > baddietwo.x ){
            baddietwo.setVelocityX(80);
            baddietwo.anims.play('rightBaddie', true);
        }
        else if ( baddietwo.body.touching.down && player.x < baddietwo.x ){
            baddietwo.setVelocityX(-80);
            baddietwo.anims.play('leftBaddie', true);
        }

        if ( baddiethree.body.touching.down && player.x > baddiethree.x ){
            baddiethree.setVelocityX(60);
            baddiethree.anims.play('rightBaddie', true);
        }
        else if ( baddiethree.body.touching.down && player.x < baddiethree.x ){
            baddiethree.setVelocityX(-60);
            baddiethree.anims.play('leftBaddie', true);
        }

    }

}());