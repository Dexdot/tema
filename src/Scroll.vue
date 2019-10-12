<template>
  <main class="scroll-container">
    <div
      class="scroll-inner"
      ref="inner"
      :style="{ transform: `translate3d(0, -${this.scroll.translate}px, 0)` }"
    >
      <slot></slot>
    </div>
  </main>
</template>

<script>
import VirtualScroll from 'virtual-scroll'

import loop from '@/scripts/loop'
import { isSafari, isMACOS, isMobileDevice } from '@/scripts/detect'

const roundDec = n => Math.round(n * 100) / 100
const lerp = (a, b, n) => (1 - n) * a + n * b

const detectDevices = () => {
  const detect = {
    isMACOS: isMACOS(),
    isSafari: isSafari(),
    isMobileDevice: isMobileDevice()
  }

  if (detect.isMACOS) {
    document.querySelector('body').classList.add('is-macos')
  }
  if (detect.isSafari) {
    document.querySelector('body').classList.add('is-safari')
  }
  if (detect.isMobileDevice) {
    document.querySelector('body').classList.add('is-mob')
  }

  return detect
}

export default {
  name: 'App',
  data: () => ({
    scroll: {
      isNotScrolling: true,
      val: 0,
      translate: 0,
      deltaY: 0,
      winHeight: 0
    },
    vs: null,
    detect: {}
  }),
  mounted() {
    this.detect = detectDevices()

    // Window height
    this.getWinHeight()
    window.addEventListener('resize', this.getWinHeight.bind(this))

    // Start RAF
    loop.start()

    // On Scroll
    this.vs = new VirtualScroll({
      mouseMultiplier: 0.8,
      touchMultiplier: 4,
      firefoxMultiplier: 25,
      passive: true
    })

    if (this.detect.isSafari || this.detect.isMobileDevice) {
      window.addEventListener('scroll', this.defaultScroll.bind(this))
      // this.scroll.isNotScrolling = true
    } else {
      this.vs.on(this.onScroll)
      loop.add(this.checkSmooth.bind(this), 'checkSmooth')
    }
  },
  methods: {
    getTranslate() {
      return this.detect.isSafari || this.detect.isMobileDevice
        ? this.scroll.val
        : this.scroll.translate
    },
    getWinHeight() {
      this.scroll.winHeight = window.innerHeight
    },
    onScroll({ deltaY }) {
      // this.scroll.isNotScrolling = false

      this.scroll.deltaY = deltaY
      const scroll = this.scroll.val + -1 * deltaY

      this.scroll.val = Math.min(
        Math.max(scroll, 0),
        this.$refs.inner.getBoundingClientRect().height - this.scroll.winHeight
      )
    },
    checkSmooth() {
      const roundTranslate = Math.round(this.scroll.translate)
      const roundScroll = Math.round(this.scroll.val)

      if (roundScroll !== roundTranslate) {
        this.scroll.translate = roundDec(
          lerp(this.scroll.translate, this.scroll.val, 0.03)
        )

        // Round scroll (chrome transform bluring)
        if (
          roundTranslate >= roundScroll - 1 &&
          roundTranslate <= roundScroll + 1
        ) {
          // this.scroll.isNotScrolling = true
          this.scroll.translate = Math.round(
            lerp(this.scroll.translate, this.scroll.val, 0.03)
          )
        }

        // if (
        //   roundTranslate >= roundScroll - 50 &&
        //   roundTranslate <= roundScroll + 50
        // ) {
        //   this.scroll.isNotScrolling = true
        // }
      }
    },
    defaultScroll({ deltaY }) {
      this.scroll.deltaY = deltaY
      this.scroll.val = window.pageYOffset
    }
  }
}
</script>

<style lang="sass" scoped>
.scroll-container
  width: 100vw

.scroll-container
  height: 100vh
  height: calc(var(--vh, 1vh) * 100)
  overflow: hidden
</style>
