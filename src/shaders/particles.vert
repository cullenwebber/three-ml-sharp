uniform vec2 uResolution;
uniform float uSize;
uniform sampler2D uParticlesTexture;

attribute vec2 aParticlesUv;
attribute vec3 aColor;
attribute float aSize;

varying vec3 vColor;
varying float vFogDepth;

void main() {
  vec4 particle = texture(uParticlesTexture, aParticlesUv);

  // Final position
  vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // Point size
  float sizeIn = smoothstep(0.0, 0.6, particle.a);
  float sizeOut = 1.0 - smoothstep(0.6, 1.0, particle.a);
  float size = min(sizeIn, sizeOut);

  gl_PointSize = size * aSize * uSize * uResolution.y;
  gl_PointSize *= (1.0 / - viewPosition.z);

  // Varyings
  vColor = aColor;
  vFogDepth = -viewPosition.z;
}
