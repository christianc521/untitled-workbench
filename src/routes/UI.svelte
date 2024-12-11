<script lang="ts">
	import { createRootObject, getMeshGeometry } from './parts.svelte';
	import { globalStates } from './global.svelte';
	import WorkbenchUI from './WorkbenchUI.svelte';
	import * as THREE from 'three';
</script>

{#snippet partButton(type: string, display: string)}
	<button
		onclick={() => {
			const geometry = getMeshGeometry(type);
			const material = new THREE.MeshStandardMaterial({ color: 0xf8dfa1 });
			createRootObject(geometry, material);
		}}
		disabled={globalStates.addingJoint}
	>
		{display}
	</button>
{/snippet}

{@render partButton('box', 'Add Surface (R)')}
{@render partButton('cylinder', 'Add Dowel (D)')}
{@render partButton('sphere', 'Test Joint (J)')}

<button onclick={() => (globalStates.addingJoint = !globalStates.addingJoint)}>
	Select Face
</button>
<h1>{globalStates.addingJoint}</h1>
