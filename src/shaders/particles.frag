uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying vec3 vColor;
varying float vFogDepth;

void main() {
  // Map gl_PointCoord to [-1, 1]
  vec2 coord = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(coord, coord);

  if(r2 > 1.0)
      discard;

  // Reconstruct sphere normal
  vec3 normal = vec3(coord, sqrt(1.0 - r2));

  // Light direction (view space, upper-right)
  vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));

  // Diffuse
  float diffuse = max(dot(normal, lightDir), 0.0);

  // Specular (Blinn-Phong)
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfDir = normalize(lightDir + viewDir);
  float specular = pow(max(dot(normal, halfDir), 0.0), 32.0);

  // Ambient + diffuse + specular
  vec3 color = vColor * (0.5 + 0.5 * diffuse) + vec3(0.05) * specular;

  // Fog
  float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
  color = mix(color, fogColor, fogFactor);

  gl_FragColor = vec4(color, 1.0);
}
