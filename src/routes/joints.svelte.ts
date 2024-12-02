import { Vector3 } from "three";
import { generateUUID } from "three/src/math/MathUtils.js";
import type { Part } from "./parts.svelte";

export class Joint {
	id = generateUUID;
	#childParts: Part[] = [];
	jointType: string;
	#position: Vector3;

	constructor(jointType = "dowel-end", position = new Vector3()) {
		this.jointType = jointType;
		this.#position = position;
	}

	get position() {
		return this.#position;
	}

	set position(value: Vector3) {
		this.#position = value;
	}

	get childParts() {
		return this.#childParts;
	}

	set childParts(value: Part[]) {
		this.#childParts = value;
	}
}
