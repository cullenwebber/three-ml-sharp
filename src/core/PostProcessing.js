import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import ColorAdjustPass from "../utils/ColorAdjustPass";
import * as THREE from "three";

export default class PostProcessing {
	constructor(renderer, scene, camera) {
		this.composer = new EffectComposer(renderer);

		const renderPass = new RenderPass(scene, camera);
		this.composer.addPass(renderPass);

		const { width, height } = renderer.getSize(new THREE.Vector2());

		this.bloomPass = new UnrealBloomPass(
			new THREE.Vector2(width, height),
			0.4, // strength
			0.1, // radius
			0.5, // threshold
		);
		this.composer.addPass(this.bloomPass);

		this.colorPass = new ColorAdjustPass({
			brightness: 0.0,
			contrast: 0.65,
			saturation: 1.2,
		});
		this.composer.addPass(this.colorPass);

		const outputPass = new OutputPass();
		this.composer.addPass(outputPass);
	}

	render() {
		this.composer.render();
	}

	onResize(width, height) {
		this.composer.setSize(width, height);
	}
}
