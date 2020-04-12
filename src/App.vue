<template>
  <div id="app">
    <ul :class="['social', { 'social--visible': isMenuActive }]">
      <li>
        <a href="https://www.behance.net/artartem" class="u-center">
          <img src="@/assets/be.svg" alt="Behance" />
        </a>
      </li>
      <li>
        <a href="https://www.instagram.com/artemartsokolov/" class="u-center">
          <img src="@/assets/insta.svg" alt="Instagram" />
        </a>
      </li>
    </ul>

    <Main
      :isMenuActive="isMenuActive"
      @btn-click="onMenuButtonClick"
      @showreel-click="onShowreelBtnClick"
    />
    <Slider ref="scene" :detect="detect" @init="onSceneInit" />

    <div :class="['wrapper', { hidden: hideContent }]">
      <transition
        v-if="mounted"
        @enter="enter"
        @leave="leave"
        :css="false"
        mode="out-in"
      >
        <router-view
          ref="view"
          :key="$route.path"
          :detect="detect"
          :isMenuActive="isMenuActive"
        />
      </transition>
    </div>

    <CursorCircle :hidden="hideCursor" v-if="useCursor" />

    <Showreel
      :active="isShowreelActive"
      @showreel-close="isShowreelActive = false"
    />
    <Preloader ref="preloader" @complete="onPreloaderComplete" />
  </div>
</template>

<script>
import Preloader from '@/Preloader'
import Showreel from '@/Showreel'
import Slider from '@/Slider'
import Main from '@/Main.vue'
import CursorCircle from '@/CursorCircle'
import { detectDevices } from '@/scripts/detect'

import drawSvg from '@/scripts/draw-svg'

export default {
  name: 'App',
  components: {
    Preloader,
    Showreel,
    Slider,
    Main,
    CursorCircle
  },
  data: () => ({
    sceneInited: false,
    mounted: false,
    isMousePressed: false,
    isPointersLockActive: false,
    isShowreelActive: false,
    isMenuActive: false,
    dir: {},
    detect: {}
  }),
  computed: {
    hideCursor() {
      return !this.isMousePressed || this.isPointersLockActive
    },
    useCursor() {
      return (
        this.sceneInited &&
        this.$route.name === 'case' &&
        !this.detect.isMobileDevice
      )
    },
    hideContent() {
      return this.$route.name === 'index'
        ? false
        : this.isMenuActive || this.isPointersLockActive
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.mounted = true

      window.$app = this
      this.detect = detectDevices()
    })
  },
  methods: {
    handlePointersLock() {
      const { slider } = this.$refs.scene
      const { TweenMax } = window

      document.addEventListener('mousedown', e => {
        const closestBtn = e.target.closest('button')
        const closestLink = e.target.closest('a')
        if (closestBtn || closestLink) return false

        this.isMousePressed = true

        if (!slider.inMenu && slider.insideSphere.visible && !slider.moving) {
          slider.sphereAnim = TweenMax.to(slider, 2, { time: 10.34 })
          this.fillCursor()

          slider.timer = setTimeout(() => {
            slider.timer = clearTimeout(slider.timer)
            this.showPointersLock()
          }, 2000)
        }
      })

      document.addEventListener('mouseup', e => {
        const closestBtn = e.target.closest('button')
        const closestLink = e.target.closest('a')
        if (closestBtn || closestLink) return false

        this.isMousePressed = false

        if (!slider.inMenu && slider.insideSphere.visible && !slider.moving) {
          slider.sphereAnim = TweenMax.to(slider, 1, { time: 10.32 })
          slider.timer = clearTimeout(slider.timer)
          this.hidePointersLock()
          this.unfillCursor()
        }
      })
    },
    fillCursor() {
      const el = document.querySelector('.cursor__inner circle:last-child')
      drawSvg({
        el,
        duration: 2,
        options: {
          ease: window.Power2.easeInOut
        }
      })
    },
    unfillCursor() {
      const el = document.querySelector('.cursor__inner circle:last-child')
      drawSvg({
        el,
        duration: 1,
        options: {
          ease: window.Power2.easeInOut,
          length: 0
        }
      })
    },
    onSceneInit() {
      this.sceneInited = true

      this.handlePointersLock()

      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.preloader.animate()
        }, 50)
      })
    },
    onPreloaderComplete() {
      if (this.$route.name === 'case') {
        this.$refs.scene.slider.enter(true)
      } else {
        this.$refs.scene.slider.firstAnim()
      }
    },
    showPointersLock() {
      new Promise(async resolve => {
        if (this.isMenuActive) return false

        this.isPointersLockActive = true
        await this.$refs.scene.slider.showPointersLock()
        resolve()
      })
    },
    hidePointersLock() {
      new Promise(async resolve => {
        if (this.isMenuActive) return false

        await this.$refs.scene.slider.hidePointersLock()
        this.isPointersLockActive = false
        resolve()
      })
    },
    showMenu() {
      new Promise(async resolve => {
        if (this.isMenuActive || this.isPointersLockActive) return false

        this.isMenuActive = true
        await this.$refs.scene.slider.showMenu()
        resolve()
      })
    },
    hideMenu() {
      new Promise(async resolve => {
        if (!this.isMenuActive || this.isPointersLockActive) return false

        const menuBtn = document.querySelector('button.circles')
        menuBtn.blur()

        await this.$refs.scene.slider.hideMenu()
        this.isMenuActive = false
        resolve()
      })
    },
    onMenuButtonClick(showMenu) {
      if (showMenu) {
        this.showMenu()
      } else {
        this.hideMenu()
      }
    },
    onShowreelBtnClick() {
      if (this.isMenuActive || this.isPointersLockActive) return false

      this.isShowreelActive = true
    },
    async enter(el, done) {
      const { name } = this.dir.to

      if (name === 'case' && this.sceneInited) {
        await this.$refs.scene.slider.in()
        done()
      } else {
        done()
      }
    },
    async leave(el, done) {
      if (this.isMenuActive) await this.hideMenu()

      const { name } = this.dir.from
      if (name === 'case' && this.sceneInited) {
        await this.$refs.scene.slider.out()
        done()
      } else {
        done()
      }
    }
  },
  watch: {
    $route(to, from) {
      this.dir = { to, from }
    }
  }
}
</script>

<style lang="sass">
body
  color: #fff
  background: #000

  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: #fff

body:not(.scrollable)
  overflow: hidden
</style>

<style lang="sass" scoped>
.wrapper
  transition: opacity 0.3s ease 1s

  &.hidden
    opacity: 0
    pointer-events: none
    user-select: none

    transition: opacity 0.25s ease

.social
  z-index: 1
  position: fixed
  right: var(--unit-h)

  opacity: 0
  pointer-events: none
  user-select: none

  transition: opacity 0.25s ease

  @media (min-width: 501px)
    top: 50%
    transform: translateY(-50%)

  @media (max-width: 500px)
    bottom: 16vh

.social--visible
  opacity: 1
  pointer-events: auto
  user-select: auto

  transition: opacity 0.25s ease 1s

.social li:not(:last-child)
  margin-bottom: 16px

.social a
  width: 16px
</style>
