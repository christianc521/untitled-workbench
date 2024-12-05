<script lang="ts">
	import type { Snippet } from 'svelte';
	import Self from './Part3D.svelte';
	import { T } from '@threlte/core';
	import type { IntersectionEvent } from '@threlte/extras';
	import { interactivity } from '@threlte/extras';
	import { Vector3 } from 'three';
	import { activeTool } from './global.svelte';
	import { parts } from './parts.svelte';
	import { Part } from './parts.svelte';
	import * as THREE from 'three';
	import { injectLookAtPlugin } from './lookAtPlugin';
	interactivity();
	injectLookAtPlugin();

	let {
		PartInstance,
		children
	}: {
		PartInstance: Part;
		children?: Snippet<[{ ref: THREE.Mesh }]>;
	} = $props();

	let meshRef: THREE.Mesh | undefined = $state(PartInstance.mesh);
</script>

<T.Group>
	<!-- 
		renders a singular part and its attached joints as a group
		part onclick (top or bottom face) -> new joint
		joint onclick -> part.subPart.push( new cylinder )
		TODO: subPart should start at joint origin and look at e.face.normal
	-->
	<T.Mesh
		bind:ref={meshRef}
		position={PartInstance.position.toArray()}
		rotation={PartInstance.mesh.rotation.toArray()}
		geometry={PartInstance.mesh.geometry}
		object={PartInstance.mesh}
		scale={PartInstance.scale.toArray()}
		onclick={(e: IntersectionEvent<MouseEvent>) => {
			console.log(parts);
			e.stopPropagation();
			if (!activeTool.addingJoint) {
				PartInstance.active = true;
				console.log(PartInstance.position);
			}
			parts[0] = parts[0];
			if (
				activeTool.addingJoint &&
				(Math.round(e.face?.normal.y ?? 0) == -1 || Math.round(e.face?.normal.y ?? 0) == 1) &&
				PartInstance.meshType == 'cylinder'
			) {
				PartInstance.joints.push(
					new Part('sphere', new Vector3(0, 4, 0), new THREE.Quaternion(), new Vector3())
				);
			}
		}}
	>
		<T.MeshStandardMaterial wireframe={false} color={0xf8dfa1} />
		{#if PartInstance.joints.length > 0}
			{#each PartInstance.joints as joint}
				<!-- rendering the joints 
				 TODO: in the onclick, bug is setting the subPart position to the parents origin 
				maybe forego the subParts array and just push to parts?
				-->
				<T.Mesh
					position={joint.position.toArray()}
					geometry={joint.mesh.geometry}
					scale={1}
					oncreate={() => {
						// Create a quaternion that represents world up orientation
						const worldUpQuaternion = new THREE.Quaternion();
						worldUpQuaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 360);
						joint.mesh.quaternion.copy(worldUpQuaternion);
					}}
					onclick={(e: IntersectionEvent<MouseEvent>) => {
						e.stopPropagation();
						let faceNormal = e.intersections[0].face?.normal;
						if (faceNormal) {
							if (faceNormal.y > 0.9) {
								faceNormal = new Vector3(0, 1, 0);
							} else if (faceNormal.y < -0.9) {
								faceNormal = undefined;
							}
							const upVector = PartInstance.normal;
							const quaternion = new THREE.Quaternion().setFromUnitVectors(upVector, faceNormal);
							PartInstance.subParts.push(
								new Part(
									'cylinder',
									joint.position.clone(),
									quaternion,
									new Vector3(1, 1, 1),
									faceNormal
								)
							);
							PartInstance.subParts.slice(-1)[0].applyRotation(faceNormal);
						}
					}}
				>
					<T.MeshMatcapMaterial flatShading={true} wirefame={true} />
				</T.Mesh>
			{/each}
		{/if}
		{#if PartInstance.subParts.length > 0}
			{#each PartInstance.subParts as subPart}
				<Self PartInstance={subPart} />
			{/each}
		{/if}
		{#if children && meshRef}
			{@render children({ ref: meshRef })}
		{/if}
	</T.Mesh>
</T.Group>
