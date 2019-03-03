export default class extends PIXI.Sprite {

  constructor({frame, rotation, speed, position}) {
    super(PIXI.Texture.from(frame))
    this.speed = speed
    this.rotation = rotation
    this.destroyed = false

    this.position.copy(position)
    this.anchor.set(.5)

    this
      .addBody({
        interactive: true,
        linearVelocity: {
          x: -Math.sin(this.rotation) * this.speed,
          y: Math.cos(this.rotation) * this.speed
        },
        angle: this.rotation
      })
      .addBox({
        isSensor: true,
        width: this.width,
        height: this.height
      })

    this.on('begin-contact', (self, other) => {
      if (other.node && other.node.tag === 'tank' &&
        other.node.id !== this.tag) {
        self.node.destroy()
        other.node.hurt()
      }
    })
  }

  destroy(){
    super.destroy({children: true})
    this.destroyed = true
    this.body.destroy()
  }
}