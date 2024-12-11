import {
	Vector3,
	BoxGeometry,
	CylinderGeometry,
	SphereGeometry,
} from "three";
import * as THREE from 'three';

export let rootGroups: THREE.Group[] = $state([])
$effect(() => {
	rootGroups = rootGroups;
})

export function createRootObject(geometryInstance: THREE.BufferGeometry, materialInstance: THREE.Material) {
	const meshInstance: THREE.Mesh = $state(new THREE.Mesh(geometryInstance, materialInstance));

	const rootInstance: THREE.Group = $state(new THREE.Group());
	rootInstance.userData = {
		active: 'true'
	}
	rootInstance.add(meshInstance);
	rootGroups.push(rootInstance);
}

export function createChildObject(parentObject: THREE.Group, geometryInstance: THREE.BufferGeometry, materialInstance: THREE.Material) {
	const childInstance: THREE.Mesh = new THREE.Mesh(geometryInstance, materialInstance);
	parentObject.attach(childInstance);
}

export function editScale(meshInstance: THREE.Mesh, newScale: number, axis: string) {
	switch (axis) {
		case 'x':
			meshInstance.scale.setX(newScale);
			break;
		case 'y':
			meshInstance.scale.setY(newScale);
			break;
		case 'z':
			meshInstance.scale.setZ(newScale);
			break;
	}

}

export function applyRotation(meshInstance: THREE.Mesh, targetNormal: Vector3) {
	if (!targetNormal) return;
	const upVector = new THREE.Vector3(0, 1, 0);
	const quaternion = new THREE.Quaternion().setFromUnitVectors(upVector, targetNormal);
	meshInstance.quaternion.copy(quaternion);
	meshInstance.geometry.translate(0, 0.5, 0);
}

// Function to generate a mesh based on type
export function getMeshGeometry(type: string) {
	switch (type) {
		case "box":
			return new BoxGeometry(1, 1, 1);
		case "cylinder":
			return (new CylinderGeometry(0.5, 0.5, 3).translate(0, 1.5, 0));
		case "sphere":
			return new SphereGeometry(0.5, 8, 5).rotateY(360);
		default:
			return new BoxGeometry(1, 1, 1);
	}
}


export function deselectAll() {
	for (const rootInstance of rootGroups) {
		rootInstance.userData.active = false;
	}
}

