<template>
  <section class="slider-container slider">
    <div class="slider" id="slider"></div>
    <h1 class="slider-title">
      <span ref="title">{{ title }}</span>
    </h1>

    <div class="slider-counter" v-if="inited">
      <span>{{ num }}</span>
      <span></span>
      <span>{{ len }}</span>
    </div>
  </section>
</template>

<script>
import three from '@/gl/ThreeSlider'
import Slider from '@/gl/Slider'
import { getCases } from '@/scripts/api'

const images = {}

export default {
  name: 'Slider',
  props: ['scroll', 'detect', 'isMenuActive'],
  data: () => ({
    index: 0,
    inited: false,
    slider: null,
    title: ''
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
  async mounted() {
    // Cases
    const cases = await getCases(this)

    cases.forEach(({ fields }) => {
      images[fields.slug] = fields.map.fields.file.url
    })

    // Slider
    const selector = '#slider'
    const container = document.querySelector(selector)
    this.slider = new Slider({
      selector,
      images,
      three
    })

    // Init complete
    container.addEventListener('init:complete', () => {
      console.log('init:complete')

      this.inited = true
      this.index = this.slider.index
      this.$emit('init', this.slider)

      window.slider = this.slider
    })

    // Index control
    container.addEventListener('index:changed', ({ detail }) => {
      this.index = detail.i
    })

    // Go to main
    container.addEventListener('out:complete', () => {
      this.$router.push('/')
    })

    // Go to case
    container.addEventListener('enter:complete', () => {
      this.$router.push(`/case/${this.slider.sceneParams[this.index].slug}`)
    })
  },
  watch: {
    'scroll.counter'() {
      if (!this.inited) return false

      let dir = 'next'

      if (this.detect.isSafari || this.detect.isMobileDevice) {
        dir = this.scroll.direction === 1 ? 'next' : 'back'
      } else {
        dir = this.scroll.deltaY < 0 ? 'next' : 'back'
      }

      this.slider.indexControl(dir)
    }
  }
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

// .slider-container
//   opacity: 0
//   transition: opacity 0.6s ease-out
//   &.visible
//     opacity: 1

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
