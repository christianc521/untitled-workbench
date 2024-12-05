<script lang="ts">
	import Self from './WorkbenchUI.svelte';
	import type { Part } from './parts.svelte';

	let {
		PartInstance
	}: {
		PartInstance: Part;
	} = $props();
</script>

<h1>{PartInstance.meshType}</h1>
{#if PartInstance.subParts.length > 0}
	{#each PartInstance.subParts as subPart}
		<Self PartInstance={subPart} />
	{/each}
{/if}
