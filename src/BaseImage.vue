<template>
  <img />
</template>

<script>
import { isJPG } from '@/scripts/helpers'

const getSupports = img => {
  // FF
  const ffMatch = navigator.userAgent.match(/Firefox\/(.*)$/)
  let ffv = 0

  if (ffMatch && ffMatch.length > 1) {
    ffv = parseInt(ffMatch[1])
  }

  // WEBP
  const webp =
    (ffMatch && ffv >= 65) ||
    document
      .createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') == 0

  return {
    decode: !!img.decode,
    isMob: window.innerWidth <= 500,
    webp
  }
}

const encode = data => {
  const ret = []
  for (let d in data)
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
  return ret.join('&')
}

export default {
  name: 'BaseImage',
  props: {
    img: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    isJPG: false
  }),
  created() {
    this.isJPG = isJPG(this.img)
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      const img = this.$el
      const supports = getSupports(img)

      const url = this.img.fields.file.url

      const params = {
        fm: supports.webp ? 'webp' : 'jpg',
        fl: supports.webp ? '' : 'progressive',
        w: supports.isMob ? '1125' : '',
        fit: supports.isMob ? 'fill' : ''
      }
      const src = `${url}?${encode(params)}`

      const onload = () => {
        this.$emit('complete', img)
      }

      if (supports.decode) {
        img.src = src
        img.decode().then(onload.bind(this))
      } else {
        img.onload = onload.bind(this)
        img.src = src
      }
    }
  }
}
</script>
