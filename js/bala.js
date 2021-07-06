class Bala extends MySprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites_bala');
        this.body.allowGravity = false;  
        this.speed = 20;
        this.eliminado = false;
    }


    update(time, delta) {
        if (!this.eliminado) {
            this.setVelocityY(-this.speed * delta);
        }
        if (this.y < 0) {
            this.eliminarBala();
        }
    }

    eliminarBala()
    {
        this.eliminado=true;
        this.destroy();
    }
}