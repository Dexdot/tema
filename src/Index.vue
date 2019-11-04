<template>
  <div>
    <Slider
      :scroll="scroll"
      :detect="detect"
      :isMenuActive="isMenuActive"
      @init="onSliderInit"
    />
  </div>
</template>

<script>
import Slider from '@/Slider'
export default {
  name: 'Index',
  props: ['scroll', 'detect', 'isMenuActive'],
  components: {
    Slider
  },
  data: () => ({
    slider: null
  }),
  methods: {
    onSliderInit(slider) {
      this.slider = slider
      this.$el.dispatchEvent(new Event('init-complete'))
    }
  }
}
</script>
