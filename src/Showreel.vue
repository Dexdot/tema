<template>
  <transition name="showreel">
    <section class="showreel" v-show="active">
      <button class="showreel__close" @click="$emit('showreel-close')">
        Close
      </button>
      <div class="showreel__container">
        <div class="showreel__video">
          <iframe
            ref="iframe"
            src="https://player.vimeo.com/video/401593355?title=0&byline=0&portrait=0&api=1"
            frameborder="0"
            allow="fullscreen"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>
  </transition>
</template>

<script>
export default {
  name: 'Showreel',
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    active(active) {
      if (active) {
        // stop audio
        document.querySelector('audio').pause()
      } else {
        // stop video
        const player = window.$f(this.$refs.iframe)
        if (player) player.api('pause')
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

/* ENTER */
.showreel-leave-to,
.showreel-enter
  opacity: 0
  pointer-events: none

.showreel-leave,
.showreel-enter-to
  opacity: 1
  pointer-events: auto

.showreel-enter-active,
.showreel-leave-active
  transition: 0.6s ease-in-out

.showreel
  z-index: 2
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0

  width: 100vw
  height: 100vh
  height: calc(var(--vh, 1vh) * 100)

  background: rgba(#000, 0.7)

.showreel__close
  position: absolute
  top: calc(var(--unit-v) - 4px)
  right: var(--unit-h)

  line-height: 1
  font-size: 12px
  letter-spacing: 0.07em
  color: #fff

  @media (max-width: 500px)
    top: calc(var(--unit-v) + 4px)

.showreel__container
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)

  width: 80vw
  max-width: 100%

.showreel__video
  position: relative
  &::before
    content: ''
    display: block
    padding-top: 56.25%

  iframe
    position: absolute
    top: 0
    left: 0

    width: 100%
    height: 100%
</style>
