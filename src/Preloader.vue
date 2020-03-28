<template>
  <div class="preloader">
    <div class="preloader-cover" ref="cover"></div>
    <div class="preloader-logo u-center">
      <svg
        class="preloader-logo-icon"
        ref="logo"
        width="17"
        height="15"
        viewBox="0 0 17 15"
        fill="none"
      >
        <path
          d="M8.54923 2.78119L14.7613 13.793H14.7791L7.88757 1.55152L1.25903 13.793H1.35169L7.23469 2.79592L7.87856 1.59234L8.54923 2.78119Z"
          stroke="black"
          stroke-width="1"
          style="opacity: 0"
        />
        <path
          d="M8.54923 2.78119L14.7613 13.793H14.7791L7.88757 1.55152L1.25903 13.793H1.35169L7.23469 2.79592L7.87856 1.59234L8.54923 2.78119Z"
          stroke="white"
          stroke-width="1"
          stroke-dasharray="0 100"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import anime from 'animejs'

export default {
  name: 'Preloader',
  methods: {
    animate() {
      const first = this.$refs.logo.querySelector('path:nth-child(1)')
      const second = this.$refs.logo.querySelector('path:nth-child(2)')

      anime({
        targets: second,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutCubic',
        duration: 1000,
        delay: 200,
        complete: () => {
          anime.set(first, { opacity: 1 })

          setTimeout(() => {
            anime({
              targets: '.preloader-logo',
              easing: 'easeInOutCubic',
              duration: 400,
              opacity: 0
            })
            anime({
              targets: this.$refs.cover,
              easing: 'easeInOutSine',
              duration: 800,
              translateY: '-180%',
              rotate: -20,
              scale: 1.5
            })
          }, 200)

          setTimeout(() => {
            this.$emit('complete')
          }, 300)
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.preloader
  z-index: 10
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0

  width: 100vw
  height: 100vh

  pointer-events: none

.preloader-cover
  z-index: 1
  position: absolute
  top: 0
  left: 0

  width: 100%
  height: 100%
  background: #151515

.preloader-logo
  z-index: 2
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)

.preloader-logo-icon
  width: 80px
  height: 80px
</style>
