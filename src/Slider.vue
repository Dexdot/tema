<template>
  <section class="slider" @click="onClick">
    <!-- Shaders Start -->
    <script id="envmap_dispersion_pars_fragment" type="x-shader/x-fragment">

      uniform float dispersion;
      varying vec3 worldPositions;
      varying vec3 cameraToVertexs;
      varying vec3 worldNormals;
      uniform float time;
      //varying vec2 vUv;
      uniform float dispersionBlendMultiplier;

      // https://www.shadertoy.com/view/ll2GD3
      vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
          return a + b*cos( 6.28318*(c*t+d) );
      }
      vec3 spectrum(float n) {
          return pal( n, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67) );
      }
    </script>

    <script id="envmap_dispersion_fragment" type="x-shader/x-fragment">
      vec4 envColor = vec4(0);

      //vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );
      //vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );

      for (int i = 0; i < DISPERSION_SAMPLES; i++) {

        float wavelength = float(i) / float(DISPERSION_SAMPLES);

        float riMax = refractionRatio * (1. + dispersion);
        float ri = mix(refractionRatio, riMax, wavelength);
        vec3 reflectVec = refract( cameraToVertexs, worldNormals, ri );

        vec4 envColorSample = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
        vec3 queryReflectVec = vec3( flipEnvMap * reflectVec.x, reflectVec.yz );
        vec4 envMapColor = textureCube( envMap, queryReflectVec, 0.5 );

        envColorSample = envMapTexelToLinear( envColorSample );
        envColorSample.rgb *= spectrum(wavelength);
        envColorSample.rgb /= float(DISPERSION_SAMPLES) / dispersionBlendMultiplier;
        envColor.rgb += envColorSample.rgb ;
      }


      outgoingLight += envColor.xyz;

      gl_FragColor = vec4( outgoingLight, diffuseColor.a );
    </script>
    <!-- Shaders End -->

    <div class="slider" id="slider"></div>
  </section>
</template>

<script>
import three from '@/gl/three'
import Slider from '@/gl/Slider'

import { getCases } from '@/scripts/api'

const images = {}

export default {
  name: 'Slider',
  props: ['scroll'],
  data: () => ({
    slider: null
  }),
  async mounted() {
    const cases = await getCases(this)

    cases.forEach(({ fields }) => {
      images[fields.slug] = fields.map.fields.file.url
    })

    this.slider = new Slider({
      selector: '#slider',
      images,
      three
    })
    this.slider.indexControl('next')
  },
  beforeDestroy() {
    this.slider.destroy()
  },
  methods: {
    onClick() {
      this.$router.push(
        `/case/${this.slider.sceneParams[this.slider.index].slug}`
      )
    }
  },
  watch: {
    'scroll.deltaY'() {
      const dir = this.scroll.deltaY < 0 ? 'next' : 'back'
      this.slider.indexControl(dir)
    }
  }
}
</script>

<style lang="sass" scoped>
.slider
  position: fixed
  top: 0
  left: 0

  width: 100vw
  height: 100vh
</style>
