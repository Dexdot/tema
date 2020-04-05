<template>
  <div class="preloader">
    <div class="preloader-cover" ref="cover"></div>
    <div class="preloader-logo u-center">
      <svg
        class="preloader-logo-icon"
        ref="logo"
        width="136"
        height="115"
        viewBox="0 0 136 115"
        fill="none"
      >
        <path
          d="M4 112L68.2747 8L132.326 112"
          stroke="black"
          stroke-width="8"
          stroke-dasharray="0 245"
        />
        <path
          d="M4 112L68.2747 8L132.326 112"
          stroke="white"
          stroke-width="8"
          stroke-dasharray="0 245"
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
      const { logo } = this.$refs
      const black = logo.querySelector('path:nth-child(1)')
      const white = logo.querySelector('path:nth-child(2)')

      anime({
        targets: [black, white],
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutCubic',
        duration: 800
      })

      setTimeout(() => {
        anime.set(logo, { scale: '-1, 1' })

        this.$emit('complete')

        anime({
          targets: white,
          strokeDashoffset: anime.setDashoffset,
          easing: 'easeInOutCubic',
          duration: 600,
          complete: () => {
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
              translateX: window.innerWidth <= 500 ? '-25%' : '0%',
              translateY: '-180%',
              rotate: -20,
              scale: 1.5
            })
          }
        })
      }, 800)
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
  width: 40px
  height: 40px
</style>
