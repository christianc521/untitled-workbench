import {
	BoxGeometry,
	CylinderGeometry,
	SphereGeometry,
} from "three";

import * as THREE from 'three';
import { globalStates } from "./global.svelte";
import type { IntersectionEvent } from '@threlte/extras';
import { derived } from "svelte/store";

// Define Part class with reactive state
export class Part {
	meshType: string;
	active = $state<boolean>(false);
	joints = $state<Joint[]>([]);
	subParts = $state<Part[]>([]);
	mesh: THREE.Mesh = $state(new THREE.Mesh());
	boundingBox: THREE.Box3;
	parentPosition = $state<THREE.Vector3 | undefined>(new THREE.Vector3());

	constructor(
		meshType = "box",
		active = false,
		parentPosition?: THREE.Vector3
	) {
		this.meshType = meshType;
		this.active = active;
		this.joints = [];
		this.subParts = [];
		this.mesh = new THREE.Mesh(getMeshGeometry(meshType), new THREE.MeshStandardMaterial({ color: 0xf8dfa1 }))
		this.boundingBox = new THREE.Box3().setFromObject(this.mesh, true)
		this.parentPosition = parentPosition;
	}


	handleOnClickEditing(e: IntersectionEvent<MouseEvent>) {
		if (e.intersections[0].face?.normal.y && globalStates.activeTool === 'addingJoint') {
			const faceNormal = Math.round(e.intersections[0].face?.normal.y);
			if (
				(faceNormal && globalStates.activeTool == 'addingJoint' && faceNormal == -1) ||
				(faceNormal == 1 && this.meshType == 'cylinder')
			) {
				this.joints.push(new Joint('sphere', false, 2, this.mesh));
				parts.push(this.joints.slice(-1)[0]);  // Pass mesh instead of position
			}
		}
	}

}

export class Joint {
	meshType: string;
	active = $state<boolean>(false);
	subParts = $state<Part[]>([]);
	mesh: THREE.Mesh = $state(new THREE.Mesh());
	boundingBox: THREE.Box3;
	offset: number;
	parentMesh = $state(new THREE.Mesh);

	constructor(
		meshType = "sphere",
		active = false,
		offset: number,
		parentMesh: THREE.Mesh
	) {
		this.meshType = meshType;
		this.active = active;
		this.subParts = [];
		this.mesh = new THREE.Mesh(getMeshGeometry(meshType), new THREE.MeshStandardMaterial({ color: 0xf8dfa1 }))
		this.boundingBox = new THREE.Box3().setFromObject(this.mesh, true)
		this.parentMesh = parentMesh;
		this.offset = offset;
		this.updatePosition()
	}

	updatePosition() {
		if (this.parentMesh) {
			this.mesh.position.copy(this.parentMesh.position);
			this.mesh.position.y += this.offset; // Apply the offset
		}
	}

	handleTransformChanged() {
		this.updatePosition();
	}

}

// Store for managing parts
export const parts: Array<Part | Joint> = $state([]);
export const activeParts: Array<Part> = $state([]);


// Function to generate a mesh based on type
export function getMeshGeometry(type: string) {
	switch (type) {
		case "box":
			return new BoxGeometry(1, 1, 1);
		case "cylinder":
			return (new CylinderGeometry(0.5, 0.5, 1).translate(0, 0.5, 0));
		case "sphere":
			return new SphereGeometry(0.5, 8, 5).rotateY(360);
		default:
			return new BoxGeometry(1, 1, 1);
	}
}

// Function to add a new part
export function addPart(type: string, parent?: THREE.Vector3): Part {
	const newPart = new Part(
		type,
		false,
		parent
	);
	return newPart;
}

export function deselectAll(parts: Array<Part | Joint>) {
	for (const part of parts) {
		if (part.subParts.length > 0) {
			deselectAll(part.subParts);
		}
		part.active = false;
	}
}



