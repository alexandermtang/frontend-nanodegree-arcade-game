// constants
var ROW_HEIGHT = 83;
var COL_WIDTH = 101;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = -COL_WIDTH;
    this.dx = (Math.random() * 400) + 150;
    this.y = [58, 141, 224][Math.floor(Math.random() * 3)];
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x + (this.dx * dt) < 6 * COL_WIDTH) {
        this.x += this.dx * dt;
    } else {
        this.x = -2 * COL_WIDTH;
        this.dx = (Math.random() * 400) + 150;
        this.y = [58, 141, 224][Math.floor(Math.random() * 3)];
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = 2 * COL_WIDTH;
    this.y = 5 * ROW_HEIGHT - 25;
    this.score = 0;
    this.invincible = false;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dt) {
    var that = this;

    allEnemies.forEach(function(enemy) {
        if (enemy.y === that.y &&
            that.x + COL_WIDTH - 25 > enemy.x &&
            enemy.x + COL_WIDTH > that.x + 25) {
            if (player.invincible) {
                enemy.x = -2 * COL_WIDTH;
                enemy.dx = (Math.random() * 400) + 150;
                enemy.y = [58, 141, 224][Math.floor(Math.random() * 3)];
            } else {
                that.y = 5 * ROW_HEIGHT - 25;
            }
        }
    });

    // win game
    if (this.y < 0) {
        this.y = 5 * ROW_HEIGHT - 25;
        this.score += 1;
        player.invincible = false;
        if (!star.isRendered) star = new Star();
    }

    if (this.x === star.x &&
        this.y === star.y - 10) {
        player.invincible = true;
        star.isRendered = false;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(dir) {
    switch(dir) {
        case 'left':
            if (this.x - COL_WIDTH < 0 || (
                this.x - COL_WIDTH === rock.x &&
                this.y === rock.y
            )) return;
            this.x -= COL_WIDTH;
            break;
        case 'up':
            if (this.x === rock.x &&
                this.y - ROW_HEIGHT === rock.y
            ) return;
            this.y -= ROW_HEIGHT;
            break;
        case 'right':
            if (this.x + COL_WIDTH > 5 * COL_WIDTH || (
                this.x + COL_WIDTH === rock.x &&
                this.y === rock.y
            )) return;
            this.x += COL_WIDTH;
            break;
        case 'down':
            if (this.y + ROW_HEIGHT > 415 || (
                this.x === rock.x &&
                this.y + ROW_HEIGHT === rock.y
            )) return;
            this.y += ROW_HEIGHT;
            break;
    }
};

var Rock = function() {
    this.x = Math.floor(Math.random() * 6) * COL_WIDTH;
    this.y = 4 * ROW_HEIGHT - 25;
    this.sprite = 'images/rock.png';
};

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Star = function() {
    this.x = Math.floor(Math.random() * 6) * COL_WIDTH;
    this.y = ROW_HEIGHT - 15;
    this.isRendered = true;
    this.sprite = 'images/Star.png'
};

Star.prototype.render = function() {
    if (this.isRendered) ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];
var player = new Player();
var rock = new Rock();
var star = new Star();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
