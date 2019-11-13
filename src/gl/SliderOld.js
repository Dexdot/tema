import { TweenMax, Power2 } from 'gsap'
import loop from '@/scripts/loop'

let THREE = null

export default class Slider {
  constructor(props) {
    const { selector, images, three } = props
    THREE = three
    this.images = images

    // this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
    //   navigator.userAgent
    // )

    // Scene
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      95,
      window.innerWidth / window.innerHeight,
      0.1,
      60000
      // this.isMobile ? 750 : 60000
    )
    this.scene.background = new THREE.Color(0x000000)

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.shadowMap.enabled = true
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.focus = new THREE.Vector3(2999, 1000, 23876)

    // Options
    this.container = document.querySelector(selector)
    this.time = 18.95
    this.index = 3
    this.spheres = []
    this.moving = false
    this.last = null

    // Settings
    this.settings = {
      reflectivity: 0.5,
      metalness: 0.5,
      progress: 1,
      animtime: 5,
      roughness: 0.5,
      uWiggleScale: 0.14,
      uWiggleDisplacement: 10.995,
      uWiggleSpeed: 0.001,
      refractionRatio: 0.93,
      dispersionSamples: 30,
      dispersionBlendMultiplier: 6,
      dispersion: 0.8,
      mRefractionRatio: 1.0,
      mFresnelBias: 1,
      mFresnelPower: 2.0,
      mFresnelScale: 1.0,
      bgcolor: '#' + this.scene.background.getHexString()
    }

    // Scene params
    this.sceneParams = {
      // VK
      0: {
        slug: 'vk',
        title: 'VK',
        x: -17204,
        y: 1000,
        z: 23876,
        uniformsOut: {
          cubeMap: this.images['vk']
        }
      },
      // AIR ENERGY
      1: {
        slug: 'air-energy',
        title: 'Air Energy',
        x: -7776,
        y: 4346,
        z: 11754,
        uniformsOut: {
          cubeMap: this.images['air-energy']
        }
      },
      // LEGENDA
      2: {
        slug: 'legenda',
        title: 'Legenda',
        x: 305,
        y: -1715,
        z: 2999,
        uniformsOut: {
          cubeMap: this.images['legenda']
        }
      },
      // TWP
      3: {
        slug: 'twp',
        title: 'TWP',
        x: 2999,
        y: -400,
        z: 0,
        uniformsOut: {
          cubeMap: this.images['twp']
        }
      },
      // ENERGOTEK
      4: {
        slug: 'energotek',
        title: 'Energotek',
        x: 305,
        y: 1652,
        z: -2600,
        uniformsOut: {
          cubeMap: this.images['energotek']
        }
      },
      // CHE Group
      5: {
        slug: 'che-group',
        title: 'Che Group',
        x: -4009,
        y: -3062,
        z: -7776,
        uniformsOut: {
          cubeMap: this.images['che-group']
        }
      },
      // NEUROHIVE
      6: {
        slug: 'neurohive',
        title: 'Neurohive',
        x: -7776,
        y: 1600,
        z: -16531,
        uniformsOut: {
          cubeMap: this.images['neurohive']
        }
      }
    }

    this.arrB = []
    this.arrCurves = []
    this.arrOrbits = []

    // Append renderer into container
    this.container.appendChild(this.renderer.domElement)

