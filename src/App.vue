<template>
  <div id="app">
    <Menu :active="isMenuActive" />
    <Main :isMenuActive="isMenuActive" @toggle-menu="toggleMenu" />

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
import Menu from '@/Menu'
import Main from '@/Main.vue'
import Scroll from '@/Scroll'
import transitions from '@/transitions/'
import { isFirefox } from '@/scripts/detect'

export default {
  name: 'App',
  components: {
    Menu,
    Main,
    Scroll
  },
  data: () => ({
    mounted: false,
    isMenuActive: false,
    dir: {}
  }),
  computed: {
    hideContent() {
      return this.$route.name === 'index' ? false : this.isMenuActive
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
    disableScroll(v) {
      this.$refs.scroll.scroll.disable = v
    },
    toggleMenu(transition = false) {
      this.isMenuActive = !this.isMenuActive
      if (transition) this.disableScroll(this.isMenuActive)
    },
    resetScroll() {
      this.$refs.scroll.scroll.val = 0
      this.$refs.scroll.scroll.translate = 0
      window.scrollTo(0, 0)
    },
    async enter(el, done) {
      const asyncPages = ['index', 'case']
      const trs = this.dir.to.name

      const go = async () => {
        await transitions[trs].enter(this.$refs.view)
        done()
        this.disableScroll(false)
      }

      if (asyncPages.includes(trs)) {
        el.addEventListener('init-complete', () => {
          go()
        })
      } else {
        go()
      }
    },
    async leave(el, done) {
      if (this.isMenuActive) this.toggleMenu(true)
      this.disableScroll(true)

      const trs = this.dir.from.name
      await transitions[trs].leave(this.$refs.view)
      this.resetScroll()
      done()
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
