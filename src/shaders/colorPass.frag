uniform sampler2D tDiffuse;
uniform float uBrightness;
uniform float uContrast;
uniform float uSaturation;
varying vec2 vUv;
void main() {
	vec4 texel = texture2D(tDiffuse, vUv);
	vec3 color = texel.rgb;
	color *= 1.0 + uBrightness;
	color = pow(color, vec3(1.0 / uContrast));
	float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
	color = mix(vec3(luma), color, uSaturation);
	gl_FragColor = vec4(color, texel.a);
}