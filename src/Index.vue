<template>
  <div>
    <Slider :scroll="scroll" @init="onSliderInit" />
  </div>
</template>

<script>
import Slider from '@/Slider'
export default {
  name: 'Index',
  props: ['scroll'],
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
