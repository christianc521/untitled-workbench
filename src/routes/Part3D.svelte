<script lang="ts">
	import { T } from '@threlte/core';
	import type { IntersectionEvent } from '@threlte/extras';
	import { interactivity, TransformControls } from '@threlte/extras';
	import * as THREE from 'three';
	import { injectLookAtPlugin } from './lookAtPlugin';
	import { createChildObject, getMeshGeometry, rootGroups } from './parts.svelte';
	import { globalStates } from './global.svelte';
	interactivity();
	injectLookAtPlugin();
	$inspect(rootGroups);
</script>

{#each rootGroups as parentObject, parentIndex}
	{#if parentObject instanceof THREE.Group}
		{#each parentObject.children as child (child.uuid)}
			{#if child instanceof THREE.Mesh}
				<T
					is={THREE.Mesh}
					geometry={child.geometry}
					material={child.material}
					position={child.position.toArray()}
					onclick={(e: IntersectionEvent<MouseEvent>) => {
						e.stopPropagation();
						if (e.intersections) {
							let parentInstance = rootGroups[parentIndex];
							createChildObject(
								parentInstance,
								getMeshGeometry('sphere'),
								new THREE.MeshStandardMaterial()
							);

							parentInstance.userData.active = true;
							rootGroups[parentIndex] = parentInstance;
							console.log('intersection: ', e.intersections);
						}
					}}
				>
					{#if parentObject.userData.active == true && globalStates.addingJoint == false}
						<TransformControls translationSnap={1} group={parentObject} />
					{/if}
				</T>
			{/if}
		{/each}
	{/if}
{/each}
