(function(){

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
        preload: preload,
        create: create
    });

    function preload() {

        //  You can fill the preloader with as many assets as your game requires

        //  Here we are loading an image. The first parameter is the unique
        //  string by which we'll identify the image later in our code.

        //  The second parameter is the URL of the image (relative)

        game.load.spritesheet('invader', 'img/invader32x32x4.png', 32, 32);
        game.load.spritesheet('kaboom', 'img/explode.png', 128, 128);
        game.load.image('starfield', 'img/starfield.png');
        
    }

    var interval = 500;
    var score = 0;
    var scoreIncrement = 1;
    var scoreString = 'Score : ';
    var numberOfInvaders = 0;
    var scoreText;

    var timeouts = [];

    function create() {

        var starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
        var scoreString = 'Score : ';
        scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });
    }


    function getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomPosition(){
        var x = getRandomNumber( 0, 800 -32 );
        var y = getRandomNumber( 0, 600 -32 );
        var position = {
            x: x,
            y: y
        };
        return position;
    }

    function createExplosion( position ){
        var explosion = game.add.sprite(position.x - 32, position.y - 32, 'kaboom');
        explosion.animations.add('kaboom');
        explosion.animations.play('kaboom', 30, false, true);
    }

    function createInvader(){
        var position = getRandomPosition();

        var invader = game.add.sprite(position.x, position.y, 'invader');

        //  Enables all kind of input actions on this image (click, etc)
        invader.inputEnabled = true;
        invader.events.onInputDown.add(onClickOnInvader, this);
        numberOfInvaders++;

        if ( numberOfInvaders > 10){
            gameOver();
        }else{
            timeouts.push( setTimeout( createInvader.bind( this ), interval) );
        }
    }

    function onClickOnInvader( invader ){
        createExplosion( invader.position );
        invader.kill();
        invader.destroy();
        
        score += scoreIncrement;
        scoreIncrement++;

        interval -= 10;
        
        scoreText.text = scoreString + score;

        numberOfInvaders--;


    }

    function gameOver(){
        // cleanup 
        $('#game').remove();
        
        // clear all timeouts, if someone is left
        for (var i=0; i<timeouts.length; i++) {
            clearTimeout(timeouts[i]);
        }

        // show game over message
        $("<h1>").html("Game Over").appendTo($(document.body));
        $("<h2>").html("Final Score: " + score).appendTo($(document.body));
    
    }

    timeouts.push(setTimeout( createInvader.bind( game ), interval));
        
})();
