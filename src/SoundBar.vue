<template>
  <button :class="['sound-bar', { muted }]" @click="onClick">
    <div class="sound-bar__line"></div>
    <div class="sound-bar__line"></div>
    <div class="sound-bar__line"></div>
    <div class="sound-bar__line"></div>
    <div class="sound-bar__line"></div>
    <audio
      ref="audio"
      :src="require('./assets/ambient.mp3')"
      loop
      autoplay
      playsinline
    ></audio>
  </button>
</template>

<style lang="sass" scoped>
.sound-bar
  display: flex
  align-items: center

.sound-bar.muted
  .sound-bar__line::before
    opacity: 0
  .sound-bar__line::after
    opacity: 1
  .sound-bar__line
    &:nth-child(1)
      transform: scaleY(.2) translateZ(0)
    &:nth-child(2)
      transform: scaleY(.8) translateZ(0)
    &:nth-child(4)
      transform: scaleY(.6) translateZ(0)
    &:nth-child(5)
      transform: scaleY(.2) translateZ(0)

.sound-bar__line
  position: relative

  width: 2px
  height: 13px
  transform-origin: 50% 50%
  opacity: 0.7

  &:not(:last-child)
    margin-right: 2px

  &:nth-child(1)::before
    animation: bar1 1.2s infinite backwards
  &:nth-child(2)::before
    animation: bar2 1.4s infinite backwards
  &:nth-child(3)::before
    animation: bar3 1.1s infinite backwards
  &:nth-child(4)::before
    animation: bar4 1.3s infinite backwards
  &:nth-child(5)::before
    animation: bar5 1.3s infinite backwards

  &::after
    opacity: 0

  &::before,
  &::after
    content: ''
    position: absolute
    top: 0
    left: 0

    width: 100%
    height: 100%

    background: #fff
    transition: opacity 0.4s ease, transform 1s cubic-bezier(0.23, 1, 0.32, 1)
    transform: scaleY(1) translateZ(0)

@keyframes bar1
  0%
    transform: scaleY(.3) translateZ(0)

  50%
    transform: scaleY(.6) translateZ(0)

  100%
    transform: scale(.3) translateZ(0)

@keyframes bar2
  0%
    transform: scaleY(.8) translateZ(0)

  50%
    transform: scaleY(.5) translateZ(0)

  100%
    transform: scale(.8) translateZ(0)

@keyframes bar3
  0%
    transform: scaleY(1) translateZ(0)

  30%
    transform: scaleY(.3) translateZ(0)

  60%
    transform: scale(.6) translateZ(0)

  100%
    transform: scale(1) translateZ(0)

@keyframes bar4
  0%
    transform: scaleY(.6) translateZ(0)

  50%
    transform: scale(.4) translateZ(0)

  100%
    transform: scale(.6) translateZ(0)

@keyframes bar5
  0%
    transform: scaleY(.2) translateZ(0)

  50%
    transform: scale(.7) translateZ(0)

  100%
    transform: scale(.2) translateZ(0)
</style>

<script>
export default {
  name: 'SoundBar',
  data: () => ({
    muted: false
  }),
  methods: {
    onClick() {
      const { audio } = this.$refs

      if (audio.paused) {
        audio.play()
      } else {
        audio.pause()
      }

      this.muted = audio.paused
    }
  }
}
</script>
