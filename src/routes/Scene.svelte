<script lang="ts">
	import { T } from '@threlte/core';
	import { Grid } from '@threlte/extras';
	import Camera from './Camera.svelte';
	import PartManager from './PartMananger.svelte';
	import { interactivity } from '@threlte/extras';
	import { parts, deselectAll } from './parts.svelte';

	interactivity();
</script>

<Camera />
<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[1, 2, 5]} />
<Grid
	ondblclick={() => {
		deselectAll(parts);
	}}
	position.y={-0.001}
/>
<PartManager />
