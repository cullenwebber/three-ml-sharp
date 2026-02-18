import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export default class ImportGltf {
  constructor(url, options = {}) {
    this.url = url;

    this.scene = null;
    this.gltf = null;
    this.model = null;
    this.onLoad = options.onLoad ?? null;
    this.onProgress = options.onProgress ?? null;
    this.onError = options.onError ?? null;

    this.#init();
  }

  #init() {
    this.#setupLoader();
    this.#load();
  }

  #setupLoader() {
    this.loader = new GLTFLoader();

    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/v1/decoders/"
    );
    this.loader.setDRACOLoader(this.dracoLoader);
  }

  #load() {
    this.loader.load(
      this.url,
      (gltf) => {
        this.gltf = gltf;
        this.model = gltf.scene;

        // sensible defaults
        this.model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.onLoad?.(this.model, gltf);
      },
      (event) => {
        if (!event.total) return;
        const progress = event.loaded / event.total;
        this.onProgress?.(progress);
      },
      (error) => {
        console.error("GLTF load error:", error);
        this.onError?.(error);
      }
    );
  }

  addTo(scene) {
    if (!this.model) return;
    scene.add(this.model);
  }

  setPosition(x = 0, y = 0, z = 0) {
    this.model?.position.set(x, y, z);
  }

  setScale(x = 1, y = 1, z = 1) {
    this.model?.scale.set(x, y, z);
  }

  dispose() {
    if (!this.model) return;

    this.model.traverse((child) => {
      if (!child.isMesh) return;

      child.geometry?.dispose();

      if (Array.isArray(child.material)) {
        child.material.forEach((mat) => mat.dispose());
      } else {
        child.material?.dispose();
      }
    });

    this.dracoLoader?.dispose();
  }
}
