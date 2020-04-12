<template>
  <div :class="['cursor', { 'cursor--hidden': hidden }]">
    <div class="cursor__inner"></div>
  </div>
</template>

<script>
export default {
  props: {
    hidden: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    RAF: 0,
    size: 24,
    styles: {
      x: 0,
      y: 0
    }
  }),
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    init() {
      document.body.addEventListener('mousemove', this.onMousemove.bind(this))
      this.RAF = requestAnimationFrame(() => this.update())
    },
    destroy() {
      document.body.removeEventListener('mousemove', this.onMousemove)
      cancelAnimationFrame(this.RAF)
    },
    update() {
      this.layout()
      this.RAF = requestAnimationFrame(() => this.update())
    },
    onMousemove({ clientX, clientY }) {
      this.styles.x = clientX - this.size
      this.styles.y = clientY - this.size
    },
    layout() {
      const { x, y } = this.styles
      this.$el.style.transform = `translate3d(${x}px,${y}px,0)`
    }
  }
}
</script>

<style lang="sass" scoped>
.cursor
  display: flex
  align-items: center
  justify-content: center
  width: 48px
  height: 48px

  position: fixed
  z-index: 2
  top: 0
  left: 0

  transform-origin: 50% 50%
  will-change: transform

  border: 1px solid #fff
  border-radius: 50%
  pointer-events: none
  transition: opacity 0.25s ease

.cursor--hidden
  opacity: 0

.cursor__inner
  width: 100%
  height: 100%

  border-radius: 50%
  background: #fff
  transform-origin: 50% 50%
  transform: scale(0)
</style>
