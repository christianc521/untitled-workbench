<script lang="ts">
	import { T } from '@threlte/core';
	import type { IntersectionEvent } from '@threlte/extras';
	import { interactivity, TransformControls } from '@threlte/extras';
	import * as THREE from 'three';
	import { injectLookAtPlugin } from './lookAtPlugin';
	import { rootGroups, handleOnClick } from './parts.svelte';
	import { globalStates } from './global.svelte';
	interactivity();
	injectLookAtPlugin();
	$inspect(rootGroups);
</script>

{#each rootGroups as parentObject, parentIndex}
	{#if parentObject.group instanceof THREE.Group}
		<T is={rootGroups[parentIndex].group}>
			{#each parentObject.children as child, childIndex}
				{#if child instanceof THREE.Mesh}
					<T
						is={child}
						geometry={child.geometry}
						material={child.material}
						position={child.position.toArray()}
						onclick={(e: IntersectionEvent<MouseEvent>) => {
							e.stopPropagation();

							if (e.intersections && globalStates.addingJoint) {
								handleOnClick(childIndex, parentIndex, e.intersections[0]);
								console.log('added: ', rootGroups[parentIndex].children.slice(-1)[0]);
							} else {
								globalStates.selectedGroup = rootGroups[parentIndex].group;
							}
						}}
					></T>
				{/if}
			{/each}
		</T>
	{/if}
{/each}
{#if globalStates.selectedGroup instanceof THREE.Group && globalStates.addingJoint == false}
	<TransformControls object={globalStates.selectedGroup} />
{/if}
