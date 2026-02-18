import * as THREE from "three";

export class CameraRig {
	/**
	 * @param {THREE.Camera} camera - The camera to rig
	 * @param {Object} options
	 * @param {THREE.Vector3} options.target - Point the camera looks at
	 * @param {Array} options.xLimit - [min, max] for camera x position
	 * @param {Array} options.yLimit - [min, max] for camera y position (optional)
	 * @param {number} options.damping - Higher = slower movement
	 */
	constructor(camera, options = {}) {
		this.camera = camera;
		this.target = options.target || new THREE.Vector3(0, 0, 0);
		this.xLimit = options.xLimit || [-10, 10];
		this.yLimit = options.yLimit || null;
		this.damping = options.damping || 2;
		this.elapsed = 0;

		// normalized pointer (-1..1)
		this.pointer = { x: 0, y: 0 };

		this._bindEvents();
	}

	_bindEvents() {
		window.addEventListener("mousemove", (event) => {
			this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
			this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
		});
	}

	/**
	 * Call every frame
	 * @param {number} delta - Time delta in seconds
	 */
	update(delta) {
		const targetX = this.target.x + this.pointer.x * 2;
		const limitedX = Math.max(
			this.xLimit[0],
			Math.min(this.xLimit[1], targetX),
		);
		this.camera.position.x = THREE.MathUtils.damp(
			this.camera.position.x,
			limitedX,
			this.damping,
			delta,
		);

		if (this.yLimit) {
			const targetY = this.target.y + this.pointer.y * 10;
			const limitedY = Math.max(
				this.yLimit[0],
				Math.min(this.yLimit[1], targetY),
			);
			this.camera.position.y = THREE.MathUtils.damp(
				this.camera.position.y,
				limitedY,
				this.damping,
				delta,
			);
		}

		this.elapsed += delta;
		this.camera.position.z = 3 + Math.sin(this.elapsed * 0.5);

		// Always look at target
		this.camera.lookAt(this.target);
		this.camera.rotation.z = Math.sin(this.elapsed * 0.5) * 0.1;
	}
}
