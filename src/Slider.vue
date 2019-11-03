<template>
  <section class="slider" @click="onClick">
    <div class="slider" id="slider"></div>
  </section>
</template>

<script>
import three from '@/gl/ThreeSlider'
import Slider from '@/gl/Slider'

import { getCases } from '@/scripts/api'

const images = {}

export default {
  name: 'Slider',
  props: ['scroll'],
  data: () => ({
    slider: null
  }),
  async mounted() {
    const cases = await getCases(this)

    cases.forEach(({ fields }) => {
      images[fields.slug] = fields.map.fields.file.url
    })

    const selector = '#slider'
    this.slider = new Slider({
      selector,
      images,
      three
    })
    document.querySelector(selector).addEventListener('complete', () => {
      this.$emit('init', this.slider)
    })
  },
  methods: {
    onClick() {
      this.$router.push(
        `/case/${this.slider.sceneParams[this.slider.index].slug}`
      )
    }
  },
  watch: {
    'scroll.counter'() {
      const dir = this.scroll.deltaY < 0 ? 'next' : 'back'
      this.slider.indexControl(dir)
    }
  }
}
</script>

<style lang="sass" scoped>
.slider
  position: fixed
  top: 0
  left: 0

  width: 100vw
  height: 100vh

#slider
  opacity: 0
  transition: opacity 0.6s ease-out
  &.visible
    opacity: 1
</style>
