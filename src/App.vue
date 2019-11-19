<template>
  <div id="app">
    <!-- <Main :isMenuActive="isMenuActive" @btn-click="onMenuButtonClick" /> -->
    <Main :isMenuActive="isMenuActive" />
    <Slider
      ref="scene"
      :show="showScene"
      :detect="detect"
      @toggle-menu="toggleMenu"
      @init="onSceneInit"
    />

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
  </div>
</template>

<script>
import Slider from '@/Slider'
import Main from '@/Main.vue'
import { detectDevices } from '@/scripts/detect'

export default {
  name: 'App',
  components: {
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
    },
    showScene() {
      return this.sceneInited
        ? ['index', 'case'].includes(this.$route.name)
        : false
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
      if (this.$route.name === 'case') this.$refs.scene.slider.enter(true)
    },
    onMenuButtonClick(showMenu) {
      if (showMenu) {
        this.$refs.scene.slider.showMenu()
      } else {
        this.$refs.scene.slider.hideMenu()
      }
    },
    toggleMenu(v) {
      this.isMenuActive = v
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
      // if (this.isMenuActive) await this.$refs.scene.slider.hideMenu()

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

// body.is-macos:not(.is-safari)
//   overflow: hidden
</style>

<style lang="sass" scoped>
.wrapper
  transition: opacity 0.25s ease
  &.hidden
    opacity: 0
    pointer-events: none
    user-select: none
</style>
