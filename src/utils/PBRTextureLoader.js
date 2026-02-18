import * as THREE from "three";

export default class PBRTextureLoader {
	constructor(basePath, options = {}) {
		this.basePath = basePath;
		this.loader = new THREE.TextureLoader();
		this.textures = {};
		this.repeat = options.repeat || { x: 1, y: 1 };
	}

	async loadTextures(textureNames = {}) {
		const {
			color = null,
			normal = null,
			roughness = null,
			metalness = null,
			displacement = null,
			ao = null,
		} = textureNames;

		const loadPromises = [];

		if (color) {
			loadPromises.push(
				this.#loadTexture(color, "color").then((texture) => {
					texture.colorSpace = THREE.SRGBColorSpace;
					this.textures.map = texture;
				}),
			);
		}

		if (normal) {
			loadPromises.push(
				this.#loadTexture(normal, "normal").then((texture) => {
					this.textures.normalMap = texture;
				}),
			);
		}

		if (roughness) {
			loadPromises.push(
				this.#loadTexture(roughness, "roughness").then((texture) => {
					this.textures.roughnessMap = texture;
				}),
			);
		}

		if (metalness) {
			loadPromises.push(
				this.#loadTexture(metalness, "metalness").then((texture) => {
					this.textures.metalnessMap = texture;
				}),
			);
		}

		if (displacement) {
			loadPromises.push(
				this.#loadTexture(displacement, "displacement").then((texture) => {
					this.textures.displacementMap = texture;
				}),
			);
		}

		if (ao) {
			loadPromises.push(
				this.#loadTexture(ao, "ao").then((texture) => {
					this.textures.aoMap = texture;
				}),
			);
		}

		await Promise.all(loadPromises);

		return this.textures;
	}

	#loadTexture(filename, type) {
		return new Promise((resolve, reject) => {
			const path = `${this.basePath}/${filename}`;

			this.loader.load(
				path,
				(texture) => {
					texture.wrapS = THREE.RepeatWrapping;
					texture.wrapT = THREE.RepeatWrapping;
					texture.repeat.set(this.repeat.x, this.repeat.y);
					texture.needsUpdate = true;
					resolve(texture);
				},
				undefined,
				(error) => {
					console.error(`Failed to load ${type} texture at ${path}:`, error);
					reject(error);
				},
			);
		});
	}

	applyToMaterial(material) {
		Object.assign(material, this.textures);
		material.needsUpdate = true;
		return material;
	}
}
