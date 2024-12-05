import {
	Vector3,
	Quaternion,
	BoxGeometry,
	CylinderGeometry,
	CapsuleGeometry,
} from "three";

import * as THREE from 'three';

import { generateUUID } from "three/src/math/MathUtils.js";

// Define Part class with reactive state
export class Part {
	id = generateUUID();
	meshType: string;
	#position = $state<Vector3>(new Vector3());
	rotation: Quaternion;
	scale: Vector3;
	#active = $state<boolean>(false);
	#joints = $state<Part[]>([]);
	normal: Vector3;
	#subParts = $state<Part[]>([]);
	mesh: THREE.Mesh = $state(new THREE.Mesh());


	constructor(
		meshType = "box",
		position = new Vector3(),
		rotation = new Quaternion(),
		scale = new Vector3(0, 0, 0),
		normal = new Vector3(0, 1, 0),
		active = false
	) {
		this.meshType = meshType;
		this.#position = position;
		this.rotation = rotation;
		this.scale = scale;
		this.#active = active;
		this.#joints = [];
		this.normal = normal;
		this.#subParts = [];
		this.mesh = new THREE.Mesh(getMeshGeometry(meshType), new THREE.MeshStandardMaterial())
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

	set joints(value: Part[]) {
		this.#joints = value;
	}

	get subParts() {
		return this.#subParts;
	}

	set subParts(value: Part[]) {
		this.#subParts = value;
	}

	applyRotation(targetNormal: Vector3) {
		if (!targetNormal) return;
		const upVector = new THREE.Vector3(0, 1, 0);
		const quaternion = new THREE.Quaternion().setFromUnitVectors(upVector, targetNormal);
		this.mesh.quaternion.copy(quaternion);
		this.mesh.geometry.translate(0, 1.5, 0);
	}

}

// Store for managing parts
export const parts: Array<Part> = $state([]);

// Function to generate a mesh based on type
export function getMeshGeometry(type: string) {
	switch (type) {
		case "box":
			return new BoxGeometry(1, 1, 1);
		case "cylinder":
			return (new CylinderGeometry(0.5, 0.5, 3)
			);
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
		new Quaternion(),
		new Vector3(1, 1, 1),
		new Vector3(0, 0, 1),
		true
	);
	parts.push(newPart);
	console.log(parts[0].mesh);
}

export function deselectAll(parts: Part[]) {
	for (const part of parts) {
		if (part.subParts.length > 0) {
			deselectAll(part.subParts);
		}
		part.active = false;
	}
}

