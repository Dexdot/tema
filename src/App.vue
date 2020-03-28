<template>
  <div id="app">
    <Main :isMenuActive="isMenuActive" @btn-click="onMenuButtonClick" />
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

    <Preloader ref="preloader" @complete="onPreloaderComplete" />
  </div>
</template>

<script>
import Preloader from '@/Preloader'
import Slider from '@/Slider'
import Main from '@/Main.vue'
import { detectDevices } from '@/scripts/detect'

export default {
  name: 'App',
  components: {
    Preloader,
    Slider,
    Main
  },
  data: () => ({
    sceneInited: false,
    mounted: false,
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
    onSceneInit() {
      this.sceneInited = true
      this.$refs.preloader.animate()
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
        if (this.isMenuActive) return false

        this.isMenuActive = true
        await this.$refs.scene.slider.showMenu()
        resolve()
      })
    },
    hideMenu() {
      new Promise(async resolve => {
        if (!this.isMenuActive) return false

        await this.$refs.scene.slider.hideMenu()
        this.isMenuActive = false
        resolve()
      })
    },
    onMenuButtonClick(showMenu) {
      // if (this.$route.name !== 'index') return false

      if (showMenu) {
        this.showMenu()
      } else {
        this.hideMenu()
      }
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
  transition: opacity 0.25s ease
  &.hidden
    opacity: 0
    pointer-events: none
    user-select: none
</style>
