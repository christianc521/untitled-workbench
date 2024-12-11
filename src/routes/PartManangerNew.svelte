<script lang="ts">
	import { TransformControls } from '@threlte/extras';
	import { interactivity } from '@threlte/extras';
	import Part3D from './Part3D.svelte';
	import { Part, parts } from './parts.svelte';
	import { globalStates } from './global.svelte';
	interactivity();
</script>

{#each parts as part}
	<Part3D PartInstance={part}>
		{#snippet children({ ref })}
			{#if part.active && globalStates.activeTool !== 'addingJoint'}
				<TransformControls
					position={part.mesh.position.toArray()}
					mode="translate"
					isDragging={() => {}}
					onobjectChange={() => {
						part.mesh.position.copy(ref.position);
						console.log(part.joints);
						if (part instanceof Part) {
							for (const joint of part.joints) {
								joint.parentMesh.position.set(
									part.mesh.position.x,
									part.mesh.position.y,
									part.mesh.position.z
								);
								joint.parentMesh = joint.parentMesh;
								joint.updatePosition();
								console.log('joint parent pos: ', joint.parentMesh.position.toArray());
								console.log('cylinder pos: ', part.mesh.position.toArray());
								parts[0] = parts[0];
							}
						}
					}}
					object={ref}
				/>
			{/if}
		{/snippet}
	</Part3D>
{/each}
