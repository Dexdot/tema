<template>
  <section class="next">
    <span class="next-counter" ref="counter">{{ counter }}</span>
  </section>
</template>

<script>
import anime from 'animejs'

export default {
  name: 'Next',
  data: () => ({
    easing: 'cubicBezier(0.25, 0.1, 0.25, 1)',
    isAnimating: false,
    counter: 5,
    counterEl: null
  }),
  mounted() {
    this.counterEl = this.$refs.counter
    this.observe()
  },
  methods: {
    startCount() {
      const tl = anime.timeline({
        delay: this.counter === 5 ? 300 : 0,
        easing: this.easing,
        complete: () => {
          if (this.counter <= 1) {
            this.isAnimating = false
            this.$emit('complete')
          } else {
            this.counter--
            this.startCount()
          }
        }
      })

      const duration = 200
      const show = targets => ({
        translateY: ['-15%', '0%'],
        targets,
        duration
      })
      const hide = targets => ({
        translateY: ['0%', '15%'],
        targets,
        duration,
        delay: duration * 1.5
      })

      tl.add(show(this.counterEl)).add(hide(this.counterEl))
    },
    stopCount() {
      this.isAnimating = false
      anime.remove(this.counterEl)
      anime({
        targets: this.counterEl,
        opacity: 0,
        duration: 200,
        easing: this.easing,
        complete: () => {
          this.counter = 5
        }
      })
    },
    observe() {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.intersectionRatio >= 0.4) {
              if (!this.isAnimating) {
                this.isAnimating = true
                this.startCount()
              }
            } else {
              this.stopCount()
            }
          })
        },
        { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
      )
      observer.observe(this.$el)
    }
  }
}
</script>

<style lang="sass" scoped>
.next
  opacity: 0
  pointer-events: none

  position: relative

  width: 100vw
  height: 101vh

.next-counter
  z-index: -1
  position: absolute
  top: 0
  left: 0

  opacity: 0
  pointer-events: none
</style>
