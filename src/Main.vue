<template>
  <div>
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

    <router-link
      class="play ui-btn"
      to="/"
      @mouseenter.native="hover($refs.play)"
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
    </router-link>

    <button class="wave ui-btn" @mouseenter="hover($refs.wave)">
      <svg width="22" height="12" viewBox="0 0 22 12" fill="none" ref="wave">
        <path
          d="M1 7.2623L2.28173 3.6062C3.5467 -0.00206464 8.62677 -0.0653153 9.98119 3.51034L11.642 7.89497C13.3586 12.4267 19.909 11.9838 21 7.2623V7.2623"
          stroke="white"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M1 7.2623L2.28173 3.6062C3.5467 -0.00206464 8.62677 -0.0653153 9.98119 3.51034L11.642 7.89497C13.3586 12.4267 19.909 11.9838 21 7.2623V7.2623"
          stroke="white"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <button
      class="circles ui-btn"
      @mouseenter="mouseenter"
      @mouseleave="mouseout"
    >
      <div class="circles__i" ref="circle1"></div>
      <div class="circles__i" ref="circle2"></div>
      <div class="circles__i"></div>
    </button>
  </div>
</template>

<script>
import anime from 'animejs'

const easing = 'easeInOutCirc'

const animate = (first, second) => {
  anime({
    targets: first,
    easing,
    duration: 200,
    opacity: 0.1
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
  data: () => ({
    circleAnimating: false
  }),
  created() {
    window.anime = anime
  },
  methods: {
    hover(el) {
      const first = el.querySelector('path:nth-child(1)')
      const second = el.querySelector('path:nth-child(2)')

      animate(first, second)
    },
    mouseenter() {
      if (this.circleAnimating) return false

      const c1 = this.$refs.circle1
      const c2 = this.$refs.circle2

      const tl = anime.timeline({
        begin: () => {
          this.circleAnimating = true
        },
        complete: () => {
          this.circleAnimating = false
        }
      })

      anime.set(c2, {
        translateX: '10px',
        translateY: '-10px',
        scale: 0
      })

      tl.add({
        targets: c1,
        duration: 350,
        // translateX: ['0px', '10px'],
        // scaleY: [1, 0.3],
        translateX: '10px',
        scaleY: 0.3,
        easing: 'easeInCirc'
      }).add({
        targets: c2,
        duration: 400,
        // scale: [0, 1],
        scale: 1,
        easing: 'easeOutCirc'
      })
    },
    mouseout() {
      if (this.circleAnimating) return false

      const c1 = this.$refs.circle1
      const c2 = this.$refs.circle2

      const tl = anime.timeline({
        begin: () => {
          this.circleAnimating = true
        },
        complete: () => {
          this.circleAnimating = false
        }
      })

      tl.add({
        targets: c2,
        duration: 300,
        translateX: '10px',
        translateY: '-10px',
        // scale: [1, 0],
        scale: 0,
        easing: 'easeInCirc'
      }).add({
        targets: c1,
        duration: 250,
        // translateX: ['10px', '0px'],
        // scaleY: [0.3, 1],
        translateX: '0px',
        scaleY: 1,
        easing: 'easeOutCirc'
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.ui-btn
  width: 80px
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

.wave
  position: fixed
  top: calc(var(--vh, 1vh) * 100 - 80px)
  right: 0

  padding-right: var(--unit-h)
  padding-bottom: calc(var(--unit-v) - 22px)
  align-items: flex-start
  justify-content: flex-end

.circles
  position: fixed

  top: 0
  right: 0

  justify-content: flex-end
  padding-top: calc(var(--unit-v) - 26px)
  padding-right: var(--unit-h)

  &__i
    width: 4px
    height: 4px

    border-radius: 50%
    background: #fff
    transform-origin: 50% 50%

    &:nth-child(1)
      position: absolute
      right: calc(var(--unit-h) + 10px)

    &:nth-child(2)
      position: absolute
      right: var(--unit-h)

      width: 24px
      height: 24px
      border: 1px solid #fff
      background: 0
      transform: translate(10px, -10px) scale(0)
</style>
