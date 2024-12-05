<script lang="ts">
	import Self from './PartMananger.svelte';
	import { TransformControls } from '@threlte/extras';
	import { interactivity } from '@threlte/extras';
	import Part3D from './Part3D.svelte';
	import { Part, parts } from './parts.svelte';
	import { activeTool } from './global.svelte';
	interactivity();

	interface Props {
		partsInstance: Part[];
		layer: number;
		omitIndex: number;
	}

	let { partsInstance = parts, layer = 0, omitIndex = -1 }: Props = $props();
</script>

{#each partsInstance as part, i}
	{#if omitIndex !== partsInstance.indexOf(part)}
		<Part3D PartInstance={part}>
			{#snippet children({ ref })}
				{#if part.active && !activeTool.addingJoint}
					<TransformControls
						mode="translate"
						object={ref}
						onmouseUp={() => {
							part.position = ref.position;
							partsInstance[i] = part;
						}}
					/>
				{/if}
			{/snippet}
		</Part3D>
	{/if}
{/each}
