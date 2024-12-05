<script lang="ts">
	import { TransformControls } from '@threlte/extras';
	import { interactivity } from '@threlte/extras';
	import Part3D from './Part3D.svelte';
	import { parts } from './parts.svelte';
	import { activeTool } from './global.svelte';
	interactivity();

	export let partsInstance = parts;
</script>

{#each partsInstance as part, i}
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
{/each}
