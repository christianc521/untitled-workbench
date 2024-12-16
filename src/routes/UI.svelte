<script lang="ts">
	import { createRootObject, editScale } from './parts.svelte';
	import { globalStates } from './global.svelte';

	let newScale = $state(1);
</script>

{#snippet partButton(type: string, display: string)}
	<button
		onclick={() => {
			const root = createRootObject(type);
			globalStates.selectedGroup = root.group;
			globalStates.modifyingObjectIndex = 0;
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

<div>
	<input
		type="range"
		bind:value={newScale}
		min="0.5"
		max="5"
		onchange={() => {
			editScale(newScale, 'y');
		}}
	/>
</div>
