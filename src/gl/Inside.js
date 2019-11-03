import { TweenMax } from 'gsap'
import loop from '@/scripts/loop'

let THREE = null

export default class Inside {
  constructor(props) {
    const { selector, url, three } = props

    THREE = three

    this.selector = selector
    this.container = document.querySelector(selector)

    this.textureURL = url
    this.texture = null
    // this.textureURL =
    //   'https://lexa307.github.io/inside/textures/cubemaps/Frame 9.8.jpg'

    this.loadTextures()
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.container.width = window.innerWidth
    this.container.height = window.innerHeight

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  loadTextures() {
    this.texture = new THREE.CubeTextureLoader().load(
      [
        this.textureURL,
        this.textureURL,
        this.textureURL,
        this.textureURL,
        this.textureURL,
        this.textureURL
      ],
      () => {
        this.init()
      }
    )
  }

  init() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      60000
    )
    this.scene.background = new THREE.Color(0xa4b9bf)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })

    this.renderer.shadowMap.enabled = true
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.target = new THREE.Vector3(350, 20, 0)
    this.container
    this.time = 9.95
    this.timefoward = true
    this.timescale = 0.001
    this.Count = 5
    this.spheres = []
    this.moving = true

    this.container.appendChild(this.renderer.domElement)

    this.raycaster = new THREE.Raycaster()

    this.mouse = new THREE.Vector2()

    // Add event listeners
    this.initEvents()

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

    this.material.uniforms.envMap.value = this.texture

    this.camera.lookAt(this.scene.position)
    this.bigtestgeometry = new THREE.IcosahedronGeometry(500, 4)

    this.bigsphere = new THREE.Mesh(this.bigtestgeometry, this.material)
    this.scene.add(this.bigsphere)

    let ambientLight = new THREE.AmbientLight(0x999999)
    this.scene.add(ambientLight)

    this.light = new THREE.PointLight(0xffffff, 1, 5000)
    this.light.position.set(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z
    )
    this.scene.add(this.light)

    this.start()
    this.prepare()
    this.container.dispatchEvent(new Event('complete'))
  }

  initEvents() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false)

    window.addEventListener('mousemove', this.onMouseMove.bind(this), false)
  }

  destroy() {
    this.pause()

    // Remove listeners
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('mousemove', this.onMouseMove)

    // Remove container and canvas
    this.container.remove()
  }

  start() {
    loop.add(this.animate.bind(this), 'inside')
  }

  pause() {
    loop.remove('inside', true)
  }

  animate() {
    this.bigsphere.material.uniforms.time.value = this.time
    this.camera.lookAt(this.target)
    this.renderer.render(this.scene, this.camera)
  }

  prepare() {
    TweenMax.set(this, { time: 9.95 })
    TweenMax.set(this.camera.position, {
      x: -396.2
    })
  }

  enter() {
    return new Promise(resolve => {
      this.moving = true

      TweenMax.to(this, 5, { time: 10.32 })
      this.camera.position.set(-396.2, 20, 0)

      TweenMax.to(this.camera.position, 3, {
        x: 4,
        onComplete: () => {
          this.moving = false
          resolve()
        }
      })
    })
  }

  back() {
    return new Promise(resolve => {
      this.moving = true

      TweenMax.to(this, 5, { time: 9.95 })
      TweenMax.to(this.camera.position, 3, {
        x: -396.2,
        onComplete: () => {
          this.moving = false
          resolve()
        }
      })
    })
  }

  onMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, this.camera)

    if (!this.moving) {
      this.camera.position.z +=
        (this.mouse.x * 4 - this.camera.position.z) * 1.1

      this.camera.position.y +=
        (-this.mouse.y + 20 - this.camera.position.y) * 1.1

      this.camera.lookAt(this.target)
    }
  }
}
