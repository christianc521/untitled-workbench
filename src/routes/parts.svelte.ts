import {
	BoxGeometry,
	CylinderGeometry,
	SphereGeometry,
} from "three";
import * as THREE from 'three';
import { globalStates } from "./global.svelte";

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
		type: objectType,
		childrenIndex: 0
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
	return { group: rootInstance, mesh: meshInstance };
}

export function createChildObject(rootGroupIndex: number, geometryInstance: THREE.BufferGeometry, materialInstance: THREE.Material) {
	const childInstance: THREE.Mesh = new THREE.Mesh(geometryInstance, materialInstance);
	rootGroups[rootGroupIndex].children.push(childInstance);
}

export function handleOnClick(parentIndex: number, rootGroupIndex: number, intersection: THREE.Intersection) {

	let parentObj = new THREE.Mesh();
	if (parentIndex == 0) {
		parentObj = rootGroups[rootGroupIndex].parent;
	} else {
		parentObj = rootGroups[rootGroupIndex].children[parentIndex];
	}

	if (intersection.object instanceof THREE.Object3D) {
		switch (intersection.object.userData.type) {
			// clicked on cylinder, spawn sphere
			case 'cylinder': {
				const faceNormal = intersection.normal?.y;

				// check if the intersected face normal rounded is either 1 (top) or 0 (bottom)
				if (faceNormal && (faceNormal == 1 || faceNormal == -1)) {

					// if normal = 1 then translate geometry y by parent y scale + 1, else translate by -1
					const yOffset = (faceNormal) == 1 ? parentObj.scale.y + 2 : -1;

					const jointGeometry = getMeshGeometry('sphere')
					const jointMaterial = new THREE.MeshMatcapMaterial({ flatShading: true });
					const jointMesh = new THREE.Mesh(jointGeometry, jointMaterial);
					jointMesh.userData = {
						type: 'dowel-end-joint'
					}

					parentObj.add(new THREE.Group().add(jointMesh))
					jointMesh.position.copy(parentObj.position);
					// move the mesh to the parent position
					//parentObj.getWorldPosition(jointMesh.position);
					console.log('joint position: ', jointMesh.position.toArray());
					parentObj.getWorldQuaternion(jointMesh.quaternion);
					jointMesh.translateY(yOffset);

					// reset sphere to up normal
					const worldUpQuaternion = new THREE.Quaternion();
					worldUpQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
					jointMesh.quaternion.copy(worldUpQuaternion);

					rootGroups[rootGroupIndex].children[parentIndex] = parentObj;
					rootGroups[rootGroupIndex].children.push(jointMesh);
					break;
				} else {
					break;
				}
			}
			case 'dowel-end-joint': {
				let faceNormal = intersection.face?.normal
				if (!faceNormal) return
				console.log("clicked normal: ", faceNormal);
				if (faceNormal.y > 0.9 || faceNormal.y < -0.9) {
					faceNormal = new THREE.Vector3(0, Math.round(faceNormal.y), 0);
				}
				if (faceNormal) {
					const upVector = new THREE.Vector3(0, 1, 0);
					const quaternion = new THREE.Quaternion().setFromUnitVectors(upVector, faceNormal);
					const cylinderGeometry = getMeshGeometry('cylinder');
					const cylinderMaterial = new THREE.MeshStandardMaterial();
					const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
					cylinderMesh.userData = {
						type: 'cylinder'
					}

					parentObj.add(new THREE.Group().add(cylinderMesh));
					cylinderMesh.position.copy(parentObj.position);
					cylinderMesh.quaternion.copy(quaternion);
					cylinderMesh.translateY(1);

					rootGroups[rootGroupIndex].children.push(cylinderMesh);
					break;
				}
				break;
			}
			default: break;
		}
	}

}

export function editScale(newScale: number, axis: string) {
	if (!globalStates.modifyingObjectIndex) return
	switch (axis) {
		case 'x':
			rootGroups[0].children[0].scale.setX(newScale);
			break;
		case 'y':
			rootGroups[0].children[0].scale.setY(newScale);
			console.log(rootGroups[0].children[0].scale);
			break;
	}

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


