import * as THREE from 'three'

import CopyShader from '@/gl/CopyShader'
import FresnelShader from '@/gl/FresnelShader'
import FilmShader from '@/gl/FilmShader'
import EffectComposer from '@/gl/EffectComposer'
import RenderPass from '@/gl/RenderPass'
import ShaderPass from '@/gl/ShaderPass'
import FilmPass from '@/gl/FilmPass'

export default FilmPass(
  ShaderPass(
    RenderPass(EffectComposer(FilmShader(FresnelShader(CopyShader(THREE)))))
  )
)
