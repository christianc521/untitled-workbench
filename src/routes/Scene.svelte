<script lang="ts">
	import { T } from '@threlte/core';
	import { Grid } from '@threlte/extras';
	import Camera from './Camera.svelte';
	import PartManager from './PartMananger.svelte';
	import { interactivity } from '@threlte/extras';
	import { parts } from './parts.svelte';

	interactivity();
</script>

<Camera />
<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[1, 2, 5]} />
<Grid
	ondblclick={() => {
		for (var part of parts) {
			part.active = false;
		}
	}}
	position.y={-0.001}
/>
<PartManager />
