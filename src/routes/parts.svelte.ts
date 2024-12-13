import {
	Vector3,
	BoxGeometry,
	CylinderGeometry,
	SphereGeometry,
} from "three";
import * as THREE from 'three';

export interface rootGroup {
	group: THREE.Group;
	parent: THREE.Mesh;
	children: Array<THREE.Mesh>;
	active: boolean;
}
export const rootGroups = $state<rootGroup[]>([])

export function createRootObject(objectType: string) {
	const geometryInstance = getMeshGeometry(objectType);
	const material = new THREE.MeshStandardMaterial({ color: 0xf8dfa1 });
	const meshInstance: THREE.Mesh = new THREE.Mesh(geometryInstance, material);
	meshInstance.userData = {
		type: objectType
	}

	const rootInstance: THREE.Group = new THREE.Group();

	rootInstance.add(meshInstance);
	const newGroup = {
		group: rootInstance,
		parent: meshInstance,
		children: [meshInstance],
		active: true
	}
	rootGroups.push(newGroup);
}

export function createChildObject(rootGroupIndex: number, geometryInstance: THREE.BufferGeometry, materialInstance: THREE.Material) {
	const childInstance: THREE.Mesh = new THREE.Mesh(geometryInstance, materialInstance);
	rootGroups[rootGroupIndex].children.push(childInstance);
}

export function handleOnClick(parentIndex: number, rootGroupIndex: number, intersection: THREE.Intersection) {

	const parent = rootGroups[rootGroupIndex].children[parentIndex];

	if (intersection.object instanceof THREE.Object3D) {
		switch (intersection.object.userData.type) {
			// clicked on cylinder
			case 'cylinder': {
				const faceNormal = intersection.normal?.y;

				// check if the intersected face normal rounded is either 1 (top) or 0 (bottom)
				if (faceNormal && (faceNormal == 1 || faceNormal == -1)) {

					// if normal = 1 then translate geometry y by parent y scale + 1, else translate by -1
					const yOffset = (faceNormal) == 1 ? parent.scale.y + 2 : -1;

					const jointGeometry = getMeshGeometry('sphere')
					const jointMaterial = new THREE.MeshStandardMaterial();
					const jointMesh = new THREE.Mesh(jointGeometry, jointMaterial);
					jointMesh.userData = {
						type: 'dowel-end-joint'
					}

					// move the mesh to the parent position
					parent.getWorldPosition(jointMesh.position);
					parent.getWorldQuaternion(jointMesh.quaternion);
					jointMesh.translateY(yOffset);
					rootGroups[rootGroupIndex].children.push(jointMesh);

					break;
				} else {
					break;
				}
			}
			case 'dowel-end-joint': {
				const faceNormal = intersection.face?.normal
				if (faceNormal) {
					const upVector = new THREE.Vector3(0, 1, 0);
					const quaternion = new THREE.Quaternion().setFromUnitVectors(upVector, faceNormal);
					const cylinderGeometry = getMeshGeometry('cylinder');
					const cylinderMaterial = new THREE.MeshStandardMaterial();
					const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
					cylinderMesh.userData = {
						type: 'cylinder'
					}
					parent.getWorldPosition(cylinderMesh.position);
					cylinderMesh.quaternion.copy(quaternion);
					cylinderMesh.translateY(1);
					rootGroups[rootGroupIndex].children.push(cylinderMesh);

				}
			}
		}
	}

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
			return (new CylinderGeometry(1, 1, 2).translate(0, 1, 0));
		case "sphere":
			return new SphereGeometry(0.5, 8, 5).rotateY(360);
		default:
			return new BoxGeometry(1, 1, 1);
	}
}


