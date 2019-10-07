<template>
  <button class="circles" @mouseenter="mouseenter" @mouseleave="mouseout">
    <div class="circles__i" ref="circle1"></div>
    <div class="circles__i" ref="circle2"></div>
    <div class="circles__i" ref="circle3"></div>
    <p class="circles__text">Discover</p>
  </button>
</template>

<script>
import anime from 'animejs'

export default {
  name: 'MenuButton',
  data: () => ({
    isAnimating: false
  }),
  methods: {
    mouseenter() {
      const c1 = this.$refs.circle1
      const c2 = this.$refs.circle2
      const c3 = this.$refs.circle3

      if (this.isAnimating) {
        anime.remove([c1, c2, c3])
      }

      const tl = anime.timeline({
        begin: () => {
          this.isAnimating = true
        },
        complete: () => {
          this.isAnimating = false
        }
      })

      anime.set(c2, {
        translateX: '4px',
        translateY: '-10px',
        scale: 0
      })

      tl.add({
        targets: c1,
        duration: 350,
        translateX: '4px',
        scaleY: 0.3,
        easing: 'easeInQuint'
      })
        .add(
          {
            targets: c3,
            duration: 350,
            translateX: '-6px',
            easing: 'easeInQuint'
          },
          '-=350'
        )
        .add({
          targets: c2,
          duration: 400,
          scale: 1,
          easing: 'easeOutQuint'
        })
    },
    mouseout() {
      const c1 = this.$refs.circle1
      const c2 = this.$refs.circle2
      const c3 = this.$refs.circle3

      if (this.isAnimating) {
        anime.remove([c1, c2, c3])
      }

      const tl = anime.timeline({
        begin: () => {
          this.isAnimating = true
        },
        complete: () => {
          this.isAnimating = false
        }
      })

      tl.add({
        targets: c2,
        duration: 300,
        translateX: '4px',
        translateY: '-10px',
        scale: 0,
        easing: 'easeInQuint'
      }).add({
        targets: [c1, c3],
        duration: 250,
        translateX: '0px',
        scaleY: 1,
        easing: 'easeOutQuint'
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.is-firefox
  .circles
    padding-top: calc(var(--unit-v))

.circles
  width: calc(var(--unit-h) + 88px)
  height: 80px
  display: flex

  position: fixed
  top: 0
  right: 0

  justify-content: flex-end
  padding-top: calc(var(--unit-v) - 26px)
  padding-right: var(--unit-h)

  &__i
    width: 4px
    height: 4px

    border-radius: 50%
    background: #fff
    transform-origin: 50% 50%

    &:nth-child(1)
      position: absolute
      right: calc(var(--unit-h) + 10px)

    &:nth-child(2)
      position: absolute
      right: var(--unit-h)

      width: 24px
      height: 24px
      border: 1px solid #fff
      background: 0
      transform: translate(4px, -10px) scale(0)

  &:hover .circles__text
    opacity: 1
    transform: translateX(0)
    transition: 0.8s ease 0.2s

.circles__text
  position: absolute
  left: 0
  top: calc(var(--unit-v) - 4px)

  line-height: 1
  font-size: 12px
  letter-spacing: 0.07em

  opacity: 0
  transform: translateX(-16px)
  transition: 0.6s ease

  @media (max-width: 500px)
    top: calc(var(--unit-v) + 4px)
</style>
