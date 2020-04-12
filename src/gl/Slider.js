import { isMobileSafari } from '@/scripts/detect'
import THREE from '@/gl/ThreeSlider'

const { TweenMax, Power2 } = window

export default class Slider {
  constructor({ container, images, initialSlug }) {
    this.container = container
    this.images = images
    this.initialSlug = initialSlug

    this.isMobileSafari = isMobileSafari()
    this.scene = new THREE.Scene()
    this.mobile = false
    this.adaptMode = false
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.mobile = true
      this.camera = new THREE.PerspectiveCamera(
        95,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      ) //75
      this.insideCamera = new THREE.PerspectiveCamera(
        95,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      ) //75
    } else {
      this.camera = new THREE.PerspectiveCamera(
        95,
        window.innerWidth / window.innerHeight,
        0.1,
        60000
      ) //75
      this.insideCamera = new THREE.PerspectiveCamera(
        95,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      ) //75
    }

    this.insideCamera.add(new THREE.Group())
    this.insideCamera.children[0].position.x = 10
    this.scene.background = new THREE.Color(0x020202)
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'low-power'
    })
    this.renderer.shadowMap.enabled = true
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.lockControls = new THREE.PointerLockControls(
      this.insideCamera,
      document.body
    )
    this.fShader = THREE.FresnelShader
    this.font = null
    //this.fontLoaded = false;
    this.about = null
    this.contact = null
    this.tCubes = []

    this.sceneParams = {
      // Dubrava
      0: {
        slug: 'dubrava',
        name: 'Dubrava',
        uniformsOut: {
          cubeMap: this.images['dubrava']
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
      // Manu
      2: {
        slug: 'manu',
        name: 'Manu',
        uniformsOut: {
          cubeMap: this.images['manu']
        }
      },
      // LEGENDA
      3: {
        slug: 'legenda',
        name: 'Legenda',
        uniformsOut: {
          cubeMap: this.images['legenda']
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
    this.LoadResource()
  }
  onWindowResize() {
    const h = this.isMobileSafari
      ? parseFloat(
          document.documentElement.style
            .getPropertyValue('--initial-vh')
            .split('px')[0]
        ) * 100
      : window.innerHeight

    this.camera.aspect = window.innerWidth / h
    this.camera.updateProjectionMatrix()

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, h)

    // this.adapt()
  }

  play() {
    this.RAF = requestAnimationFrame(this.animate.bind(this))
  }

  pause() {
    cancelAnimationFrame(this.RAF)
    this.RAF = null
  }

  animate() {
    this.play()

    if (!this.insideSphere.visible) {
      this.time += this.fovard

      if (this.time > 24.5 || this.time < 17) {
        this.fovard *= -1
      }
      this.camera.lookAt(this.focus)
      this.renderer.render(this.scene, this.camera)
      this.TGroup.lookAt(this.camera.position)
    } else {
      this.TGroup.lookAt(this.insideCamera.position)
      this.insideSphere.material.uniforms.time.value = this.time
      this.renderer.render(this.scene, this.insideCamera)
    }

    this.about.material.uniforms.time.value += 0.025
    this.contact.material.uniforms.time.value += 0.025
    this.tittleAbout.material.uniforms.time.value += 0.025

    for (let i = 0; i < 7; i++) {
      this.arrB[i].material.uniforms.time.value = this.time
    }

    if (!this.oceanText.animating) {
      this.oceanText.material.uniforms.time.value += Math.abs(this.fovard * 10)
    }

    this.Cgroup.lookAt(this.camera.position)
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
    let tmpMAterial = this.oceanText.material
    this.Cgroup.remove(this.oceanText)
    this.oceanText = new THREE.Mesh(newGeometry, tmpMAterial)
    this.Cgroup.add(this.oceanText)
    this.oceanText.position.x = ((newGeometry.word.length * 30) / 2) * -1
    this.oceanText.position.y = 0
  }

  Init() {
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

    //this.OrbitFlag = true;
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

    this.renderer.domElement.id = 'webgl'
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

    this.d = document.createElement('div')

    this.d.style.width = '100vw'
    this.d.style.height = '100vh'
    this.d.style.top = '0'
    this.d.style.left = '0'
    this.d.style.position = 'fixed'
    this.d.style.opacity = '0'

    this.d.style.background = '#000'

    this.raycaster = new THREE.Raycaster()

    this.mouse = new THREE.Vector2()
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    this.d.addEventListener('mousewheel', this.mouseHandle.bind(this), false)

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
          } //  textureCube }
        },
        vertexShader: this.fShader.vertexShader,
        fragmentShader: this.fShader.fragmentShader
      })
      let meshB = new THREE.Mesh(this.bigtestgeometry, meshBMaterial)

      let x = Math.cos((2 * Math.PI * i) / 7) * 6000 + 0
      let y = Math.sin((2 * Math.PI * i) / 7) * 6000 + 0

      let distanceScale = this.mobile ? 7600 : 7100

      let OCurveStartVectot = new THREE.Vector3(
        Math.cos((2 * Math.PI * (i - 0.1)) / 7) * distanceScale + 0,
        meshB.position.y + 300,
        Math.sin((2 * Math.PI * (i - 0.1)) / 7) * distanceScale + 0
      )
      let OCurveControlVevtor = new THREE.Vector3(
        Math.cos((2 * Math.PI * i) / 7) * distanceScale + 0,
        meshB.position.y + 300,
        Math.sin((2 * Math.PI * i) / 7) * distanceScale + 0
      )
      let OCurveEndVector = new THREE.Vector3(
        Math.cos((2 * Math.PI * (i + 0.1)) / 7) * distanceScale + 0,
        meshB.position.y + 300,
        Math.sin((2 * Math.PI * (i + 0.1)) / 7) * distanceScale + 0
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
      transparent: true,
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

    document.querySelector('.slider-container').appendChild(this.d)

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
    this.TGroup.add(this.about)
    this.about.position.x = 500
    this.about.position.y = 350

    this.TGroup.add(this.tittleAbout)
    this.tittleAbout.position.x = -1000
    this.tittleAbout.position.y = 300

    this.TGroup.add(this.contact)
    this.contact.position.x = 500
    this.contact.position.y = -500

    let contactPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(600, 120),
      new THREE.MeshBasicMaterial({
        color: 0x020202,
        transparent: true,
        opacity: 0
      })
    )

    contactPlane.name = 'contact'
    this.contact.p = contactPlane
    this.contact.add(contactPlane)
    contactPlane.position.x = -800

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

    this.d.addEventListener(
      'touchstart',
      event => {
        event.preventDefault()
        event.stopPropagation()
        this.initialPoint = event.changedTouches[0]

        this.mouse.x = (event.touches[0].pageX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.touches[0].pageY / window.innerHeight) * 2 + 1
      },
      false
    )
    this.d.addEventListener(
      'touchend',
      event => {
        event.preventDefault()
        event.stopPropagation()
        this.finalPoint = event.changedTouches[0]
        let xAbs = Math.abs(this.initialPoint.pageX - this.finalPoint.pageX)
        let yAbs = Math.abs(this.initialPoint.pageY - this.finalPoint.pageY)

        if (xAbs > 20 || yAbs > 20) {
          if (xAbs > yAbs) {
            if (this.finalPoint.pageX < this.initialPoint.pageX) {
              /*СВАЙП ВЛЕВО*/
              this.indexControl('back')
            } else {
              /*СВАЙП ВПРАВО*/
              this.indexControl('next')
            }
          }
        } else {
          event.target.click()
          event.preventDefault()
        }
      },
      false
    )
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    window.addEventListener('click', this.onClick.bind(this), false)
    for (let i = 0; i < this.arrB.length; i++) {
      this.arrB[i].material.uniforms.dispersionBlendMultiplier.value = 1
    }
    this.arrB[3].material.uniforms.dispersionBlendMultiplier.value = 4 //face sphere
    this.arrB[2].material.uniforms.dispersionBlendMultiplier.value = 1.5
    this.arrB[4].material.uniforms.dispersionBlendMultiplier.value = 1.5
    this.adapt()
    if (this.adaptMode) {
      for (let i = 0; i < this.arrB.length; i++) {
        if (i != this.index) {
          this.arrB[i].visible = false
        }
      }
    }
    this.container.dispatchEvent(new Event('init:complete'))
    this.play()
  }

  showPointersLock() {
    return new Promise(resolve => {
      if (!this.moving && !this.inMenu && this.insideSphere.visible) {
        this.lockControls.lock()
        resolve()
      } else {
        resolve()
      }
    })
  }

  hidePointersLock() {
    return new Promise(resolve => {
      if (!this.moving && !this.inMenu && this.insideSphere.visible) {
        this.moving = true
        this.lockControls.unlock()

        this.raycaster.setFromCamera(new THREE.Vector2(), this.insideCamera)
        var intersect = this.raycaster.intersectObjects(this.scene.children)
        let tempTarget = new THREE.Vector3(
          intersect[0].point.x,
          intersect[0].point.y,
          intersect[0].point.z
        )
        TweenMax.to(tempTarget, 3, {
          x: this.target.x,
          y: this.target.y,
          z: this.target.z,
          ease: Power2.easeInOut,
          onComplete: () => {
            this.moving = false
            resolve()
          },
          onUpdate: () => {
            this.insideCamera.lookAt(tempTarget)
          }
        })
      } else {
        resolve()
      }
    })
  }

  showMenu() {
    new Promise(resolve => {
      if (this.moving || this.inMenu) {
        resolve()
        return false
      }

      this.adapt()

      this.moving = true
      let newPos

      if (!this.insideSphere.visible) {
        newPos = new THREE.Vector3(
          this.camera.position.x,
          this.camera.position.y,
          this.camera.position.z
        )
        newPos.x *= 1.1
        newPos.z *= 1.1
        // this.TGroup.scale.set(1, 1, 1);
      } else {
        newPos = new THREE.Vector3(
          this.insideCamera.position.x,
          100,
          this.insideCamera.position.z
        )
        newPos.x *= -60.1

        const scaleNum = this.mobile ? 0.2 : 0.3
        this.TGroup.scale.set(scaleNum, scaleNum, scaleNum)

        this.TGroup.visible = true
      }

      let tmpControlBezier
      if (!this.insideSphere.visible) {
        this.TGroup.position.set(newPos.x, 500, newPos.z)
        tmpControlBezier =
          this.index + 1 > this.arrOrbits.length - 1
            ? this.arrB[0].position
            : this.arrB[this.index + 1].position
      } else {
        this.TGroup.position.set(
          newPos.x,
          this.insideCamera.position.y,
          newPos.z
        )
        tmpControlBezier = new THREE.Vector3(
          -100,
          this.insideCamera.position.y,
          200
        )
      }

      let tmpfloat = { value: 0 }
      let focusBezier = new THREE.QuadraticBezierCurve3(
        this.insideSphere.visible
          ? new THREE.Vector3(350, 20, 0)
          : new THREE.Vector3(),
        tmpControlBezier,
        this.TGroup.position
      )
      this.TGroup.visible = true
      this.about.material.uniforms.color.value = new THREE.Color(0xffffff)

      TweenMax.to(tmpfloat, 2, {
        value: 1,
        ease: !this.insideSphere.visible ? Power2.easeOut : Power2.easeInOut,
        onUpdate: () => {
          if (this.insideSphere.visible) {
            this.target.set(
              focusBezier.getPointAt(tmpfloat.value).x,
              focusBezier.getPointAt(tmpfloat.value).y,
              focusBezier.getPointAt(tmpfloat.value).z
            )
            this.insideCamera.lookAt(this.target)
          } else {
            this.focus.set(
              focusBezier.getPointAt(tmpfloat.value).x,
              focusBezier.getPointAt(tmpfloat.value).y,
              focusBezier.getPointAt(tmpfloat.value).z
            )
          }
        },
        onComplete: () => {
          this.inMenu = true
          this.moving = false
          for (let i = 0; i < this.arrB.length; i++) {
            this.arrB[i].visible = false
          }
          resolve()
        }
      })

      TweenMax.to(this.insideSphere.material.uniforms.opacity, 2, {
        value: !this.inMenu == true ? 0.2 : 1,
        ease: Power2.easeInOut
      })
    })
  }

  hideMenu() {
    new Promise(resolve => {
      if (this.moving || !this.inMenu) {
        resolve()
        return false
      }

      this.moving = true
      let tmpControlBezier
      if (this.insideSphere.visible) {
        tmpControlBezier = new THREE.Vector3(
          100,
          this.insideCamera.position.y,
          200
        )
      } else {
        tmpControlBezier =
          this.index + 1 > this.arrOrbits.length - 1
            ? this.arrB[0].position
            : this.arrB[this.index + 1].position
        for (let i = 0; i < this.arrB.length; i++) {
          this.arrB[i].visible = true
        }
      }

      let tmpfloat = { value: 0 }
      let focusBezier = new THREE.QuadraticBezierCurve3(
        this.TGroup.position,
        tmpControlBezier,
        this.insideSphere.visible
          ? new THREE.Vector3(350, 20, 0)
          : new THREE.Vector3()
      )

      TweenMax.to(tmpfloat, 2, {
        value: 1,
        ease: Power2.easeInOut,
        onUpdate: () => {
          if (this.insideSphere.visible) {
            this.target.set(
              focusBezier.getPointAt(tmpfloat.value).x,
              focusBezier.getPointAt(tmpfloat.value).y,
              focusBezier.getPointAt(tmpfloat.value).z
            )
            this.insideCamera.lookAt(this.target)
          } else {
            this.focus.set(
              focusBezier.getPointAt(tmpfloat.value).x,
              focusBezier.getPointAt(tmpfloat.value).y,
              focusBezier.getPointAt(tmpfloat.value).z
            )
          }
        },
        onComplete: () => {
          this.TGroup.visible = false
          this.inMenu = false
          this.moving = false
          resolve()
        }
      })

      TweenMax.to(this.insideSphere.material.uniforms.opacity, 2, {
        value: !this.inMenu == true ? 0.2 : 1,
        ease: Power2.easeInOut
      })
    })
  }

  adapt() {
    if (window.innerWidth <= 1024) {
      this.adaptMode = true
      this.TGroup.scale.set(0.7, 0.7, 0.7)
      this.tittleAbout.position.x = -500
      this.tittleAbout.position.y = 900

      this.about.position.x = -500
      this.about.position.y = 300
      this.contact.position.x = -500
      this.contact.position.y = -600

      if (!this.inMenu || !this.insideSphere) {
        for (let i = 0; i < this.arrB.length; i++) {
          if (i != this.index) {
            this.arrB[i].visible = false
          }
        }
      }
    } else {
      this.adaptMode = false
      this.tittleAbout.position.x = -1000
      this.tittleAbout.position.y = 300
      this.TGroup.scale.set(1, 1, 1)

      this.contact.p.position.x = 265
      this.about.position.x = -100
      this.contact.position.x = -100

      if (!this.inMenu || !this.insideSphere) {
        for (let i = 0; i < this.arrB.length; i++) {
          this.arrB[i].visible = true
        }
      }
    }
  }

  LoadResource() {
    let resCounter = 0

    for (let i in this.sceneParams) {
      let url = this.sceneParams[i].uniformsOut.cubeMap
      this.sceneParams[
        i
      ].uniformsOut.tCube = new THREE.CubeTextureLoader().load(
        [url, url, url, url, url, url],
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

    const fontJson = require('@/assets/fonts/Woodland.json')
    const font = new THREE.Font(fontJson)
    this.font = font

    let oceanGeometry = new THREE.TextBufferGeometry('Neurohive', {
      font: font,
      size: 30,
      height: 1,
      curveSegments: 12,
      bevelEnabled: false,
      bevelThickness: 10,
      bevelSize: 8,
      bevelOffset: 0,
      bevelSegments: 5
    })

    let linematerial = new THREE.LineBasicMaterial({ color: 0xffffff })
    let linepoints = []
    linepoints.push(new THREE.Vector3(0, -45, 0))
    linepoints.push(new THREE.Vector3(0, -50, 0))
    linepoints.push(new THREE.Vector3(560, -50, 0))

    linepoints.push(new THREE.Vector3(0, -45, 0))
    linepoints.push(new THREE.Vector3(560, -45, 0))
    linepoints.push(new THREE.Vector3(560, -50, 0))

    let line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(linepoints),
      linematerial
    )

    let geometry1 = new THREE.TextBufferGeometry(`Feel free to mail me`, {
      font: font,
      size: 40,
      height: 1,
      curveSegments: 12,
      bevelEnabled: false,
      bevelThickness: 10,
      bevelSize: 8,
      bevelOffset: 0,
      bevelSegments: 5
    })

    const text2 =
      // prettier-ignore
      `Interactive
      designer
  & Creative
       director`

    let geometry2 = new THREE.TextBufferGeometry(text2, {
      font: font,
      size: 80,
      height: 1,
      curveSegments: 12,
      bevelEnabled: false,
      bevelThickness: 10,
      bevelSize: 8,
      bevelOffset: 0,
      bevelSegments: 5
    })

    let mobileGeometry2 = new THREE.TextBufferGeometry(
      `Interactive
designer
& Creative
director`,
      {
        font: font,
        size: 90,
        height: 1,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      }
    )

    geometry1.merge(line.geometry)

    let oceanMaterial2 = oceanMaterial.clone()
    oceanMaterial2.uniforms.frequency1.value = 0.03
    oceanMaterial2.uniforms.amplitude1.value = 2.03
    oceanMaterial2.uniforms.frequency2.value = 0.025
    oceanMaterial2.uniforms.amplitude2.value = 0.01

    this.contact = new THREE.Mesh(geometry1, oceanMaterial2.clone())
    this.contact.name = 'contact'
    this.contact.add(line)

    this.tittleAbout = new THREE.Mesh(
      this.mobile ? mobileGeometry2 : geometry2,
      oceanMaterial2.clone()
    )
    this.tittleAbout.name = `tittleAbout`

    this.oceanText = new THREE.Mesh(oceanGeometry, oceanMaterial)
    this.oceanText.animating = false
    this.menuTime = { about: 0, tittleAbout: 0, contact: 0 }

    resCounter++

    const lightFontJson = require('@/assets/fonts/Woodland-Light.json')
    const lightFont = new THREE.Font(lightFontJson)
    this.font2 = lightFont

    let geometry = new THREE.TextBufferGeometry(
      `Hi, I'm Artem Sokolov, a Russian
digital designer and art director based
in Saint Petersburg. I’ve been working
in the digital area for more than 4 years.
My work has been varied – from branding,
apps, UX/UI, websites and digital tools –
but always with a human-centered approach
and a keen eye for detail. My work has been
recognized on Awwwards, CSSDA and many
more. Let's get in touch, for any project
inquires or just drop me a message.`,
      {
        font: lightFont,
        size: 40,
        height: 1,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      }
    )

    let mobileGeometry = new THREE.TextBufferGeometry(
      `Hi, I'm Artem Sokolov, a Russian digital
designer and art director based in Saint
Petersburg. I’ve been working in the
digital area for more than 4 years. My work
has been varied – from branding, apps,
UX/UI, websites and digital tools – but
always with a human-centered approach
and a keen eye for detail. My work has
been recognized on Awwwards, CSSDA
and many more. Let's get in touch, for any
project inquires or just drop me a
message.`,
      {
        font: lightFont,
        size: 40,
        height: 1,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      }
    )

    this.about = new THREE.Mesh(
      this.mobile ? mobileGeometry : geometry,
      this.contact.material.clone()
    )
    this.about.name = 'about'
    this.about.material.uniforms.color.value = new THREE.Color(0xcccccc)
    resCounter++

    let s
    s = setInterval(() => {
      if (resCounter == 9) {
        clearInterval(s)
        this.Init()
      }
    }, 100)
  }

  onClick() {
    if (!this.inMenu) {
      this.raycaster.setFromCamera(this.mouse, this.camera)
      let intersects = this.raycaster.intersectObjects(this.scene.children)

      if (intersects.length > 0) {
        let objName = parseInt(intersects[0].object.name, 10)

        if (objName > this.index) {
          if (this.index == 0 && objName == this.arrB.length - 1) {
            this.indexControl('back')
          } else {
            this.indexControl('next')
          }
        }

        if (objName < this.index) {
          if (this.index == this.arrB.length - 1 && objName == 0) {
            this.indexControl('next')
          } else {
            this.indexControl('back')
          }
        }

        if (objName == this.index) {
          this.container.dispatchEvent(new Event('click:active'))
        }
      }
    } else {
      this.raycaster.setFromCamera(
        this.mouse,
        this.insideSphere.visible ? this.insideCamera : this.camera
      )

      let intersects = this.raycaster.intersectObjects(this.TGroup.children)

      if (intersects.length > 0) {
        ;['about', 'contact'].forEach(key => {
          if (intersects[0].object.name == key) {
            console.log(`onClick - menu:${key}`)
            this.container.dispatchEvent(new Event(`click:${key}`))
          }
        })
      }
    }
  }

  sceneVisibleControl(statement) {
    if (!this.adaptMode) {
      for (let i = 0; i < this.scene.children.length; i++) {
        this.scene.children[i].visible = statement
      }
    } else {
      this.arrB[this.index].visible = statement
      this.oceanText.visible = statement
    }
  }

  firstAnim() {
    return new Promise(resolve => {
      this.renderer.sortObjects = false
      this.camera.position.y = 5000

      this.focus.set(
        this.camera.position.x * 0.9,
        5500,
        this.camera.position.z * 0.9
      )

      this.moving = true

      TweenMax.to(this.camera.position, 3, {
        y: 300,
        ease: Power2.easeInOut,
        onComplete: () => {
          this.moving = false
          resolve()
        },
        onUpdate: () => {
          this.camera.lookAt(this.focus)
        }
      })

      TweenMax.to(this.focus, 3, {
        y: 300,
        x: 0,
        z: 0,
        ease: Power2.easeInOut
      })
    })
  }

  in() {
    return new Promise(resolve => {
      this.container.dispatchEvent(new Event('enter:begin'))
      this.moving = true
      TweenMax.killAll(false, true, false)
      TweenMax.to(this.d.style, 1.5, { opacity: 1, onComplete: () => {} })
      TweenMax.to(this.camera.position, 1.5, {
        x: this.arrB[this.index].position.x * 1.1,
        y: this.arrB[this.index].position.y,
        z: this.arrB[this.index].position.z * 1.1,
        onComplete: () => {
          this.enter().then(resolve)
        }
      })
    })
  }

  enter(prepare) {
    return new Promise(async resolve => {
      if (prepare) await this.prepare()

      this.moving = true

      this.insideSphere.material.uniforms.envMap.value = this.arrB[
        this.index
      ].material.uniforms.tCube.value
      this.sceneVisibleControl(false)
      this.camera.position.z = 0
      this.insideSphere.visible = true
      this.time = 9.95

      TweenMax.to(this.d.style, 1.5, {
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
          this.container.dispatchEvent(new Event('enter:complete'))
          resolve()
        },
        onUpdate: () => {
          this.insideCamera.lookAt(this.target)
        }
      })
    })
  }

  out() {
    return new Promise(resolve => {
      this.container.dispatchEvent(new Event('out:begin'))
      this.moving = true
      TweenMax.to(this, 1.5, { time: 9.95 })

      TweenMax.to(this.insideCamera.position, 1.5, {
        x: -396.2
      })
      TweenMax.to(this.d.style, 1.5, {
        opacity: 1,
        onComplete: () => {
          this.back().then(resolve)
        }
      })
    })
  }

  back() {
    return new Promise(resolve => {
      this.time = 17
      this.camera.fov = 95
      this.moving = true
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
          this.container.dispatchEvent(new Event('out:complete'))
          resolve()
        }
      })

      this.onWindowResize()

      TweenMax.to(this.d.style, 1.5, {
        opacity: 0
      })
    })
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    this.raycaster.setFromCamera(this.mouse, this.camera)

    if (!this.moving && !this.inMenu && !this.insideSphere.visible) {
      TweenMax.to(this.camera.position, 1, {
        ease: Power2.easeOut,
        x: this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x * 0.03).x,
        z: this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x * 0.03).z,
        y: this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x * 0.03).y,
        onUpdate: () => {
          this.camera.lookAt(this.scene.position)
        }
      })
    }

    if (
      !this.moving &&
      this.insideSphere.visible &&
      !this.lockControls.isLocked
    ) {
      this.insideCamera.position.z +=
        (this.mouse.x * 4 - this.insideCamera.position.z) * 1.1
      this.insideCamera.position.y +=
        (-this.mouse.y + 20 - this.insideCamera.position.y) * 1.1
      this.insideCamera.lookAt(this.target)
    }

    // calculate objects intersecting the picking ray
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

    if (this.insideSphere.visible) {
      this.raycaster.setFromCamera(this.mouse, this.insideCamera)
    }

    intersects = this.raycaster.intersectObjects(this.contact.children)

    if (intersects.length > 0 && intersects[0].object.name == 'contact') {
      this.menuTime.contact = 1
      TweenMax.to(this.contact.material.uniforms.time, 1, {
        value: this.contact.material.uniforms.time.value + Math.PI,
        onComplete: () => {
          this.menuTime.contact = 0
        }
      })
    }
  }

  mouseHandle(event) {
    let isTouchPadDefined =
      this.isTouchPad || typeof this.isTouchPad !== 'undefined'

    if (!isTouchPadDefined) {
      if (this.eventCount === 0) {
        this.eventCountStart = new Date().getTime()
      }

      this.eventCount++

      if (new Date().getTime() - this.eventCountStart > 100) {
        if (this.eventCount > 10) {
          this.isTouchPad = true
        } else {
          this.isTouchPad = false
        }
        isTouchPadDefined = true
      }
    }

    if (isTouchPadDefined) {
      // if (!event) event = event
      let direction = event.detail < 0 || event.wheelDelta > 0 ? 1 : -1

      if (this.isTouchPad) {
        this.newTime = new Date().getTime()

        if (!this.moving && this.newTime - this.oldTime > 550) {
          if (direction < 0) {
            // swipe down
            this.indexControl('next')
          } else {
            // swipe up
            this.indexControl('back')
          }
          setTimeout(function() {
            this.oldTime = new Date().getTime()
          }, 500)
        }
      } else {
        if (direction < 0) {
          this.indexControl('next')

          // swipe down
        } else {
          // swipe up
          this.indexControl('back')
        }
      }
    }
    //}
  }

  prepare() {
    return new Promise(resolve => {
      const paramsArray = Object.values(this.sceneParams)
      const active = paramsArray.find(e => e.slug === this.initialSlug)
      const i = paramsArray.indexOf(active)
      this.index = i

      let floatIndex = { value: 0 }
      let materialChanged = false

      this.moving = true

      const ev = new CustomEvent('index:changed', {
        detail: { i }
      })
      this.container.dispatchEvent(ev)

      let curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(
          this.camera.position.x,
          this.camera.position.y,
          this.camera.position.z
        ),
        this.arrCurves[this.index],
        new THREE.Vector3(
          this.arrOrbits[i].getPointAt(0.5).x,
          this.arrOrbits[i].getPointAt(0.5).y,
          this.arrOrbits[i].getPointAt(0.5).z
        )
      )
      TweenMax.set(this.oceanText.material.uniforms.opacity, {
        value: 0
      })
      this.generateGeometry(i)

      this.arrB[i].visible = true

      TweenMax.set(floatIndex, {
        ease: Power2.easeInOut,
        value: 1
      })

      this.camera.lookAt(this.scene.position)
      this.camera.position.set(
        curve.getPointAt(floatIndex.value).x,
        curve.getPointAt(floatIndex.value).y,
        curve.getPointAt(floatIndex.value).z
      )
      this.camera.lookAt(this.scene.position)

      this.index = i
      this.moving = false
      this.Cgroup.position.set(
        this.camera.position.x * this.distanceScale,
        300,
        this.camera.position.z * this.distanceScale
      )

      TweenMax.set(this.oceanText.material.uniforms.opacity, {
        value: 1
      })

      if (this.adaptMode) {
        for (let j = 0; j < this.arrB.length; j++) {
          if (j != this.index) {
            this.arrB[j].visible = false
          }
        }
      }

      if (!materialChanged) {
        for (let j = 0; j < this.arrB.length; j++) {
          if (j != this.index) {
            this.recompileShader(this.arrB[j], 20)
            TweenMax.set(
              this.arrB[j].material.uniforms.dispersionBlendMultiplier,
              { value: 1 }
            )
          }
        }

        const isFirst = this.index === 0
        const isLast = this.index === this.arrB.length - 1

        let prevIndex
        let nextIndex

        if (isFirst) {
          prevIndex = this.arrB.length - 1
          nextIndex = this.index + 1
        } else if (isLast) {
          prevIndex = this.index - 1
          nextIndex = 0
        } else {
          prevIndex = this.index - 1
          nextIndex = this.index + 1
        }

        this.recompileShader(this.arrB[this.index], 50)
        this.recompileShader(this.arrB[prevIndex], 30)
        this.recompileShader(this.arrB[nextIndex], 30)

        TweenMax.set(this.arrB[i].material.uniforms.dispersionBlendMultiplier, {
          value: 4
        })

        TweenMax.set(
          this.arrB[prevIndex].material.uniforms.dispersionBlendMultiplier,
          {
            value: 1.5
          }
        )

        TweenMax.set(
          this.arrB[nextIndex].material.uniforms.dispersionBlendMultiplier,
          { value: 1.5 }
        )

        materialChanged = true
        resolve()
      } else {
        resolve()
      }
    })
  }

  indexControl(direction) {
    if (!this.inMenu && !this.moving && !this.insideSphere.visible) {
      let floatIndex = { value: 0 }
      let materialChanged = false

      const dispatch = i => {
        const ev = new CustomEvent('index:changed', {
          detail: { i }
        })
        this.container.dispatchEvent(ev)
      }

      if (direction == 'next' && this.index < this.arrOrbits.length - 1) {
        this.moving = true
        dispatch(this.index + 1)

        let curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(
            this.camera.position.x,
            this.camera.position.y,
            this.camera.position.z
          ),
          this.arrCurves[this.index],
          new THREE.Vector3(
            this.arrOrbits[this.index + 1].getPointAt(0.5).x,
            this.arrOrbits[this.index + 1].getPointAt(0.5).y,
            this.arrOrbits[this.index + 1].getPointAt(0.5).z
          )
        )
        TweenMax.to(this.oceanText.material.uniforms.opacity, 0.5, {
          value: 0,
          onComplete: () => {
            this.generateGeometry(this.index + 1)
          }
        })
        // TweenMax.to(this.focus,2,{ease: Power2.easeInOut,x:this.arrB[this.index+1].position.x,y:this.arrB[this.index+1].position.y,z:this.arrB[this.index+1].position.z,onUpdate:()=>{}})
        this.arrB[this.index + 1].visible = true
        TweenMax.to(floatIndex, 2, {
          ease: Power2.easeInOut,
          value: 1,
          onComplete: () => {
            this.index++
            this.moving = false
            this.Cgroup.position.set(
              this.camera.position.x * this.distanceScale,
              300,
              this.camera.position.z * this.distanceScale
            )
            TweenMax.to(this.oceanText.material.uniforms.opacity, 0.5, {
              value: 1
            })
            if (this.adaptMode) {
              for (let i = 0; i < this.arrB.length; i++) {
                if (i != this.index) {
                  this.arrB[i].visible = false
                }
              }
            }
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
        this.moving = true
        dispatch(this.index - 1)
        let curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(
            this.camera.position.x,
            this.camera.position.y,
            this.camera.position.z
          ),
          this.arrCurves[this.index - 1],
          new THREE.Vector3(
            this.arrOrbits[this.index - 1].getPointAt(0.5).x,
            this.arrOrbits[this.index - 1].getPointAt(0.5).y,
            this.arrOrbits[this.index - 1].getPointAt(0.5).z
          )
        )
        TweenMax.to(this.oceanText.material.uniforms.opacity, 0.5, {
          value: 0,
          onComplete: () => {
            this.generateGeometry(this.index - 1)
          }
        })
        // TweenMax.to(this.focus,2,{ease: Power2.easeInOut,x:this.arrB[this.index-1].position.x,y:this.arrB[this.index-1].position.y,z:this.arrB[this.index-1].position.z,onUpdate:()=>{}})
        this.arrB[this.index - 1].visible = true
        TweenMax.to(floatIndex, 2, {
          ease: Power2.easeInOut,
          value: 1,
          onComplete: () => {
            this.index--
            this.moving = false
            this.Cgroup.position.set(
              this.camera.position.x * this.distanceScale,
              300,
              this.camera.position.z * this.distanceScale
            )
            TweenMax.to(this.oceanText.material.uniforms.opacity, 0.5, {
              value: 1
            })
            if (this.adaptMode) {
              for (let i = 0; i < this.arrB.length; i++) {
                if (i != this.index) {
                  this.arrB[i].visible = false
                }
              }
            }
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

        // let material = new THREE.LineBasicMaterial( { color : 0x0000ff } );
        // let points = curve.getPoints(50);
        // let geometry = new THREE.BufferGeometry().setFromPoints( points );
        // let curveObject = new THREE.Line( geometry, material );
        // this.scene.add(curveObject);
      }

      if (direction == 'next' && this.index == this.arrOrbits.length - 1) {
        this.moving = true
        dispatch(0)

        let curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(
            this.camera.position.x,
            this.camera.position.y,
            this.camera.position.z
          ),
          this.arrCurves[this.index],
          new THREE.Vector3(
            this.arrOrbits[0].getPointAt(0.5).x,
            this.arrOrbits[0].getPointAt(0.5).y,
            this.arrOrbits[0].getPointAt(0.5).z
          )
        )
        TweenMax.to(this.oceanText.material.uniforms.opacity, 0.5, {
          value: 0,
          onComplete: () => {
            this.generateGeometry(0)
          }
        })
        // TweenMax.to(this.focus,2,{ease: Power2.easeInOut,x:this.arrB[this.index+1].position.x,y:this.arrB[this.index+1].position.y,z:this.arrB[this.index+1].position.z,onUpdate:()=>{}})
        this.arrB[0].visible = true
        TweenMax.to(floatIndex, 2, {
          ease: Power2.easeInOut,
          value: 1,
          onComplete: () => {
            this.index = 0
            this.moving = false
            this.Cgroup.position.set(
              this.camera.position.x * this.distanceScale,
              300,
              this.camera.position.z * this.distanceScale
            )
            TweenMax.to(this.oceanText.material.uniforms.opacity, 0.5, {
              value: 1
            })
            if (this.adaptMode) {
              for (let i = 0; i < this.arrB.length; i++) {
                if (i != this.index) {
                  this.arrB[i].visible = false
                }
              }
            }
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
        this.moving = true
        dispatch(this.arrOrbits.length - 1)
        let curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(
            this.camera.position.x,
            this.camera.position.y,
            this.camera.position.z
          ),
          this.arrCurves[this.arrOrbits.length - 1],
          new THREE.Vector3(
            this.arrOrbits[this.arrOrbits.length - 1].getPointAt(0.5).x,
            this.arrOrbits[this.arrOrbits.length - 1].getPointAt(0.5).y,
            this.arrOrbits[this.arrOrbits.length - 1].getPointAt(0.5).z
          )
        )
        TweenMax.to(this.oceanText.material.uniforms.opacity, 0.5, {
          value: 0,
          onComplete: () => {
            this.generateGeometry(this.arrOrbits.length - 1)
          }
        })
        // TweenMax.to(this.focus,2,{ease: Power2.easeInOut,x:this.arrB[this.index-1].position.x,y:this.arrB[this.index-1].position.y,z:this.arrB[this.index-1].position.z,onUpdate:()=>{}})
        this.arrB[this.arrOrbits.length - 1].visible = true
        TweenMax.to(floatIndex, 2, {
          ease: Power2.easeInOut,
          value: 1,
          onComplete: () => {
            this.index = this.arrOrbits.length - 1
            this.moving = false
            this.Cgroup.position.set(
              this.camera.position.x * this.distanceScale,
              300,
              this.camera.position.z * this.distanceScale
            )
            TweenMax.to(this.oceanText.material.uniforms.opacity, 0.5, {
              value: 1
            })
            if (this.adaptMode) {
              for (let i = 0; i < this.arrB.length; i++) {
                if (i != this.index) {
                  this.arrB[i].visible = false
                }
              }
            }
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
  }

  recompileShader(Sobject, priority) {
    //priority: back = 20, front = 50

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
  fill(color, time, textobj) {
    let menutexts = ['about']
    for (let i = 0; i < menutexts.length; i++) {
      if (textobj.name != menutexts[i]) {
        // TweenMax.to(this[menutexts[i]].material.uniforms.color.value,time,{r:255,g:255,b:255});
        this[menutexts[i]].material.uniforms.color.value = new THREE.Color(
          0xcbcbcb
        )
      }
    }
    TweenMax.to(textobj.material.uniforms.color.value, time, {
      r: color.r,
      g: color.g,
      b: color.b
    })
  }
}
