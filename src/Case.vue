<template>
  <article class="case">
    <h1 class="case__title">{{ content.title }}</h1>
    <div class="case__container">
      <div class="case__content">
        <div class="case__caption">
          <h2>About {{ content.title }}</h2>
          <p>{{ content.subtitle }}</p>
          <p class="case__date">{{ content.date }}</p>
          <a class="case__url" :href="content.url">Visit site</a>
        </div>
        <div
          :class="[
            'case__img',
            { 'case__img--full': img.fields.title.endsWith('--full') }
          ]"
          v-for="img in content.images"
          :key="img.sys.id"
          ref="images"
        >
          <img :src="img.fields.file.url" :alt="img.fields.title" />
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import anime from 'animejs'
import { getCase } from '@/scripts/api'

// window.anime = anime

// // Fullscreen image
// const fsImage = {
//   animate: el => {
//     anime({
//       targets: el.querySelector('img'),
//       scaleX: 1,
//       scaleY: 1,
//       duration: 2500,
//       easing: 'easeOutQuad'
//     })
//   },
//   reset: el => {
//     anime.set(el.querySelector('img'), {
//       scaleX: 1.5,
//       scaleY: 1.5
//     })
//   }
// }

// // Image
// const image = {
//   animate: el => {
//     anime({
//       targets: el.querySelector('img'),
//       scaleX: 1,
//       scaleY: 1,
//       duration: 800,
//       easing: 'easeOutQuad'
//     })

//     anime({
//       targets: el,
//       scaleX: 1,
//       scaleY: 1,
//       duration: 800,
//       easing: 'easeOutQuad'
//     })
//   },
//   reset: el => {
//     anime.set(el.querySelector('img'), {
//       scaleX: 1.5,
//       scaleY: 1.5
//     })

//     anime.set(el, {
//       scaleX: 0.7,
//       scaleY: 0.7
//     })
//   }
// }

export default {
  name: 'Case',
  data: () => ({
    content: {}
  }),
  async created() {
    this.content = await getCase(this, this.$route.params.id)
    this.$nextTick(() => {
      this.observe()
    })
  },
  methods: {
    observe() {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(({ target, isIntersecting }) => {
            // const isFullscreen = target.classList.contains('case__img--full')
            // const animObj = isFullscreen ? fsImage : image

            if (isIntersecting) {
              target.classList.add('visible')
              // animObj.animate(target)
            } else {
              target.classList.remove('visible')
              // console.log('not ineter', target)

              // animObj.reset(target)
            }
          })
        },
        { threshold: [0, 0.5, 1] }
      )

      this.$refs.images.forEach(img => {
        observer.observe(img)
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.case
  position: relative
  padding: calc(100vh + 80px) 0

.case__title
  +wood(m)
  font-size: 96px
  +yo('font-size', (320px: 28px, 375px: 34px, 768px: 48px, 1440px: 72px, 1920px: 96px))
  text-align: center
  letter-spacing: 0.02em

  position: absolute
  top: 50vh
  left: 50%
  transform: translate(-50%, -50%)

.case__caption
  position: relative

  margin-bottom: 11.5vh
  padding-top: 11.5vh
  padding-left: 50%

  @media (max-width: 1000px)
    padding-left: 0

  &,
  & a
    color: $black

.case__url
  font-size: 14px

  position: absolute
  bottom: 0
  left: 0

  @media (max-width: 1000px)
    left: unset
    right: 0

  &::before
    content: ''
    position: absolute
    bottom: -4px
    left: 0

    width: 100%
    height: 1px

    background: rgba($black, 0.5)

.case__container
  background: #fff
  margin-left: auto
  margin-right: auto
  width: 75.8vw

  @media (max-width: 800px)
    width: 80vw

.case__content
  margin-left: auto
  margin-right: auto
  max-width: 66%
  padding-bottom: 8.2vh

  @media (max-width: 800px)
    max-width: 80%

.case__content
  h2
    +wood(r)
    font-size: 16px
    letter-spacing: 0.02em

    opacity: 0.6

    margin-bottom: 11%

  p
    font-size: 16px
    line-height: 1.7

    &:first-of-type
      margin-bottom: 13%

    &.case__date
      opacity: 0.6
      font-size: 14px

.case__img
  overflow: hidden
  position: relative
  width: 100%

  &:not(:last-child):not(.case__img--full)
    margin-bottom: 8.2vh

  &, & img
    will-change: transform

  img
    display: block
    max-width: 100%
    width: 100%
    height: auto

.case__img--full
  margin-top: 17vh
  margin-bottom: 17vh
  margin-left: -12.9vw
  // max-width: unset
  width: 75.8vw
  @media (max-width: 800px)
    width: 80vw
    margin-left: -8vw

.case__img:not(.case__img--full)
  transform: scaleX(0.7) scaleY(0.7) scaleZ(1)
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)

  img
    transform: scaleX(1.5) scaleY(1.5) scaleZ(1)
    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)

  &.visible,
  &.visible img
    transform: scaleX(1) scaleY(1) scaleZ(1)

.case__img.case__img--full
  img
    transform: scaleX(1.5) scaleY(1.5) scaleZ(1)
    transition: transform 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)

  &.visible img
    transform: scaleX(1) scaleY(1) scaleZ(1)
</style>
