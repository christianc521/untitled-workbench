<script lang="ts">
	import { T } from '@threlte/core';
	import { Grid } from '@threlte/extras';
	import Camera from './Camera.svelte';
	import Part3D from './Part3D.svelte';
	import { interactivity } from '@threlte/extras';
	import { rootGroups } from './parts.svelte';
	import { globalStates } from './global.svelte';

	interactivity();
	$inspect(rootGroups);
</script>

<Camera />
<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[1, 2, 5]} />
<Grid
	ondblclick={() => {
		globalStates.selectedGroup = undefined;
	}}
	position.y={-0.001}
/>
<Part3D />
