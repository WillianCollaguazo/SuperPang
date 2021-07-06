class Player extends MySprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites_jugador');

        //captura de tecla a presionar
        this.cursor = this.scene.input.keyboard.createCursorKeys();

        this.speed = 10;
        this.countVida = 2;
        this.puntaje = 0;

        this.direccion = false;
        this.balas = [];

        this.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 0, end: 2, prefix: 'walk_' }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 3, end: 3, prefix: 'idle_' }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'shot',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 4, end: 4, prefix: 'shot_' }),
            frameRate: 10,
            repeat: -1
        });

    }

    update(time, delta) {
        if (this.cursor.left.isDown) {
            this.setVelocityX(-this.speed * delta);
            this.setFlipX(false);
            this.direccion = false;
        }
        else if (this.cursor.right.isDown) {
            this.setVelocityX(this.speed * delta);
            this.setFlipX(true);
            this.direccion = true;
        }
        else {
            //Parado
            this.setVelocityX(0);
        }

        if (this.body.velocity.x != 0 && this.speed != 0)
            this.play('walk', true);
        else {
            if (!this.disparar) {
                this.play('idle', true);
                this.setFlipX(this.direccion);
            }
            else {
                this.time++;
                if (this.time > 15) {
                    this.disparar = false;
                    this.time = 0;
                }
            }
        }

        const ispressSpace = Phaser.Input.Keyboard.JustDown(this.cursor.space);

        if (ispressSpace) {
            this.time = 0;
            this.disparar = true;
            this.play('shot', true);
            this.setFlipX(this.direccion);
            this.dispararBala();
        }
        if (this.balas.length != 0) {
            for (let i = 0; i < this.balas.length; i++) {
                if (this.balas[i] != undefined) {
                    this.balas[i].update(time, delta);
                }
            }

        }
    }

    dispararBala() {
        if (this.visible) {
            this.balas.push(new Bala(this.scene, this.x, this.y));
            this.scene.physics.add.overlap(this.balas, this.scene.esferas, this.eliminarEsfera, null, this);
        }
    }

    eliminarEsfera(bala, esfera) {
        bala.eliminarBala();
        this.scene.incrementarPuntaje(900 / esfera.nivelEsfera);

        if (esfera.nivelEsfera > 1) {
            this.scene.cargarEsferas(2, esfera.nivelEsfera - 1, esfera);
        }
        esfera.eliminada = true;
        esfera.destroy();
    }
}