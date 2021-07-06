class Esfera extends MySprite {
    constructor(scene, x, y, nivel) {
        super(scene, x, y, 'sprites_esfera');
        this.nivelEsfera = nivel;
        this.eliminada=false;

        this.setScale(0.3 * nivel);

        this.setCircle(66);
        this.setBounce(1);

        this.setVelocity(150);
    }
}