<template>
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
import charming from 'charming'

import Slider from '@/gl/Slider'
import { getCases } from '@/scripts/api'

const images = {}

export default {
  name: 'Slider',
  props: ['detect'],
  data: () => ({
    index: 0,
    inited: false,
    slider: null
  }),
  computed: {
    num() {
      const index = this.index === 0 ? this.sliderLength : this.index
      const i = this.sliderLength - index
      const num = this.inited ? `0${i + 1}` : ''

      return num
    },
    len() {
      return this.inited ? `0${this.sliderLength}` : ''
    },
    sliderLength() {
      return Object.keys(this.slider.sceneParams).length
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

      // Click on contact link (mail)
      container.addEventListener('click:contact', () => {
        window.location.href = 'mailto:artemartsokolov@gmail.com'
      })

      // Case enter
      container.addEventListener('enter:complete', () => {
        this.caseEnter()
      })

      // Case leave
      container.addEventListener('out:begin', () => {
        this.caseLeave()
      })
    },
    caseEnter() {
      // Container
      anime({
        targets: '.case__back, .case__cursor-text, .case__container',
        duration: 800,
        easing: 'easeOutCubic',
        opacity: [0, 1]
      })

      // Show title
      const title = document.querySelector('.case__title span')
      charming(title)
      const chars = title.querySelectorAll('span')
      chars.forEach(char => {
        char.classList.add('case-title-char')
        if (char.textContent === ' ') char.classList.add('is-space')
      })

      anime.set(chars, { translateY: '100%' })
      anime.set('.case__title', { opacity: 1 })

      anime({
        targets: chars,
        translateY: '0%',
        easing: 'easeOutQuart',
        duration: 800,
        delay: anime.stagger(30),
        complete: () => {
          setTimeout(() => {
            document.body.classList.add('scrollable')
            // this.slider.pause()
          }, 200)
        }
      })
    },
    caseLeave() {
      document.body.classList.remove('scrollable')
      if (!this.slider.RAF) this.slider.play()

      anime({
        targets:
          '.case__back, .case__cursor-text, .case__title, .case__container, .next',
        duration: 600,
        easing: 'easeInCubic',
        opacity: [1, 0]
      })
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
  color: #fff

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
