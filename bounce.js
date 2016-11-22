// mods by Patrick OReilly 
// Twitter: @pato_reilly Web: http://patricko.byethost9.com

var game = new Phaser.Game(460, 250, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render, update: update });
var balls_sprites = ['green','purple','cyan','orange','blue'];
var hlop;
var total_balls;
var balls;
var aim;

function preload() {

    game.load.image('background', 'assets/background.png');
    balls_sprites.forEach(function(item, i, arr) {
        game.load.image(item, 'assets/sprites/'+item+'.svg');
    });
    game.load.image('link', 'assets/sprites/link.svg');
    game.load.image('aim', 'assets/sprites/aim.svg');
    game.load.audio('hlop', 'assets/sound/hlop.mp3');
}

function create() {
    //game.stage.backgroundColor = Phaser.Color.getRandomColor(50, 255, 255);
    game.add.sprite(0,0,'background');

    balls = game.add.sprite(0,0,'link');
    balls_sprites.forEach(function(item, i, arr) {
        var tempSprite = game.add.sprite(0,0,item);
        tempSprite.inputEnabled = true;
        tempSprite.name = i.toString() + '-' + item;        
        tempSprite.input.pixelPerfectClick = true;
        tempSprite.events.onInputDown.add(destroySprite, this);
        balls.addChild(tempSprite);
    });
    total_balls = 5;
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.enable(balls, Phaser.Physics.ARCADE);
    //  This gets it moving
    balls.body.velocity.setTo(100,100);    
    //  This makes the game world bounce-able
    balls.body.collideWorldBounds = true;
    //  This sets the image bounce energy for the horizontal 
    //  and vertical vectors. "1" is 100% energy return
    balls.body.bounce.set(1);
    
    hlop = game.add.audio('hlop');
    
    aim = game.add.sprite(0,0,'aim');
    aim.scale.setTo(0.03, 0.03);
    aim.visible=false;
    //aim.anchor.setTo(16, 16);
    aim.pivot.x = aim.width * .5;
    aim.pivot.y = aim.height * .5;
    game.input.addMoveCallback( function(pointer, x, y) {
       // pointer is the active pointer, x and y give you the position of the pointer
       // on the canvas so here you can position you custom cursor sprite
       aim.x = x - (aim.width * .5);
       aim.y = y - (aim.height * .5);
    });
    game.input.mouse.mouseOutCallback = function() {  aim.visible=false; };
    game.input.mouse.mouseOverCallback = function() {  aim.visible=true; };
}

function destroySprite (sprite) {
    console.log('clicked',sprite.name,sprite.renderOrderID);
    hlop.play();
    sprite.destroy();
    
    if (--total_balls<=0) {        
        balls.body.bounce.set(0);
        balls.body.collideWorldBounds = false;
        balls.body.velocity.setTo(0,0);        
    }    
}

function render () {

    //debug helper
    //game.debug.spriteInfo(balls,32,32);
    //game.debug.inputInfo(32, 32);
}

function update () {    
    if ((balls!=undefined) && (total_balls<=0)) {
        if (balls.y<game.height) balls.y+=10;
        else {
            balls.destroy();
            balls = undefined;
            location.href = 'http://horoshiki.ru/?r=free';
        }
    }
}