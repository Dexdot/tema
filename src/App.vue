<template>
  <div id="app" @keydown="onKeydown">
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
import { detectDevices } from '@/scripts/detect'

export default {
  name: 'App',
  components: {
    Preloader,
    Showreel,
    Slider,
    Main
  },
  data: () => ({
    sceneInited: false,
    mounted: false,
    isPointersLockActive: false,
    isShowreelActive: false,
    isMenuActive: false,
    dir: {},
    detect: {}
  }),
  computed: {
    hideContent() {
      return this.$route.name === 'index' ? false : this.isMenuActive
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.mounted = true

      detectDevices()
    })
  },
  methods: {
    onKeydown({ keyCode }) {
      if (keyCode !== 32 || this.isMenuActive || this.$route.name !== 'case')
        return false

      if (this.isPointersLockActive) {
        this.$refs.scene.slider.hidePointersLock()
      } else {
        this.$refs.scene.slider.showPointersLock()
      }
    },
    onSceneInit() {
      this.sceneInited = true

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
  top: 50%
  right: var(--unit-h)
  transform: translateY(-50%)

  opacity: 0
  pointer-events: none
  user-select: none

  transition: opacity 0.25s ease

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
