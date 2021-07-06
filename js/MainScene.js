
class MainScene extends Phaser.Scene {

    //Se coloca un nombre para realizar el reiniciado del nivel
    constructor() {
        super("main");
    }

    //objetos precargados en el nivel.
    preload() {
        this.load.image('tiles', 'res/Map/Tileset.png');
        this.load.tilemapTiledJSON('map', 'res/Map/Map.json');
        this.load.image('background', 'res/skyline-a-long.png');
        this.load.atlas('sprites_jugador', 'res/Player/player.png',
            'res/Player/player_atlas.json');
        this.load.image('sprites_bala', 'res/bala.png');
        this.load.image('sprites_esfera', 'res/Esfera.png');
        this.load.image('sprites_return', 'res/return.png');

    }

    create() {
        this.add.image(0, this.scale.height, 'background').setOrigin(0, 1)
        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('Plataforma', 'tiles');
        this.layer = map.createLayer('Piso', tiles, 0, 0);
        //enable collisions for every tile
        this.layer.setCollisionByExclusion(-1, true);

        this.nivel = 2;

        this.player = new Player(this, 400, 480);
        this.physics.add.collider(this.player, this.layer);

        this.esferas = [];
        this.cargarEsferas(this.nivel, 3);

        this.puntajeText = this.add.text(35, 10, 'Puntaje: ' + this.player.puntaje, {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'verdana, arial, sans-serif'
        });

        this.vidasText = this.add.text(35, 40, 'Vida x ' + this.player.countVida, {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'verdana, arial, sans-serif'
        });

        this.levelText = this.add.text(35, 70, 'Level ' + (this.nivel-1), {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'verdana, arial, sans-serif'
        });

    }

    //MOvimiento de player
    update(time, delta) {
        this.player.update(time, delta);
        this.nextLevel();
    }

    cargarEsferas(cantidad, nivel, esferaPadre = undefined) {

        let x = 100;
        let y = 240;

        if (esferaPadre != undefined) {
            x = esferaPadre.x;
            y = esferaPadre.y;
        }

        for (let i = 0; i < cantidad; i++) {
            let esfera = new Esfera(this, (x + (i * 100 / nivel)), y, nivel);
            this.physics.add.collider(esfera, this.layer);
            this.physics.add.collider(esfera, this.esferas);
            this.esferas.push(esfera);
        }

        this.physics.add.overlap(this.player, this.esferas, this.deadPlayer, null, this);
    }

    incrementarPuntaje(mount) {
        this.player.puntaje += mount;
        this.puntajeText.text = 'Puntaje: ' + this.player.puntaje;
    }

    resetLevel() {
        this.player.setPosition(400, 480);
        for (let i = 0; i < this.esferas.length; i++) {
            this.esferas[i].destroy();
        }
        this.esferas = [];
        this.cargarEsferas(this.nivel, 3);
    }

    deadPlayer(player, esfera) {
        this.player.countVida--;
        if (this.player.countVida > 0) {
            this.vidasText.text = 'Vida x ' + this.player.countVida;
            this.resetLevel();
        }
        else {
            this.player.countVida = 0;
            this.gameOver();
        }

    }

    gameOver() {
        this.vidasText.text = 'Vida: ' + this.player.countVida;
        this.viewMesaje("Game Over")
    }

    viewMesaje(mensaje) {
        //Texto de Game Over o Finish
        var gameOverText = this.add.text(400, 200, mensaje, {
            fontSize: '70px',
            fill: '#fff',
            fontFamily: 'verdana, arial, sans-serif'
        }).setOrigin(0.5);

        //Boton replay para reiniciar el juego.
        var returnButton = this.add.sprite(400, 280, 'sprites_return').setOrigin(0.5);
        returnButton.setScale(0.30);

        returnButton.setInteractive();
        returnButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, function () {
            this.scene.scene.start("main");
        });

        this.player.speed = 0;
        this.player.visible = false;
    }

    nextLevel() {
        let nextlevel = true;
        for (let i = 0; i < this.esferas.length; i++) {
            if (!this.esferas[i].eliminada) {
                nextlevel = false;
                break;
            }

        }
        if (nextlevel) {
            this.nivel++;
            this.levelText.text = 'Level ' + (this.nivel-1);
            this.resetLevel();
        }
    }

}