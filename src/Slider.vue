<template>
  <!-- <section :class="['slider-container slider', { hidden: !show }]"> -->
  <section class="slider-container slider">
    <div class="slider" id="slider"></div>

    <div class="slider-counter" v-if="inited" v-show="$route.name === 'index'">
      <span>{{ num }}</span>
      <span></span>
      <span>{{ len }}</span>
    </div>
  </section>
</template>

<script>
import anime from 'animejs'
// import loop from '@/scripts/loop'

// import three from '@/gl/ThreeSlider'
import Slider from '@/gl/Slider'
import { getCases } from '@/scripts/api'

const images = {}

export default {
  name: 'Slider',
  props: ['detect', 'isMenuActive', 'show'],
  data: () => ({
    index: 0,
    inited: false,
    slider: null
  }),
  computed: {
    num() {
      return this.inited ? `0${this.index + 1}` : ''
    },
    len() {
      return this.inited
        ? `0${Object.keys(this.slider.sceneParams).length}`
        : ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    async init() {
      // Cases
      const cases = await getCases(this)

      cases.forEach(({ fields }) => {
        images[fields.slug] = fields.map.fields.file.url
      })

      // Slider
      const selector = '#slider'
      const container = document.querySelector(selector)

      this.slider = new Slider({
        container,
        images,
        initialSlug: this.$route.params.id
      })

      window.slider = this

      this.initEvents(container)
    },
    initEvents(container) {
      // Init complete
      container.addEventListener('init:complete', () => {
        this.inited = true
        this.index = this.slider.index
        this.$emit('init', this.slider)
      })

      // Index control
      container.addEventListener('index:changed', ({ detail }) => {
        this.index = detail.i
      })

      // Click on active sphere
      container.addEventListener('click:active', () => {
        this.$router.push(`/case/${this.slider.sceneParams[this.index].slug}`)
      })

      // Case enter
      container.addEventListener('enter:complete', () => {
        anime({
          targets: '.case__container',
          duration: 800,
          easing: 'easeOutCubic',
          opacity: [0, 1]
        })
        anime({
          targets: '.case__title span',
          duration: 800,
          easing: 'easeOutCubic',
          translateY: ['100%', '0%']
        })
      })

      // Case leave
      container.addEventListener('out:begin', () => {
        anime({
          targets: '.case__container',
          duration: 600,
          easing: 'easeInCubic',
          opacity: [1, 0]
        })
        anime({
          targets: '.case__title span',
          duration: 600,
          easing: 'easeInCubic',
          translateY: ['0%', '-100%']
        })
      })

      // Menu
      // container.addEventListener('showmenu:begin', () => {
      //   this.$emit('toggle-menu', true)
      // })

      // container.addEventListener('hidemenu:complete', () => {
      //   this.$emit('toggle-menu', false)
      // })
    }
  }
  // watch: {
  //   show(show) {
  //     if (!this.inited) return false

  //     this.slider.pause()
  //     if (show) {
  //       if (loop.stopped) loop.start()
  //       this.slider.start()
  //     }
  //   }
  // }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.slider
  position: fixed
  top: 0
  left: 0

  width: 100vw
  height: 100vh
  height: calc(var(--initial-vh, 1vh) * 100)

.slider-container
  opacity: 1
  transition: opacity 0.4s ease-out
  &.hidden
    opacity: 0
    pointer-events: none

// Counter
.slider-counter
  position: absolute
  bottom: var(--unit-v)
  left: 50%
  transform: translate(-50%, 0)

  display: flex
  align-items: center
  justify-content: center

  +wood(r)
  line-height: 1
  font-size: 11px
  letter-spacing: 0.01em

  span:nth-child(2)
    background: #fff

    position: absolute
    top: 4px
    left: -1px

    width: 44px
    height: 1px
    transform: rotate(120deg)

  span:nth-child(3)
    opacity: 0.4
    margin-left: 16px

  span:nth-child(1),
  span:nth-child(3)
    width: 13px

  span:nth-child(2),
  span:nth-child(3)
    opacity: 0.4
</style>
