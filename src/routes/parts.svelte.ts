import {
	Vector3,
	Euler,
	BoxGeometry,
	CylinderGeometry,
	CapsuleGeometry,
} from "three";

import { Joint } from "./joints.svelte";

import { generateUUID } from "three/src/math/MathUtils.js";

// Define Part class with reactive state
export class Part {
	id = generateUUID();
	meshType: string;
	#position = $state<Vector3>(new Vector3());
	rotation: Euler;
	scale: Vector3;
	#active = $state<boolean>(false);
	#joints = $state<Joint[]>([]);
	normal: Vector3;
	#subParts = $state<Part[]>([]);


	constructor(
		meshType = "box",
		position = new Vector3(),
		rotation = new Euler(0, 0, 0),
		scale = new Vector3(0, 0, 0),
		normal = new Vector3()
	) {
		this.meshType = meshType;
		this.#position = position;
		this.rotation = rotation;
		this.scale = scale;
		this.#active = true;
		this.#joints = [];
		this.normal = normal;
		this.#subParts = [];
	}

	get position() {
		return this.#position;
	}

	set position(value: Vector3) {
		this.#position = value;
	}

	get active() {
		return this.#active;
	}

	set active(value: boolean) {
		this.#active = value;
	}

	get joints() {
		return this.#joints;
	}

	set joints(value: Joint[]) {
		this.#joints = value;
	}

	get subParts() {
		return this.#subParts;
	}

	set subParts(value: Part[]) {
		this.#subParts = value;
	}

	addJoint(type: string, position: Vector3) {
		this.joints.push(new Joint(type, position));
	}


}

// Store for managing parts
export const parts: Part[] = $state([]);

// Function to generate a mesh based on type
export function getMeshGeometry(type: string) {
	switch (type) {
		case "box":
			return new BoxGeometry(1, 1, 1);
		case "cylinder":
			return new CylinderGeometry(0.5, 0.5, 1);
		case "sphere":
			return new CapsuleGeometry(0.3, 0.1, 2, 8);
		default:
			return new BoxGeometry(1, 1, 1);
	}
}

// Function to add a new part
export function addPart(type: string) {
	const newPart = new Part(
		type,
		new Vector3(),
		new Euler(1, 1, 1),
		new Vector3(1, 1, 1),
		new Vector3(1, 1, 1),
	);
	parts.push(newPart);
}

