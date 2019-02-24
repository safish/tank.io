import planck from 'planck-js'

const
  PTM = 32,
  world = planck.World(planck.Vec2(0, 0)),
  step = 1 / PTM

function update() {
  for (let body = world.getBodyList(); body; body = body.getNext()) {
    if (!body.node) continue
    const
      node = body.node,
      point = body.getPosition()

    node.x = point.x * PTM
    node.y = point.y * PTM
    node.rotation = body.getAngle()
  }
  world.step(step)
}

world.on('begin-contact', contact => {
  const
    bodyA = contact.getFixtureA().getBody(),
    bodyB = contact.getFixtureB().getBody()
  bodyA.collidable && bodyA.node.emit('begin-contact', bodyA, bodyB, contact)
  bodyB.collidable && bodyB.node.emit('begin-contact', bodyB, bodyA, contact)
})

PIXI.DisplayObject.prototype.addBody = function(option={}) {
  const
    position = option.position || this.position,
    body = world.createBody({
      type: getValue(option.type, planck.Body.DYNAMIC),
      position: planck.Vec2(position.x * step, position.y * step),
      ...option
    })

  body.collidable = !!option.collidable

  /* not good, but ok */
  body.node = this
  this.body = body
  return body
}

planck.Body.prototype.addCircle = function(option) {
  this.createFixture(
    planck.Circle(option.r * step),
    {density: 1, ...option}
  )
  return this
}

planck.Body.prototype.addBox = function(option) {
  this.createFixture(
    planck.Box(
      option.width * .5 * step,
      getValue(option.height, option.width) * .5 * step,
      option.center ? planck.Vec2(option.center.x * step, option.center.y * step) : null,
      option.angle
    ),
    {density: 1, ...option}
  )

  return this
}

planck.Body.prototype.destroy = function() {
  this.node ? (this.node.body = null, this.node = null) : null
  world.destroyBody(this)
}

planck.Body.prototype.addChain = function(option) {
  this.createFixture(
    planck.Chain(
      option.points.map(point => planck.Vec2(point.x * step, point.y * step)),
      !!option.loop
    ),
    {density: 1, ...option}
  )
}

planck.Body.prototype.addPolygon = function(option) {
  option.groups.forEach(vertices => {
    this.createFixture(
      planck.Polygon(vertices.map(point => planck.Vec2(point.x * step, point.y * step))),
      {density: 1, ...option}
    )
  })
  return this
}

planck.Body.prototype.createPrismaticJoint = function(option) {
  option.anchor = option.anchor ? planck.Vec2(option.anchor.x * step, option.anchor.y * step) : null
  option.lowerTranslation = option.lowerTranslation ? option.lowerTranslation * step : null
  option.upperTranslation = option.upperTranslation ? option.upperTranslation * step : null
  option.maxMotorForce = option.maxMotorForce ? option.maxMotorForce * step : null
  option.motorSpeed = option.motorSpeed ? option.motorSpeed * step : null

  world.createJoint(
    planck.PrismaticJoint(
      option,
      this,
      option.other,
      option.anchor,
      option.axis
    )
  )

  return this
}

planck.Body.prototype.createRevoluteJoint = function(option) {
  option.anchor = option.anchor ? planck.Vec2(option.anchor.x * step, option.anchor.y * step) : null
  option.motorSpeed = option.motorSpeed ? option.motorSpeed * step : null
  option.maxMotorTorque = option.maxMotorTorque ? option.maxMotorTorque * step : null

  world.createJoint(
    planck.RevoluteJoint(
      option,
      this,
      option.other,
      option.anchor
    )
  )

  return this
}

function getValue(v, e) {
  return v === undefined || v === null ? e : v
}

export {
  update,
  PTM
}