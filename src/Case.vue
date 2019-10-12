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
        <img
          :class="{ full: img.fields.title.endsWith('--full') }"
          v-for="img in content.images"
          :key="img.sys.id"
          :src="img.fields.file.url"
          :alt="img.fields.title"
        />
      </div>
    </div>
  </article>
</template>

<script>
import { getCase } from '@/scripts/api'

export default {
  name: 'Case',
  data: () => ({
    content: {}
  }),
  async created() {
    this.content = await getCase(this, this.$route.params.id)
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

  img
    display: block
    max-width: 100%
    width: 100%
    height: auto
    &:not(:last-child)
      margin-bottom: 8.2vh

  img.full
    margin-top: 17vh
    margin-bottom: 17vh
    margin-left: -12.9vw
    max-width: unset
    width: 75.8vw

    @media (max-width: 800px)
      width: 80vw
      margin-left: -8vw
</style>
