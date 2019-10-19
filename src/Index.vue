<template>
  <div>
    <Slider :scroll="scroll" />
  </div>
</template>

<script>
import Slider from '@/Slider'
export default {
  name: 'Index',
  props: ['scroll'],
  components: {
    Slider
  }
}
</script>