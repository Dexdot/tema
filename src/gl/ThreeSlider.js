import * as THREE from 'three'

import FresnelShader from '@/gl/FresnelShader'
import OceanShader from '@/gl/OceanShader'
import FadeShader from '@/gl/FadeShader'
import DispersionMaterial from '@/gl/DispersionMaterial'

export default DispersionMaterial(FadeShader(OceanShader(FresnelShader(THREE))))
