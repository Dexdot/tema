<template>
  <div :class="['cursor', { 'cursor--hidden': hidden }]">
    <div class="cursor__inner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r="35"
          fill="none"
          stroke-miterlimit="10"
          stroke-width="2"
        ></circle>
        <circle
          cx="36"
          cy="36"
          r="35"
          fill="none"
          stroke-miterlimit="10"
          stroke-width="2"
          ref="circle"
        ></circle>
      </svg>
    </div>
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
    size: 36,
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
  position: fixed
  z-index: 2
  top: 0
  left: 0

  pointer-events: none
  transition: opacity 0.25s ease

.cursor--hidden
  opacity: 0

.cursor__inner,
.cursor
  display: flex
  align-items: center
  justify-content: center


.cursor__inner,
.cursor__inner svg
  width: 72px
  height: 72px

  circle
    stroke: #fff

    &:first-child
      stroke-dasharray: 219.556
      opacity: 0.3

    &:last-child
      stroke-dasharray: 0 219.556
</style>
