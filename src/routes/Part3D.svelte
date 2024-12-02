<script lang="ts">
	import type { Snippet } from 'svelte';
	import { T } from '@threlte/core';
	import { getMeshGeometry } from './parts.svelte';
	import type { IntersectionEvent } from '@threlte/extras';
	import { MeshStandardMaterial, CapsuleGeometry } from 'three';
	import { interactivity } from '@threlte/extras';
	import { Vector3, Euler } from 'three';
	import { Joint } from './joints.svelte';
	import { activeTool } from './global.svelte';
	import { parts } from './parts.svelte';
	import { Part } from './parts.svelte';
	import * as THREE from 'three';
	interactivity();

	let {
		PartInstance,
		children
	}: {
		PartInstance: Part;
		children?: Snippet<[{ ref: THREE.Mesh }]>;
	} = $props();

	let meshRef: THREE.Mesh | undefined = $state(undefined);
</script>

<T.Group>
	<T.Mesh
		bind:ref={meshRef}
		position={PartInstance.position.toArray()}
		geometry={getMeshGeometry(PartInstance.meshType)}
		scale={PartInstance.scale.toArray()}
		onclick={(e: IntersectionEvent<MouseEvent>) => {
			if (!activeTool.addingJoint) {
				PartInstance.active = true;
				console.log(e.face?.normal);
			}
			parts[0] = parts[0];
			if (
				activeTool.addingJoint &&
				(Math.round(e.face?.normal.y ?? 0) == -1 || Math.round(e.face?.normal.y ?? 0) == 1) &&
				PartInstance.meshType == 'cylinder'
			) {
				PartInstance.joints.push(
					new Joint(
						'sphere',
						new Vector3(
							0,
							PartInstance.position.y + (e.face?.normal.y ?? 0) * PartInstance.scale.y,
							0
						)
					)
				);
			}
		}}
		lookAt={PartInstance.normal}
	>
		<T.MeshStandardMaterial wireframe={true} />
		{#if PartInstance.joints.length > 0}
			{#each PartInstance.joints as joint}
				<T.Mesh
					position={joint.position.toArray()}
					geometry={new CapsuleGeometry(0.3, 0.1, 2, 8)}
					scale={PartInstance.scale.toArray()}
					material={new MeshStandardMaterial()}
					onclick={(e: IntersectionEvent<MouseEvent>) => {
						const faceNormal = e.face?.normal;
						PartInstance.subParts.push(
							new Part(
								'cylinder',
								joint.position,
								new Euler(1, 1, 1),
								new Vector3(1, 1, 1),
								faceNormal
							)
						);
					}}
				></T.Mesh>
			{/each}
		{/if}
		{#if children && meshRef}
			{@render children({ ref: meshRef })}
		{/if}
	</T.Mesh>
</T.Group>
