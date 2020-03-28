<template>
  <section class="next">
    <div class="next-circle" v-show="showCircle">
      <!-- <span class="next-circle-text">Back</span> -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r="35"
          fill="none"
          stroke-miterlimit="10"
          stroke-width="2"
        ></circle>
        <circle
          cx="36"
          cy="36"
          r="35"
          fill="none"
          stroke-miterlimit="10"
          stroke-width="2"
          class="next-circle-stroke"
          ref="circle"
        ></circle>
      </svg>
    </div>
  </section>
</template>

<script>
import drawSvg from '@/scripts/draw-svg'

export default {
  name: 'Next',
  data: () => ({
    isAnimating: false,
    timers: [],
    killCounter: null,
    showCircle: false
  }),
  mounted() {
    this.observe()
  },
  methods: {
    startCount() {
      this.isAnimating = true

      const t1 = setTimeout(() => {
        this.killCounter = drawSvg({
          el: this.$refs.circle,
          duration: 1.2,
          options: {
            ease: window.Power2.easeInOut,
            onComplete: () => {
              const t2 = setTimeout(() => {
                this.isAnimating = false
                this.$emit('complete')
              }, 600)
              this.timers.push(t2)
            }
          }
        })
      }, 1000)
      this.timers.push(t1)
    },
    stopCount() {
      this.timers.forEach(timer => {
        clearTimeout(timer)
      })
      if (this.killCounter) this.killCounter()
      this.isAnimating = false
    },
    observe() {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            this.showCircle = entry.isIntersecting

            if (entry.intersectionRatio >= 0.4) {
              if (!this.isAnimating) {
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
  pointer-events: none
  position: relative

  width: 100vw
  height: 101vh

.next-circle-text
  color: #fff
  display: block

  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)

.next-circle,
.next-circle svg
  width: 72px
  height: 72px

.next-circle
  position: fixed
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)

  text-align: center

  circle
    stroke: #fff

    &:not(.next-circle-stroke)
      stroke-dasharray: 219.556
      opacity: 0.3

.next-circle-stroke
  stroke-dasharray: 0 219.556
</style>
