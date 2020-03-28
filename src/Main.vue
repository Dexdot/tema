<template>
  <div class="main">
    <router-link
      class="logo ui-btn"
      to="/"
      @mouseenter.native="hover($refs.logo)"
    >
      <svg width="17" height="15" viewBox="0 0 17 15" fill="none" ref="logo">
        <path
          d="M8.54923 2.78119L14.7613 13.793H14.7791L7.88757 1.55152L1.25903 13.793H1.35169L7.23469 2.79592L7.87856 1.59234L8.54923 2.78119Z"
          stroke="white"
          stroke-width="1.5"
        />
        <path
          d="M8.54923 2.78119L14.7613 13.793H14.7791L7.88757 1.55152L1.25903 13.793H1.35169L7.23469 2.79592L7.87856 1.59234L8.54923 2.78119Z"
          stroke="white"
          stroke-width="1.5"
        />
      </svg>
    </router-link>

    <a
      class="play ui-btn"
      href="https://vimeo.com/401593355"
      target="_blank"
      @mouseenter="hover($refs.play)"
    >
      <svg width="14" height="17" viewBox="0 0 14 17" fill="none" ref="play">
        <path
          d="M1.2 1.87975L12.6 8.46155L1.2 15.0433L1.2 1.87975Z"
          stroke="white"
          stroke-width="1.4"
        />
        <path
          d="M1.2 1.87975L12.6 8.46155L1.2 15.0433L1.2 1.87975Z"
          stroke="white"
          stroke-width="1.4"
        />
      </svg>
    </a>

    <div class="sound ui-btn">
      <SoundBar />
    </div>

    <MenuButton
      @click="$emit('btn-click', !isMenuActive)"
      :isMenuActive="isMenuActive"
    />
  </div>
</template>

<script>
import anime from 'animejs'
import MenuButton from '@/MenuButton'
import SoundBar from '@/SoundBar'

const easing = 'easeInOutCirc'

const animate = (first, second) => {
  anime({
    targets: first,
    easing,
    duration: 200,
    opacity: 0.3
  })

  anime({
    targets: second,
    strokeDashoffset: [anime.setDashoffset, 0],
    easing,
    duration: 1000,
    delay: 200,
    complete: () => {
      anime({
        targets: first,
        easing,
        duration: 200,
        opacity: 1
      })
    }
  })
}

export default {
  name: 'Main',
  props: {
    isMenuActive: { type: Boolean, default: false }
  },
  components: {
    MenuButton,
    SoundBar
  },
  methods: {
    hover(el) {
      const first = el.querySelector('path:nth-child(1)')
      const second = el.querySelector('path:nth-child(2)')

      animate(first, second)
    }
  }
}
</script>

<style lang="sass" scoped>
.main
  position: relative
  z-index: 2

.ui-btn
  min-width: 80px
  height: 80px
  display: flex
  position: fixed

.logo
  top: 0
  left: 0

  padding-top: var(--unit-v)
  padding-left: var(--unit-h)

.play
  position: fixed
  top: calc(var(--vh, 1vh) * 100 - 80px)
  left: 0

  padding-left: var(--unit-h)
  padding-bottom: var(--unit-v)
  align-items: flex-end

.sound
  position: fixed
  top: calc(var(--vh, 1vh) * 100 - 80px)
  right: 0

  padding-right: var(--unit-h)
  padding-bottom: calc(var(--unit-v))
  align-items: flex-end
  justify-content: flex-end
</style>
