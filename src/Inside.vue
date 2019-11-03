<template>
  <section class="inside">
    <div class="inside" id="inside"></div>
  </section>
</template>

<script>
import three from '@/gl/ThreeInside'
import Inside from '@/gl/Inside'

export default {
  name: 'Inside',
  data: () => ({
    inside: null
  }),
  mounted() {
    const selector = '#inside'
    this.inside = new Inside({
      selector,
      url: 'https://lexa307.github.io/inside/textures/cubemaps/Frame 9.8.jpg',
      three
    })
    document.querySelector(selector).addEventListener('complete', () => {
      this.$emit('init', this.inside)
    })
  }
}
</script>

<style lang="sass" scoped>
.inside
  position: fixed
  top: 0
  left: 0

  width: 100vw
  height: 100vh

#inside
  transition: opacity 1s cubic-bezier(0.445, 0.05, 0.55, 0.95)
  opacity: 0
  &.visible
    opacity: 1
</style>
