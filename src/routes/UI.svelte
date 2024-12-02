<script lang="ts">
	import { addPart } from './parts.svelte';
	import { activeTool } from './global.svelte';
</script>

{#snippet partButton(type: string, display: string)}
	<button
		onclick={() => {
			addPart(type);
		}}
		disabled={activeTool.addingJoint}
	>
		{display}
	</button>
{/snippet}

{@render partButton('box', 'Add Surface (R)')}
{@render partButton('cylinder', 'Add Dowel (D)')}
{@render partButton('sphere', 'Test Joint (J)')}

<button onclick={() => (activeTool.addingJoint = !activeTool.addingJoint)}> Select Face </button>
<h1>{activeTool.addingJoint}</h1>
