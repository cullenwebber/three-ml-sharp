import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import vertexShader from "../shaders/colorPass.vert";
import fragmentShader from "../shaders/colorPass.frag";

const ColorAdjustShader = {
	uniforms: {
		tDiffuse: { value: null },
		uBrightness: { value: 0.0 },
		uContrast: { value: 1.0 },
		uSaturation: { value: 1.0 },
	},
	vertexShader,
	fragmentShader,
};

export default class ColorAdjustPass extends ShaderPass {
	constructor({ brightness = 0.0, contrast = 1.0, saturation = 1.0 } = {}) {
		super(ColorAdjustShader);
		this.uniforms.uBrightness.value = brightness;
		this.uniforms.uContrast.value = contrast;
		this.uniforms.uSaturation.value = saturation;
	}
}
