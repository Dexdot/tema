import { TweenMax, Power2 } from 'gsap'
import loop from '@/scripts/loop'

let THREE = null

export default class Slider {
  constructor(props) {
    const { selector, images, three } = props
    THREE = three
    this.images = images
    this.selector = selector

    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
      navigator.userAgent
    )
    this.adaptMode = false

    // Scene
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      95,
      window.innerWidth / window.innerHeight,
      0.1,
      this.isMobile ? 10000 : 6000
    )
    this.insideCamera = new THREE.PerspectiveCamera(
      this.isMobile ? 95 : 75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    )

    this.scene.background = new THREE.Color(0x020202)

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.shadowMap.enabled = true
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.fShader = THREE.FresnelShader
    this.font = null

    this.about = null
    this.works = null
    this.contact = null
    this.tCubes = []

    // Scene params
    this.sceneParams = {
      // VK
      0: {
        slug: 'vk',
        name: 'VK',
        uniformsOut: {
          cubeMap: this.images['vk']
        }
      },
      // AIR ENERGY
      1: {
        slug: 'air-energy',
        name: 'Air Energy',
        uniformsOut: {
          cubeMap: this.images['air-energy']
        }
      },
      // LEGENDA
      2: {
        slug: 'legenda',
        name: 'Legenda',
        uniformsOut: {
          cubeMap: this.images['legenda']
        }
      },
      // TWP
      3: {
        slug: 'twp',
        name: 'TWP',
        uniformsOut: {
          cubeMap: this.images['twp']
        }
      },
      // ENERGOTEK
      4: {
        slug: 'energotek',
        name: 'Energotek',
        uniformsOut: {
          cubeMap: this.images['energotek']
        }
      },
      // CHE Group
      5: {
        slug: 'che-group',
        name: 'Che Group',
        uniformsOut: {
          cubeMap: this.images['che-group']
        }
      },
      // NEUROHIVE
      6: {
        slug: 'neurohive',
        name: 'Neurohive',
        uniformsOut: {
          cubeMap: this.images['neurohive']
        }
      }
    }

    this.loadResources()
  }

  loadResources() {
    let resCounter = 0

    for (let i in this.sceneParams) {
      let url = this.sceneParams[i].uniformsOut.cubeMap

      this.sceneParams[
        i
      ].uniformsOut.tCube = new THREE.CubeTextureLoader().load(
        Array(6).fill(url),
        () => {
          resCounter++
        }
      )
    }
    let oceanMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.OceanShader.uniforms,
      vertexShader: THREE.OceanShader.vertexShader,
      fragmentShader: THREE.OceanShader.fragmentShader,
      side: THREE.DoubleSide,
      transparent: true
    })

    const fontJson = require('@/assets/Wooland.json')

    const font = new THREE.Font(fontJson)

    // let fontLoader = new THREE.FontLoader()

    // fontLoader.load("@/assets/Wooland.json", font => {
    this.font = font

    const getFontGeometry = (text, size = 150) => {
      return new THREE.TextBufferGeometry(text, {
        font,
        size,
        height: 1,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      })
    }

    // About
    this.about = new THREE.Mesh(getFontGeometry('About'), oceanMaterial.clone())
    this.about.name = 'about'

    // Works
    this.works = new THREE.Mesh(getFontGeometry('Works'), oceanMaterial.clone())
    this.works.name = 'works'

    // Contact
    this.contact = new THREE.Mesh(
      getFontGeometry('Contact'),
      oceanMaterial.clone()
    )
    this.contact.name = 'contact'

    // Neurohive
    this.oceanText = new THREE.Mesh(
      getFontGeometry('Neurohive', 30),
      oceanMaterial
    )
    this.oceanText.animating = false
    this.menuTime = { about: 0, works: 0, contact: 0 }

    resCounter++
    // });

    let interval
    interval = setInterval(() => {
      if (resCounter == 8) {
        clearInterval(interval)
        this.init()
      }
    }, 100)
  }

  init() {
    this.focus = new THREE.Vector3(0, 0, 0)
    this.time = 17
    this.index = 3
    this.spheres = []
    this.moving = false
    this.last = null

    this.oldTime = 0
    this.newTime = 0
    this.isTouchPad
    this.eventCount = 0
    this.eventCountStart

    this.TGroup = new THREE.Group()
    this.fovard = 0.001
    this.insideSphere = null
    this.target = new THREE.Vector3(350, 20, 0)

    this.settings = {
      reflectivity: 0.5,
      metalness: 0.5,
      progress: 1,
      animtime: 5,
      roughness: 0.5,
      uWiggleScale: 0.241,
      uWiggleDisplacement: 10.995,
      uWiggleSpeed: 0.125,
      refractionRatio: 0.93,
      dispersionSamples: 30,
      dispersionBlendMultiplier: 3,
      dispersion: 0.8,
      mRefractionRatio: 1.0,
      mFresnelBias: 1,
      mFresnelPower: 2.0,
      mFresnelScale: 1.0,
      bgcolor: '#' + this.scene.background.getHexString()
    }

    this.arrB = []
    this.arrCurves = []
    this.arrOrbits = []

    this.fontSettings = {
      size: 80,
      height: 5,
      curveSegments: 12,
      bevelEnabled: false,
      bevelThickness: 10,
      bevelSize: 8,
      bevelOffset: 0,
      bevelSegments: 5
    }

    this.container = document.querySelector(this.selector)
    this.container.appendChild(this.renderer.domElement)

    this.rtParameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBuffer: true
    }

    this.caseParams = {
      frequency1: 0.035,
      amplitude1: 20.0,
      frequency2: 0.025,
      amplitude2: 70.0
    }

    this.raycaster = new THREE.Raycaster()

    this.mouse = new THREE.Vector2()

    this.initEvents()

    this.camera.lookAt(this.scene.position)
    this.textPositions = []

    this.inMenu = false

    this.bigtestgeometry = new THREE.IcosahedronGeometry(500, 4)

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
          uWiggleScale: { type: 'f', value: 0.241 },
          uWiggleDisplacement: { type: 'f', value: 0.01 },
          uWiggleSpeed: { type: 'f', value: 0.125 },
          refractionRatio: { type: 'f', value: 0.93 },
          dispersion: { type: 'f', value: 0.8 },
          dispersionBlendMultiplier: { type: 'f', value: 3.0 },
          cameraPosition: { value: this.camera.position },
          tCube: {
            type: 't',
            value: this.sceneParams[i].uniformsOut.tCube
          }
        },
        vertexShader: this.fShader.vertexShader,
        fragmentShader: this.fShader.fragmentShader
      })
      let meshB = new THREE.Mesh(this.bigtestgeometry, meshBMaterial)

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

      this.textPositions.push(
        new THREE.Vector3(
          Math.cos((2 * Math.PI * i) / 7) * 8000,
          meshB.position.y + 300,
          Math.sin((2 * Math.PI * i) / 7) * 8000
        )
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
      meshB.name = i + ''
      meshB.position.set(x, 300, y)
      meshB.lookAt(this.scene.position)

      this.arrB.push(meshB)

      this.scene.add(meshB)
    }

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable'
      },
      defines: THREE.DispersionMaterial.defines,
      uniforms: THREE.DispersionMaterial.uniforms,
      side: THREE.DoubleSide,
      vertexShader: THREE.DispersionMaterial.vertex_Shader,

      fragmentShader: THREE.DispersionMaterial.fragmentShader
    })
    this.insideSphere = new THREE.Mesh(this.bigtestgeometry, this.material)
    this.insideSphere.visible = false
    this.insideSphere.name = 'inside'
    this.scene.add(this.insideSphere)

    this.recompileShader(this.arrB[this.index], 50)
    this.recompileShader(this.arrB[this.index + 1], 20)
    this.recompileShader(this.arrB[this.index - 1], 20)

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

    // About TGroup
    this.TGroup.add(this.about)
    this.about.position.x = -1200
    this.about.position.y = 150

    // Works TGroup
    this.TGroup.add(this.works)
    this.works.position.x = -1200
    this.works.position.y = -100

    // Contact TGroup
    this.TGroup.add(this.contact)
    this.contact.position.x = -1200
    this.contact.position.y = -350

    // About plane
    let aboutPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(650, 120),
      new THREE.MeshBasicMaterial({ color: 0x020202 })
    )
    aboutPlane.name = 'about'
    aboutPlane.position.x = -870
    aboutPlane.position.y = 200
    this.about.p = aboutPlane

    this.TGroup.add(aboutPlane)

    // Works plane
    let worksPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(760, 120),
      new THREE.MeshBasicMaterial({ color: 0x020202 })
    )
    worksPlane.name = 'works'
    worksPlane.position.x = -800
    worksPlane.position.y = -55
    this.works.p = worksPlane
    this.TGroup.add(worksPlane)

    // Contact plane
    let contactPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(790, 120),
      new THREE.MeshBasicMaterial({ color: 0x020202 })
    )
    contactPlane.name = 'contact'
    contactPlane.position.x = -800
    contactPlane.position.y = -300
    this.contact.p = contactPlane
    this.TGroup.add(contactPlane)

    this.scene.add(this.TGroup)

    this.Cgroup = new THREE.Group()

    this.Cgroup.add(this.oceanText)
    this.oceanText.position.x = -100
    this.oceanText.position.y = 0
    this.scene.add(this.Cgroup)
    this.distanceScale = 0.96
    this.Cgroup.position.set(
      this.camera.position.x * this.distanceScale,
      300,
      this.camera.position.z * this.distanceScale
    )

    this.generateGeometry(this.index)

    let newPos = new THREE.Vector3(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z
    )
    newPos.x *= 1.01
    newPos.z *= 1.01
    this.TGroup.position.set(newPos.x, 500, newPos.z)
    this.TGroup.visible = false

    for (let i = 0; i < this.arrB.length; i++) {
      this.arrB[i].material.uniforms.dispersionBlendMultiplier.value = 1
    }
    this.arrB[3].material.uniforms.dispersionBlendMultiplier.value = 4 //face sphere
    this.arrB[2].material.uniforms.dispersionBlendMultiplier.value = 1.5
    this.arrB[4].material.uniforms.dispersionBlendMultiplier.value = 1.5

    this.container.dispatchEvent(new Event('init-complete'))

    this.adapt()
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

  generateGeometry(futureIndex) {
    let newGeometry = new THREE.TextBufferGeometry(
      this.sceneParams[futureIndex].name,
      {
        font: this.font,
        size: 40,
        height: 0,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      }
    )
    newGeometry.word = this.sceneParams[futureIndex].name
    let tmpMaterial = this.oceanText.material
    this.Cgroup.remove(this.oceanText)
    this.oceanText = new THREE.Mesh(newGeometry, tmpMaterial)
    this.Cgroup.add(this.oceanText)
    this.oceanText.position.x = ((newGeometry.word.length * 30) / 2) * -1
    this.oceanText.position.y = 0
  }

  recompileShader(Sobject, priority) {
    let tempUniforms = Sobject.material.uniforms

    let tmpMaterial = new THREE.ShaderMaterial({
      defines: {
        DISPERSION_SAMPLES: priority
      },
      uniforms: tempUniforms,
      vertexShader: this.fShader.vertexShader,
      fragmentShader: this.fShader.fragmentShader
    })
    Sobject.material = tmpMaterial
  }

  animate() {
    if (!this.insideSphere.visible) {
      this.time += this.fovard
      ;['about', 'works', 'contact'].forEach(key => {
        if (!this.menuTime[key]) this[key].material.uniforms.time.value += 0.025
      })

      if (this.time > 24.5 || this.time < 17) {
        this.fovard *= -1
      }

      this.camera.lookAt(this.focus)
      this.renderer.render(this.scene, this.camera)
    } else {
      this.insideCamera.lookAt(this.target)
      this.insideSphere.material.uniforms.time.value = this.time
      this.renderer.render(this.scene, this.insideCamera)
    }

    for (let i = 0; i < 7; i++) {
      this.arrB[i].material.uniforms.time.value = this.time
    }

    this.TGroup.lookAt(this.camera.position)

    if (!this.oceanText.animating) {
      this.oceanText.material.uniforms.time.value += Math.abs(this.fovard * 10)
    }

    this.Cgroup.lookAt(this.camera.position)
  }

  onMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, this.camera)

    if (!this.moving && !this.inMenu && !this.insideSphere.visible) {
      TweenMax.to(this.camera.position, 1, {
        ease: Power2.easeOut,
        x: this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x * 0.3).x,
        z: this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x * 0.3).z,
        y: this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x * 0.3).y,
        onUpdate: () => {
          this.camera.lookAt(this.scene.position)
        }
      })
    }

    if (!this.moving && this.insideSphere.visible) {
      this.insideCamera.position.z +=
        (this.mouse.x * 4 - this.insideCamera.position.z) * 1.1
      this.insideCamera.position.y +=
        (-this.mouse.y + 20 - this.insideCamera.position.y) * 1.1
      this.insideCamera.lookAt(this.target)
    }

    // Calculate objects intersecting the picking ray
    var intersects = this.raycaster.intersectObjects(this.scene.children)

    if (intersects.length == 0) {
      if (this.last != null) {
        TweenMax.to(this.last.material.uniforms.dispersion, 2, {
          value: 0.8,
          ease: Power2.easeOut
        })

        TweenMax.to(this.last.material.uniforms.refractionRatio, 2, {
          value: 0.93,
          ease: Power2.easeOut
        })

        this.last = null
      }
    }

    if (intersects.length > 0) {
      if (
        this.last != null &&
        this.last.material.uuid != intersects[0].object.material.uuid &&
        intersects[0].object.name != 'inside'
      ) {
        TweenMax.to(this.last.material.uniforms.dispersion, 2, {
          value: 0.8,
          ease: Power2.easeInOut
        })

        TweenMax.to(this.last.material.uniforms.refractionRatio, 2, {
          value: 0.93,
          ease: Power2.easeOut
        })

        this.last = intersects[0].object

        TweenMax.to(intersects[0].object.material.uniforms.dispersion, 2, {
          value: 1,
          ease: Power2.easeInOut
        })

        TweenMax.to(intersects[0].object.material.uniforms.refractionRatio, 2, {
          value: 1,
          ease: Power2.easeOut
        })
      }

      if (this.last == null && intersects[0].object.name != 'inside') {
        this.last = intersects[0].object

        TweenMax.to(this.last.material.uniforms.dispersion, 2, {
          value: 1,
          ease: Power2.easeInOut
        })

        TweenMax.to(this.last.material.uniforms.refractionRatio, 2, {
          value: 1,
          ease: Power2.easeOut
        })
      }

      if (parseInt(intersects[0].object.name, 10) == this.index) {
        this.oceanText.animating = true

        TweenMax.to(this.oceanText.material.uniforms.time, 1, {
          value: this.oceanText.material.uniforms.time.value + Math.PI,
          onComplete: () => {
            this.oceanText.animating = false
          }
        })
      }
    }

    intersects = this.raycaster.intersectObjects(this.TGroup.children)

    if (intersects.length > 0) {
      const { name } = intersects[0].object

      this.menuTime[name] = 1
      this.fill(new THREE.Color(0xffffff), 1, this[name])
      TweenMax.to(this[name].material.uniforms.time, 1, {
        value: this[name].material.uniforms.time.value + Math.PI,
        onComplete: () => {
          this.menuTime[name] = 0
        }
      })
    }
  }

  in() {
    this.moving = true

    TweenMax.killAll(false, true, false)
    TweenMax.to(this.container.style, 1.5, { opacity: 1 })
    TweenMax.to(this.camera.position, 1.5, {
      x: this.arrB[this.index].position.x * 1.1,
      y: this.arrB[this.index].position.y,
      z: this.arrB[this.index].position.z * 1.1,
      onComplete: () => {
        this.enter()
      }
    })
  }

  out() {
    this.moving = true
    TweenMax.to(this, 1.5, { time: 9.95 })

    TweenMax.to(this.insideCamera.position, 1.5, {
      x: -396.2
    })

    TweenMax.to(this.container.style, 1.5, {
      opacity: 1,
      onComplete: () => {
        this.back()
      }
    })
  }

  enter() {
    this.moving = true

    this.insideSphere.material.uniforms.envMap.value = this.arrB[
      this.index
    ].material.uniforms.tCube.value
    this.sceneVisibleControl(false)
    this.camera.position.z = 0
    this.insideSphere.visible = true
    this.time = 9.95

    TweenMax.to(this.container.style, 1.5, {
      opacity: 0,
      onComplete: () => {
        this.camera.fov = 75
      }
    })

    TweenMax.to(this, 5, { time: 10.32 })
    this.insideCamera.position.set(-396.2, 20, 0)
    TweenMax.to(this.insideCamera.position, 3, {
      x: 4,
      onComplete: () => {
        this.moving = false
      }
    })
  }

  back() {
    this.moving = true

    this.time = 17

    this.camera.fov = 95
    this.sceneVisibleControl(true)
    this.TGroup.visible = false
    this.insideSphere.visible = false
    this.camera.position.set(
      this.arrB[this.index].position.x * 1.1,
      this.arrB[this.index].position.y,
      this.arrB[this.index].position.z * 1.1
    )
    TweenMax.to(this.camera.position, 1.5, {
      ease: Power2.easeOut,
      x: this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x * 0.1).x,
      z: this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x * 0.1).z,
      y: this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x * 0.1).y,
      onUpdate: () => {
        this.camera.lookAt(this.scene.position)
      },
      onComplete: () => {
        this.moving = false
      }
    })
    TweenMax.to(this.container.style, 1.5, {
      opacity: 0
    })
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

    TweenMax.to(this.oceanText.material.uniforms.opacity, 0.5, {
      value: 0,
      onComplete: () => {
        this.generateGeometry(orbitsIndex)
      }
    })

    TweenMax.to(floatIndex, 2, {
      ease: Power2.easeInOut,
      value: 1,
      onComplete: () => {
        onComplete()
        this.moving = false

        this.Cgroup.position.set(
          this.camera.position.x * this.distanceScale,
          300,
          this.camera.position.z * this.distanceScale
        )
        TweenMax.to(this.oceanText.material.uniforms.opacity, 0.5, {
          value: 1
        })
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
    if (this.inMenu && this.moving && this.insideSphere.visible) return false

    let floatIndex = { value: 0 }
    let materialChanged = false

    if (direction == 'next' && this.index < this.arrOrbits.length - 1) {
      const i = this.index + 1

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
            this.recompileShader(this.arrB[i], 20)
            TweenMax.to(
              this.arrB[i].material.uniforms.dispersionBlendMultiplier,
              1,
              { value: 1 }
            ) // background spheres
          }
        }
        if (this.index == this.arrB.length - 2) {
          this.recompileShader(this.arrB[this.index + 1], 50)
          this.recompileShader(this.arrB[0], 30)
          this.recompileShader(this.arrB[this.index], 30)
          TweenMax.to(
            this.arrB[this.index + 1].material.uniforms
              .dispersionBlendMultiplier,
            1,
            { value: 4 }
          ) //face sphere
          TweenMax.to(
            this.arrB[0].material.uniforms.dispersionBlendMultiplier,
            1,
            { value: 1.5 }
          )
          TweenMax.to(
            this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,
            1,
            { value: 1.5 }
          )
        } else {
          this.recompileShader(this.arrB[this.index + 1], 50)
          this.recompileShader(this.arrB[this.index + 2], 30)
          this.recompileShader(this.arrB[this.index], 30)
          TweenMax.to(
            this.arrB[this.index + 1].material.uniforms
              .dispersionBlendMultiplier,
            1,
            { value: 4 }
          ) //face sphere
          TweenMax.to(
            this.arrB[this.index + 2].material.uniforms
              .dispersionBlendMultiplier,
            1,
            { value: 1.5 }
          )
          TweenMax.to(
            this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,
            1,
            { value: 1.5 }
          )
        }

        materialChanged = true
      }
    }

    if (direction == 'back' && this.index > 0) {
      const i = this.index - 1

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
            this.recompileShader(this.arrB[i], 20)
            TweenMax.to(
              this.arrB[i].material.uniforms.dispersionBlendMultiplier,
              1,
              { value: 1 }
            )
          }
        }
        if (this.index == 1) {
          this.recompileShader(this.arrB[this.index - 1], 50)
          this.recompileShader(this.arrB[this.arrB.length - 1], 30)
          this.recompileShader(this.arrB[this.index], 30)
          TweenMax.to(
            this.arrB[this.index - 1].material.uniforms
              .dispersionBlendMultiplier,
            1,
            { value: 4 }
          )
          TweenMax.to(
            this.arrB[this.arrB.length - 1].material.uniforms
              .dispersionBlendMultiplier,
            1,
            { value: 1.5 }
          )
          TweenMax.to(
            this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,
            1,
            { value: 1.5 }
          )
        } else {
          this.recompileShader(this.arrB[this.index - 1], 50)
          this.recompileShader(this.arrB[this.index - 2], 30)
          this.recompileShader(this.arrB[this.index], 30)
          TweenMax.to(
            this.arrB[this.index - 1].material.uniforms
              .dispersionBlendMultiplier,
            1,
            { value: 4 }
          )
          TweenMax.to(
            this.arrB[this.index - 2].material.uniforms
              .dispersionBlendMultiplier,
            1,
            { value: 1.5 }
          )
          TweenMax.to(
            this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,
            1,
            { value: 1.5 }
          )
        }

        materialChanged = true
      }
    }

    if (direction == 'next' && this.index == this.arrOrbits.length - 1) {
      const i = 0

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
            this.recompileShader(this.arrB[i], 20)
            TweenMax.to(
              this.arrB[i].material.uniforms.dispersionBlendMultiplier,
              1,
              { value: 1 }
            )
          }
        }
        this.recompileShader(this.arrB[0], 50)
        this.recompileShader(this.arrB[this.index], 30)
        this.recompileShader(this.arrB[1], 30)
        TweenMax.to(
          this.arrB[0].material.uniforms.dispersionBlendMultiplier,
          1,
          { value: 4 }
        )
        TweenMax.to(
          this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,
          1,
          { value: 1.5 }
        )
        TweenMax.to(
          this.arrB[1].material.uniforms.dispersionBlendMultiplier,
          1,
          { value: 1.5 }
        )
        materialChanged = true
      }
    }

    if (direction == 'back' && this.index == 0) {
      const i = this.arrOrbits.length - 1

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
            this.recompileShader(this.arrB[i], 20)
            TweenMax.to(
              this.arrB[i].material.uniforms.dispersionBlendMultiplier,
              1,
              { value: 1 }
            )
          }
        }
        this.recompileShader(this.arrB[this.arrB.length - 1], 50)
        this.recompileShader(this.arrB[0], 30)
        this.recompileShader(this.arrB[this.arrB.length - 2], 30)
        TweenMax.to(
          this.arrB[this.arrB.length - 1].material.uniforms
            .dispersionBlendMultiplier,
          1,
          { value: 4 }
        )
        TweenMax.to(
          this.arrB[0].material.uniforms.dispersionBlendMultiplier,
          1,
          { value: 1.5 }
        )
        TweenMax.to(
          this.arrB[this.arrB.length - 2].material.uniforms
            .dispersionBlendMultiplier,
          1,
          { value: 1.5 }
        )
        materialChanged = true
      }
    }
  }

  inMenu() {
    this.moving = true

    let newPos = new THREE.Vector3(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z
    )
    newPos.x *= 1.1
    newPos.z *= 1.1

    this.TGroup.position.set(newPos.x, 500, newPos.z)
    let tmpControlBezier =
      this.index + 1 > this.arrOrbits.length - 1
        ? this.arrB[0].position
        : this.arrB[this.index + 1].position

    let tmpfloat = { value: 0 }
    let focusBezier = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(),
      tmpControlBezier,
      this.TGroup.position
    )
    this.TGroup.visible = true
    this.about.material.uniforms.color.value = new THREE.Color(0xffffff)
    this.works.material.uniforms.color.value = new THREE.Color(0xcbcbcb)
    this.contact.material.uniforms.color.value = new THREE.Color(0xcbcbcb)

    TweenMax.to(tmpfloat, 2, {
      value: 1,
      ease: Power2.easeOut,
      onUpdate: () => {
        this.focus.set(
          focusBezier.getPointAt(tmpfloat.value).x,
          focusBezier.getPointAt(tmpfloat.value).y,
          focusBezier.getPointAt(tmpfloat.value).z
        )
      },
      onComplete: () => {
        this.inMenu = true
        this.moving = false
        for (let i = 0; i < this.arrB.length; i++) {
          this.arrB[i].visible = false
        }
      }
    })
  }

  outMenu() {
    this.moving = true
    let tmpControlBezier =
      this.index + 1 > this.arrOrbits.length - 1
        ? this.arrB[0].position
        : this.arrB[this.index + 1].position
    let tmpfloat = { value: 0 }
    let focusBezier = new THREE.QuadraticBezierCurve3(
      this.TGroup.position,
      tmpControlBezier,
      new THREE.Vector3()
    )

    for (let i = 0; i < this.arrB.length; i++) {
      this.arrB[i].visible = true
    }

    TweenMax.to(tmpfloat, 2, {
      value: 1,
      ease: Power2.easeInOut,
      onUpdate: () => {
        this.focus.set(
          focusBezier.getPointAt(tmpfloat.value).x,
          focusBezier.getPointAt(tmpfloat.value).y,
          focusBezier.getPointAt(tmpfloat.value).z
        )
      },
      onComplete: () => {
        this.TGroup.visible = false
        this.inMenu = false
        this.moving = false
      }
    })
  }

  destroy() {
    this.pause()

    // Remove listeners
    window.removeEventListener('resize', this.onWindowResize)
    this.container.removeEventListener('mousemove', this.onMouseMove)

    // Remove container and canvas
    this.container.remove()
  }

  start() {
    loop.add(this.animate.bind(this), 'slider')
  }

  pause() {
    loop.remove('slider', true)
  }

  sceneVisibleControl(statement) {
    for (let i = 0; i < this.scene.children.length; i++) {
      this.scene.children[i].visible = statement
    }
  }

  fill({ r, g, b }, time, textobj) {
    let menutexts = ['about', 'works', 'contact']

    for (let i = 0; i < menutexts.length; i++) {
      if (textobj.name != menutexts[i]) {
        this[menutexts[i]].material.uniforms.color.value = new THREE.Color(
          0xcbcbcb
        )
      }
    }

    TweenMax.to(textobj.material.uniforms.color.value, time, {
      r,
      g,
      b
    })
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.container.width = window.innerWidth
    this.container.height = window.innerHeight

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.adapt()
  }

  adapt() {
    this.adaptMode = window.innerWidth <= 1024

    if (this.adaptMode) {
      this.about.p.position.x = 0
      this.works.p.position.x = 0
      this.contact.p.position.x = 0
      this.about.position.x = -350
      this.works.position.x = -370
      this.contact.position.x = -380
    } else {
      this.about.p.position.x = -870
      this.works.p.position.x = -800
      this.contact.p.position.x = -800
      this.about.position.x = -1200
      this.works.position.x = -1200
      this.contact.position.x = -1200
    }
  }
}
