<template>
  <section class="slider-container slider" @click="onClick">
    <div class="slider" id="slider"></div>
    <h1 class="slider-title">
      <span ref="title">{{ title }}</span>
    </h1>

    <div class="slider-counter">
      <span>{{ num }}</span>
      <span></span>
      <span>{{ len }}</span>
    </div>
  </section>
</template>

<script>
import anime from 'animejs'

import three from '@/gl/ThreeSlider'
import Slider from '@/gl/Slider'
import { getCases } from '@/scripts/api'

const images = {}

export default {
  name: 'Slider',
  props: ['scroll', 'detect', 'isMenuActive'],
  data: () => ({
    slider: null,
    title: ''
  }),
  computed: {
    num() {
      return this.slider ? `0${this.slider.index + 1}` : ''
    },
    len() {
      return this.slider
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
    container.addEventListener('init-complete', () => {
      this.title = this.slider.sceneParams[this.slider.index].title
      this.$emit('init', this.slider)
    })
    container.addEventListener('slide-start', this.onSlideStart.bind(this))
  },
  methods: {
    onSlideStart({ detail }) {
      const targets = this.$refs.title

      anime({
        targets,
        duration: 600,
        easing: 'easeInCubic',
        translateY: '-100%',
        complete: () => {
          this.title = this.slider.sceneParams[detail.i].title
          anime({
            targets,
            duration: 800,
            easing: 'easeOutCubic',
            translateY: ['100%', '0%']
          })
        }
      })
    },
    onClick() {
      this.$router.push(
        `/case/${this.slider.sceneParams[this.slider.index].slug}`
      )
    }
  },
  watch: {
    'scroll.counter'() {
      let dir = 'next'
      if (this.detect.isSafari || this.detect.isMobileDevice) {
        dir = this.scroll.direction === 1 ? 'next' : 'back'
      } else {
        dir = this.scroll.deltaY < 0 ? 'next' : 'back'
      }
      this.slider.indexControl(dir)
    },
    isMenuActive(isActive) {
      if (isActive) {
        this.slider.inMenu()
        anime({
          targets: '.slider-title, .slider-counter',
          duration: 300,
          easing: 'easeInCubic',
          opacity: 0
        })
      } else {
        this.slider.outMenu()
        anime({
          targets: '.slider-title, .slider-counter',
          duration: 300,
          delay: 300,
          easing: 'easeOutCubic',
          opacity: 1
        })
      }
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

.slider-container
  opacity: 0
  transition: opacity 0.6s ease-out
  &.visible
    opacity: 1

// Title
.slider-title
  +wood(r)
  +yo('font-size', (320px: 40px, 1300px: 80px, 1920px: 124px, 2550px: 156px))
  line-height: 1.2
  letter-spacing: -0.01em

  position: fixed
  top: 50vh
  left: 50%
  transform: translate(-50%, -50%)

  white-space: nowrap
  overflow: hidden

  span
    display: inline-block
    will-change: transform

body.is-safari,
body.is-mob
  .slider-title
    top: 50%

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
