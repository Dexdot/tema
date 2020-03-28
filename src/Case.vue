<template>
  <article class="case">
    <div class="case__fixed">
      <h1 class="case__title">
        <span>{{ content.title }}</span>
      </h1>
    </div>

    <div
      class="case__container"
      :style="{ 'background-color': content.background || '#ffffff' }"
    >
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
            { 'case__img--full': item.fields.title.endsWith('--full') }
          ]"
          v-for="item in content.images"
          :key="item.sys.id"
        >
          <BaseImage
            class="case__i"
            v-if="isImage(item)"
            @complete="onImgLoad"
            :img="item"
            :alt="item.fields.title"
          />

          <video
            ref="videos"
            class="case__i"
            v-if="isVideo(item)"
            :src="item.fields.file.url"
            draggable="false"
            autoplay
            playsinline
            loop
            muted
          />
        </div>
      </div>
    </div>

    <Next @complete="$router.push('/')" />
  </article>
</template>

<script>
import anime from 'animejs'

import Next from '@/Next'
import BaseImage from '@/BaseImage'
import { getCase } from '@/scripts/api'
import { isImage, isVideo } from '@/scripts/helpers'

export default {
  name: 'Case',
  components: {
    BaseImage,
    Next
  },
  data: () => ({
    content: {},
    observer: {},
    scrollY: 0,
    scrollDir: '',
    isTitleAnimating: false,
    isTitleVisible: true
  }),
  async created() {
    this.content = await getCase(this, this.$route.params.id)
    this.createObserver()
    this.$nextTick(() => {
      this.handleScroll()

      if (this.$refs.videos && this.$refs.videos.length > 0)
        this.$refs.videos.forEach(v => {
          this.observer.observe(v.parentElement)
        })
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    handleScroll() {
      window.addEventListener('scroll', this.onScroll.bind(this))
    },
    onScroll() {
      const { pageYOffset, innerHeight } = window
      this.scrollDir = pageYOffset > this.scrollY ? 'down' : 'up'
      this.scrollY = pageYOffset

      if (
        this.scrollDir === 'down' &&
        this.isTitleVisible &&
        pageYOffset > innerHeight * 0.1
      ) {
        this.toggleTitle(true)
      }

      if (
        this.scrollDir === 'up' &&
        !this.isTitleVisible &&
        pageYOffset <= innerHeight * 0.3
      ) {
        this.toggleTitle(false)
      }
    },
    toggleTitle(hide = true) {
      if (this.isTitleAnimating) return false
      this.isTitleAnimating = true

      const chars = this.$el.querySelectorAll('.case-title-char')

      anime({
        targets: chars,
        translateY: hide ? ['0%', '-110%'] : ['110%', '0%'],
        easing: hide ? 'easeInCubic' : 'easeOutCubic',
        duration: 400,
        delay: anime.stagger(20),
        complete: () => {
          this.isTitleAnimating = false
          this.isTitleVisible = !hide
        }
      })
    },
    createObserver() {
      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(({ target, isIntersecting }) => {
            if (isIntersecting) {
              target.classList.add('visible')
            } else {
              target.classList.remove('visible')
            }
          })
        },
        { threshold: [0, 0.5, 1] }
      )
    },
    onImgLoad(img) {
      this.observer.observe(img.parentElement)
    },
    isImage: item => isImage(item),
    isVideo: item => isVideo(item)
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.case
  position: relative
  padding-top: 101vh

.case__fixed
  position: fixed
  top: 50vh
  left: 50%

// body.is-safari,
// body.is-mob
//   .case__fixed
//     position: fixed
//     top: 0
//     left: 0
//     transform: unset !important
//     width: 100vw
//     height: 100vh

//     .case__title
//       position: absolute
//       top: 50%
//       left: 50%

body.is-mob .case__fixed
  top: calc(var(--initial-vh) * 50)

.case__title
  +wood(m)
  +yo('font-size', (320px: 28px, 375px: 34px, 768px: 48px, 1440px: 72px, 1920px: 96px))
  text-align: center
  letter-spacing: 0.02em
  line-height: 1
  color: #fff
  white-space: nowrap

  overflow: hidden
  transform: translate(-50%, -50%)

  /deep/ span
    display: inline-block
    will-change: transform
    &.is-space
      min-width: 0.3em

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

  position: relative

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

  &, .case__i
    will-change: transform

  .case__i
    display: block
    max-width: 100%
    width: 100%
    height: auto

.case__img--full
  margin-top: 17vh
  margin-bottom: 17vh
  margin-left: -12.9vw
  width: 75.8vw
  @media (max-width: 800px)
    width: 80vw
    margin-left: -8vw


// Case I/O animations
.case__container,
.case__title
  opacity: 0

// Image animations
.case__img:not(.case__img--full)
  transform: scaleX(0.7) scaleY(0.7) scaleZ(1)
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)

  .case__i
    transform: scaleX(1.5) scaleY(1.5) scaleZ(1)
    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)

  &.visible,
  &.visible .case__i
    transform: scaleX(1) scaleY(1) scaleZ(1)

.case__img.case__img--full
  .case__i
    transform: scaleX(1.5) scaleY(1.5) scaleZ(1)
    transition: transform 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)

  &.visible .case__i
    transform: scaleX(1) scaleY(1) scaleZ(1)
</style>
