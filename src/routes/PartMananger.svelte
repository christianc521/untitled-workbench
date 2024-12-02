<script lang="ts">
	import { parts } from './parts.svelte';
	import { TransformControls } from '@threlte/extras';
	import { interactivity } from '@threlte/extras';
	import Part3D from './Part3D.svelte';
	import { activeTool } from './global.svelte';
	interactivity();
</script>

{#each parts as part, i}
	<Part3D PartInstance={part}>
		{#snippet children({ ref })}
			{#if part.active && !activeTool.addingJoint}
				<TransformControls
					mode="translate"
					object={ref}
					onmouseUp={() => {
						part.position = ref.position;
						parts[i] = part;
					}}
				/>
			{/if}
		{/snippet}
	</Part3D>
	{#each part.subParts as subPart}
		<svelte:self parts={subPart} />
	{/each}
{/each}
