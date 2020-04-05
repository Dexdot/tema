// import * as THREE from 'three'

const THREE = window.THREE

import FresnelShader from '@/gl/FresnelShader'
import OceanShader from '@/gl/OceanShader'
import FadeShader from '@/gl/FadeShader'
import DispersionMaterial from '@/gl/DispersionMaterial'
import PointerLockControls from '@/gl/PointerLockControls'

export default PointerLockControls(
  DispersionMaterial(FadeShader(OceanShader(FresnelShader(THREE))))
)
