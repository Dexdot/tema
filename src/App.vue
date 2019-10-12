<template>
  <div id="app">
    <Menu :active="isMenuActive" />
    <Main />

    <Scroll ref="scroll">
      <transition
        v-if="mounted"
        @enter="enter"
        @leave="leave"
        :css="false"
        mode="out-in"
      >
        <router-view
          :key="$route.path"
          :scroll="$refs.scroll && $refs.scroll.scroll"
        />
      </transition>
    </Scroll>
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
  mounted() {
    this.$nextTick(() => {
      this.mounted = true

      if (isFirefox()) {
        document.body.classList.add('is-firefox')
      }
    })
  },
  methods: {
    toggleMenu() {
      this.isMenuActive = !this.isMenuActive
    },
    async enter(el, done) {
      await transitions['fade'].enter(el)
      done()
    },
    async leave(el, done) {
      if (this.isMenuActive) this.toggleMenu()

      await transitions['fade'].leave(el)

      this.$refs.scroll.scroll.val = 0
      this.$refs.scroll.scroll.translate = 0
      window.scrollTo(0, 0)

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

.is-safari,
.is-mob
  .scroll-container
    overflow: unset !important
    height: auto !important
</style>
