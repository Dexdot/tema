<template>
  <div id="app">
    <Main :isMenuActive="isMenuActive" @btn-click="onMenuButtonClick" />
    <Slider
      ref="scene"
      :show="showScene"
      :scroll="$refs.scroll && $refs.scroll.scroll"
      :detect="$refs.scroll && $refs.scroll.detect"
      @toggle-menu="toggleMenu"
      @init="onSceneInit"
    />

    <div :class="['scroll', { hidden: hideContent }]">
      <Scroll ref="scroll">
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
            :scroll="$refs.scroll && $refs.scroll.scroll"
            :detect="$refs.scroll && $refs.scroll.detect"
            :isMenuActive="isMenuActive"
            @disable-scroll="disableScroll"
          />
        </transition>
      </Scroll>
    </div>
  </div>
</template>

<script>
import Slider from '@/Slider.vue'
import Main from '@/Main.vue'
import Scroll from '@/Scroll'
import { isFirefox } from '@/scripts/detect'

export default {
  name: 'App',
  components: {
    Slider,
    Main,
    Scroll
  },
  data: () => ({
    sceneInited: false,
    mounted: false,
    isMenuActive: false,
    dir: {}
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

      if (isFirefox()) {
        document.body.classList.add('is-firefox')
      }
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
    disableScroll(v) {
      this.$refs.scroll.scroll.disable = v
    },
    toggleMenu(v) {
      this.isMenuActive = v
    },
    resetScroll() {
      this.$refs.scroll.scroll.val = 0
      this.$refs.scroll.scroll.translate = 0
      window.scrollTo(0, 0)
    },
    async enter(el, done) {
      const { name } = this.dir.to

      if (name === 'case' && this.sceneInited) {
        await this.$refs.scene.slider.in()
        done()
      } else {
        done()
      }
      this.disableScroll(false)
    },
    async leave(el, done) {
      if (this.isMenuActive) await this.$refs.scene.slider.hideMenu()

      const { name } = this.dir.from
      if (name === 'case' && this.sceneInited) {
        await this.$refs.scene.slider.out()
        this.resetScroll()
        done()
      } else {
        this.resetScroll()
        done()
      }

      this.disableScroll(true)
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

body.is-macos:not(.is-safari)
  overflow: hidden

body.is-safari,
body.is-mob
  .scroll-container
    overflow: unset !important
    height: auto !important
  .scroll-inner
    transform: unset !important
</style>

<style lang="sass" scoped>
.scroll
  transition: opacity 0.25s ease
  &.hidden
    opacity: 0
    pointer-events: none
    user-select: none
</style>