    this.rtParameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBuffer: true
    }

    this.filmParams = {
      noiseIntensity: 0.35,
      scanlinesIntensity: 0.025,
      scanlinesCount: 648,
      grayscale: false
    }

    this.composerScene = new THREE.EffectComposer(
      this.renderer,
      new THREE.WebGLRenderTarget(
        window.innerWidth * 2,
        window.innerHeight * 2,
        this.rtParameters
      )
    )

    this.effectFilm = new THREE.FilmPass(
      this.filmParams.noiseIntensity,
      this.filmParams.scanlinesIntensity,
      this.filmParams.scanlinesCount,
      this.filmParams.grayscale
    )

    this.renderPass = new THREE.RenderPass(this.scene, this.camera)
    this.composerScene.addPass(this.renderPass)
    this.composerScene.addPass(this.effectFilm)

    this.raycaster = new THREE.Raycaster()

    this.mouse = new THREE.Vector2()

    // Add event listeners
    this.initEvents()

    this.fShader = THREE.FresnelShader

    // Camera position
    // this.camera.position.z = 1642
    // this.camera.position.set(7277, 634, 27)
    this.camera.lookAt(this.scene.position)

    this.bigtestgeometry = new THREE.IcosahedronGeometry(500, 4)

    // MESH
    for (let i = 0; i < 7; i++) {
      let meshBMaterial = new THREE.ShaderMaterial({
        defines: {
          DISPERSION_SAMPLES: 20
        },
        uniforms: {
          mRefractionRatio: { type: 'f', value: 1.02 },
          mFresnelBias: { type: 'f', value: 1.0 },
          mFresnelPower: { type: 'f', value: 2.0 },
          mFresnelScale: { type: 'f', value: 1.0 },
          time: { type: 'f', value: 9.95 },
          progress: { type: 'f', value: 1.0 },
          uWiggleScale: { type: 'f', value: 0.14 },
          uWiggleDisplacement: { type: 'f', value: 0.01 },
          uWiggleSpeed: { type: 'f', value: 0.001 },
          refractionRatio: { type: 'f', value: 0.93 },
          dispersion: { type: 'f', value: 0.8 },
          dispersionBlendMultiplier: { type: 'f', value: 6.0 },
          cameraPosition: { value: this.camera.position },
          tCube: {
            type: 't',
            value: new THREE.CubeTextureLoader().load(
              [
                this.sceneParams[i].uniformsOut.cubeMap,
                this.sceneParams[i].uniformsOut.cubeMap,
                this.sceneParams[i].uniformsOut.cubeMap,
                this.sceneParams[i].uniformsOut.cubeMap,
                this.sceneParams[i].uniformsOut.cubeMap,
                this.sceneParams[i].uniformsOut.cubeMap
              ],
              () => {
                if (i === 6) {
                  this.container.dispatchEvent(new Event('init-complete'))
                }
              }
            )
          }
        },
        vertexShader: this.fShader.vertexShader,
        fragmentShader: this.fShader.fragmentShader
      })

      let meshB = new THREE.Mesh(this.bigtestgeometry, meshBMaterial)
      meshBMaterial.maxScaleHover =
        meshBMaterial.uniforms.uWiggleScale.value + 0.075

      let x = Math.cos((2 * Math.PI * i) / 7) * 6000 + 0
      let y = Math.sin((2 * Math.PI * i) / 7) * 6000 + 0

      let OCurveStartVectot = new THREE.Vector3(
        Math.cos((2 * Math.PI * (i - 0.1)) / 7) * 7100 + 0,
        meshB.position.y + 300,
        Math.sin((2 * Math.PI * (i - 0.1)) / 7) * 7100 + 0
      )
      let OCurveControlVevtor = new THREE.Vector3(
        Math.cos((2 * Math.PI * i) / 7) * 7100 + 0,
        meshB.position.y + 300,
        Math.sin((2 * Math.PI * i) / 7) * 7100 + 0
      )
      let OCurveEndVector = new THREE.Vector3(
        Math.cos((2 * Math.PI * (i + 0.1)) / 7) * 7100 + 0,
        meshB.position.y + 300,
        Math.sin((2 * Math.PI * (i + 0.1)) / 7) * 7100 + 0
      )

      let LCurveControlVector = new THREE.Vector3(
        Math.cos((2 * Math.PI * (i + 0.5)) / 7) * 10000 + 0,
        meshB.position.y + 300,
        Math.sin((2 * Math.PI * (i + 0.5)) / 7) * 10000 + 0
      )

      this.arrOrbits.push(
        new THREE.QuadraticBezierCurve3(
          OCurveStartVectot,
          OCurveControlVevtor,
          OCurveEndVector
        )
      )

      this.arrCurves.push(LCurveControlVector)

      meshB.position.set(x, 300, y)
      meshB.lookAt(this.scene.position)

      this.arrB.push(meshB)

      this.scene.add(meshB)
    }

    for (let i = 0; i < 7; i++) {
      this.arrB[
        i
      ].material.uniforms.uWiggleScale.value = this.settings.uWiggleScale
      this.arrB[
        i
      ].material.uniforms.uWiggleDisplacement.value = this.settings.uWiggleDisplacement
      this.arrB[
        i
      ].material.uniforms.uWiggleSpeed.value = this.settings.uWiggleSpeed

      this.arrB[
        i
      ].material.uniforms.mRefractionRatio.value = this.settings.mRefractionRatio
      this.arrB[
        i
      ].material.uniforms.mFresnelBias.value = this.settings.mFresnelBias
      this.arrB[
        i
      ].material.uniforms.mFresnelPower.value = this.settings.mFresnelPower
      this.arrB[
        i
      ].material.uniforms.mFresnelScale.value = this.settings.mFresnelScale
      this.arrB[
        i
      ].material.uniforms.refractionRatio.value = this.settings.refractionRatio
      this.arrB[i].material.uniforms.dispersion.value = this.settings.dispersion
      this.arrB[
        i
      ].material.uniforms.dispersionBlendMultiplier.value = this.settings.dispersionBlendMultiplier
    }

    this.light = new THREE.PointLight(0xff0000, 0.8, 500)
    this.light.position.set(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z
    )
    this.scene.add(this.light)
    this.camera.position.set(
      this.arrOrbits[this.index].getPointAt(0.5).x,
      this.arrOrbits[this.index].getPointAt(0.5).y,
      this.arrOrbits[this.index].getPointAt(0.5).z
    )
    this.camera.lookAt(this.scene.position)

    this.start()
  }

  initEvents() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false)

    this.container.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this),
      false
    )
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.container.width = window.innerWidth
    this.container.height = window.innerHeight

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate() {
    this.time += 0.001

    for (let i = 0; i < 7; i++) {
      this.arrB[i].material.uniforms.time.value = this.time
      this.arrB[i].rotation.x += 0.001
    }

    this.composerScene.render(0.01)
  }

  start() {
    loop.add(this.animate.bind(this), 'slider')
  }

  pause() {
    loop.remove('slider', true)
  }

  destroy() {
    this.pause()

    // Remove listeners
    window.removeEventListener('resize', this.onWindowResize)
    this.container.removeEventListener('mousemove', this.onMouseMove)

    // Remove container and canvas
    this.container.remove()
  }

  onMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, this.camera)

    if (!this.moving) {
      TweenMax.to(this.camera.position, 1, {
        ease: Power2.easeOut,
        x: this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x * 0.1).x,
        z: this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x * 0.1).z,
        y: this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x * 0.1).y,
        onUpdate: () => {
          this.camera.lookAt(this.scene.position)
        }
      })
    }

    // Calculate objects intersecting the picking ray
    var intersects = this.raycaster.intersectObjects(this.scene.children)

    if (intersects.length == 0) {
      if (this.last != null) {
        TweenMax.to(this.last.uniforms.dispersion, 2, {
          value: 0.8,
          ease: Power2.easeOut
        })

        TweenMax.to(this.last.uniforms.refractionRatio, 2, {
          value: 0.93,
          ease: Power2.easeOut
        })

        const tmpConst = this.last.maxScaleHover - 0.075

        TweenMax.to(this.last.uniforms.uWiggleScale, 2, {
          value: tmpConst,
          ease: Power2.easeInOut
        })

        this.last = null
      }
    }

    if (intersects.length > 0 && intersects[0].object.name != 'text') {
      if (
        this.last != null &&
        this.last.uuid != intersects[0].object.material.uuid
      ) {
        TweenMax.to(this.last.uniforms.dispersion, 2, {
          value: 0.8,
          ease: Power2.easeInOut
        })

        TweenMax.to(this.last.uniforms.refractionRatio, 2, {
          value: 0.93,
          ease: Power2.easeOut
        })

        const tmpConstP = this.last.maxScaleHover - 0.075

        TweenMax.to(this.last.uniforms.uWiggleScale, 2, {
          value: tmpConstP,
          ease: Power2.easeInOut,
          onComplete: () => {}
        })
        this.last = intersects[0].object.material

        TweenMax.to(intersects[0].object.material.uniforms.dispersion, 2, {
          value: 1,
          ease: Power2.easeInOut
        })

        TweenMax.to(intersects[0].object.material.uniforms.refractionRatio, 2, {
          value: 1,
          ease: Power2.easeOut
        })

        const tmpConstM = intersects[0].object.material.maxScaleHover

        TweenMax.to(intersects[0].object.material.uniforms.uWiggleScale, 2, {
          value: tmpConstM,
          ease: Power2.easeInOut
        })
      }

      if (this.last == null) {
        this.last = intersects[0].object.material

        TweenMax.to(intersects[0].object.material.uniforms.dispersion, 2, {
          value: 1,
          ease: Power2.easeInOut
        })

        TweenMax.to(intersects[0].object.material.uniforms.refractionRatio, 2, {
          value: 1,
          ease: Power2.easeOut
        })

        TweenMax.to(intersects[0].object.material.uniforms.uWiggleScale, 2, {
          value: intersects[0].object.material.maxScaleHover,
          ease: Power2.easeInOut
        })
      }
    }
  }

  animateCurve({ curvesIndex, orbitsIndex, floatIndex, onComplete }) {
    this.moving = true

    let curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z
      ),
      this.arrCurves[curvesIndex],
      new THREE.Vector3(
        this.arrOrbits[orbitsIndex].getPointAt(0.5).x,
        this.arrOrbits[orbitsIndex].getPointAt(0.5).y,
        this.arrOrbits[orbitsIndex].getPointAt(0.5).z
      )
    )

    TweenMax.to(floatIndex, 2, {
      ease: Power2.easeInOut,
      value: 1,
      onComplete: () => {
        onComplete()
        this.moving = false
      },
      onUpdate: () => {
        this.camera.lookAt(this.scene.position)
        this.camera.position.set(
          curve.getPointAt(floatIndex.value).x,
          curve.getPointAt(floatIndex.value).y,
          curve.getPointAt(floatIndex.value).z
        )
        this.camera.lookAt(this.scene.position)
      }
    })
  }

  indexControl(direction) {
    if (this.moving) return false

    let floatIndex = { value: 0 }
    let materialChanged = false

    const dispatch = i => {
      const ev = new CustomEvent('slide-start', { detail: { i } })
      this.container.dispatchEvent(ev)
    }

    if (direction == 'next' && this.index < this.arrOrbits.length - 1) {
      const i = this.index + 1
      dispatch(i)

      this.animateCurve({
        floatIndex,
        curvesIndex: this.index,
        orbitsIndex: i,
        onComplete: () => {
          this.index = i
        }
      })

      if (!materialChanged) {
        for (let i = 0; i < this.arrB.length; i++) {
          if (i != this.index + 1 && i != this.index + 2 && i != this.index) {
            TweenMax.to(
              this.arrB[i].material.uniforms.dispersionBlendMultiplier,
              1,
              { value: 1 }
            )
          }
        }

        if (this.index == this.arrB.length - 2) {
          TweenMax.to(
            this.arrB[this.index + 1].material.uniforms
              .dispersionBlendMultiplier,
            1,
            { value: 6 }
          )
          TweenMax.to(
            this.arrB[0].material.uniforms.dispersionBlendMultiplier,
            1,
            { value: 4 }
          )
          TweenMax.to(
            this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,
            1,
            { value: 4 }
          )
        } else {
          TweenMax.to(
            this.arrB[this.index + 1].material.uniforms
              .dispersionBlendMultiplier,
            1,
            { value: 6 }
          )
          TweenMax.to(
            this.arrB[this.index + 2].material.uniforms
              .dispersionBlendMultiplier,
            1,
            { value: 4 }
          )
          TweenMax.to(
            this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,
            1,
            { value: 4 }
          )
        }

        materialChanged = true
      }
    }

    if (direction == 'back' && this.index > 0) {
      const i = this.index - 1
      dispatch(i)

      this.animateCurve({
        floatIndex,
        curvesIndex: i,
        orbitsIndex: i,
        onComplete: () => {
          this.index = i
        }
      })

      if (!materialChanged) {
        for (let i = 0; i < this.arrB.length; i++) {
          if (i != this.index - 1 && i != this.index - 2 && i != this.index) {
            TweenMax.to(
              this.arrB[i].material.uniforms.dispersionBlendMultiplier,
              1,
              { value: 1 }
            )
          }
        }

        if (this.index == 1) {
          TweenMax.to(
            this.arrB[this.index - 1].material.uniforms
              .dispersionBlendMultiplier,
            1,
            { value: 6 }
          )
          TweenMax.to(
            this.arrB[this.arrB.length - 1].material.uniforms
              .dispersionBlendMultiplier,
            1,
            { value: 4 }
          )
          TweenMax.to(
            this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,
            1,
            { value: 4 }
          )
        } else {
          TweenMax.to(
            this.arrB[this.index - 1].material.uniforms
              .dispersionBlendMultiplier,
            1,
            { value: 6 }
          )
          TweenMax.to(
            this.arrB[this.index - 2].material.uniforms
              .dispersionBlendMultiplier,
            1,
            { value: 4 }
          )
          TweenMax.to(
            this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,
            1,
            { value: 4 }
          )
        }

        materialChanged = true
      }
    }

    if (direction == 'next' && this.index == this.arrOrbits.length - 1) {
      const i = 0
      dispatch(i)

      this.animateCurve({
        floatIndex,
        curvesIndex: this.index,
        orbitsIndex: 0,
        onComplete: () => {
          this.index = i
        }
      })

      if (!materialChanged) {
        for (let i = 0; i < this.arrB.length; i++) {
          if (i != 0 && i != this.index && i != 1) {
            TweenMax.to(
              this.arrB[i].material.uniforms.dispersionBlendMultiplier,
              1,
              { value: 1 }
            )
          }
        }

        TweenMax.to(
          this.arrB[0].material.uniforms.dispersionBlendMultiplier,
          1,
          { value: 6 }
        )

        TweenMax.to(
          this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,
          1,
          { value: 4 }
        )

        TweenMax.to(
          this.arrB[1].material.uniforms.dispersionBlendMultiplier,
          1,
          { value: 4 }
        )

        materialChanged = true
      }
    }

    if (direction == 'back' && this.index == 0) {
      const i = this.arrOrbits.length - 1
      dispatch(i)

      this.animateCurve({
        floatIndex,
        curvesIndex: this.arrOrbits.length - 1,
        orbitsIndex: this.arrOrbits.length - 1,
        onComplete: () => {
          this.index = i
        }
      })

      if (!materialChanged) {
        for (let i = 0; i < this.arrB.length; i++) {
          if (i != this.arrB.length - 1) {
            TweenMax.to(
              this.arrB[i].material.uniforms.dispersionBlendMultiplier,
              1,
              { value: 1 }
            )
          }
        }

        TweenMax.to(
          this.arrB[this.arrB.length - 1].material.uniforms
            .dispersionBlendMultiplier,
          1,
          { value: 6 }
        )

        TweenMax.to(
          this.arrB[0].material.uniforms.dispersionBlendMultiplier,
          1,
          { value: 4 }
        )

        TweenMax.to(
          this.arrB[this.arrB.length - 2].material.uniforms
            .dispersionBlendMultiplier,
          1,
          { value: 4 }
        )

        materialChanged = true
      }
    }
  }

  inMenu() {
    this.moving = true

    TweenMax.to(this.camera.rotation, 0.8, {
      y: this.camera.rotation.y + Math.PI,
      onComplete: () => {
        this.moving = false
      }
    })
  }

  outMenu() {
    this.moving = true

    TweenMax.to(this.camera.rotation, 0.8, {
      y: this.camera.rotation.y - Math.PI,
      onComplete: () => {
        this.moving = false
      }
    })
  }
}
