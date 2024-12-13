<script lang="ts">
	import { createRootObject } from './parts.svelte';
	import { globalStates } from './global.svelte';
</script>

{#snippet partButton(type: string, display: string)}
	<button
		onclick={() => {
			createRootObject(type);
		}}
		disabled={globalStates.addingJoint}
	>
		{display}
	</button>
{/snippet}

{@render partButton('box', 'Add Surface (R)')}
{@render partButton('cylinder', 'Add Dowel (D)')}
{@render partButton('sphere', 'Test Joint (J)')}

<button
	onclick={() => {
		globalStates.addingJoint = !globalStates.addingJoint;
		globalStates.selectedGroup = undefined;
	}}
>
	Select Face
</button>
<h1>{globalStates.addingJoint}</h1>
