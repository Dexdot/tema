<template>
  <section class="inside">
    <div class="inside" id="inside"></div>
  </section>
</template>

<script>
import anime from 'animejs'

import three from '@/gl/ThreeInside'
import Inside from '@/gl/Inside'

export default {
  name: 'Inside',
  data: () => ({
    inside: null
  }),
  mounted() {
    this.inside = new Inside({
      selector: '#inside',
      url: 'https://lexa307.github.io/inside/textures/cubemaps/Frame 9.8.jpg',
      three
    })
  },
  beforeDestroy() {
    anime({
      targets: this.$el,
      opacity: 0,
      duration: 200,
      easing: 'easeInCubic',
      complete: () => {
        this.inside.destroy()
      }
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
</style>
