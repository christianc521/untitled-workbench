<script lang="ts">
	import { interactivity } from '@threlte/extras';
	import Part3D from './Part3D.svelte';
	import { rootGroups } from './parts.svelte';
	interactivity();
</script>

<Part3D PartInstance={rootGroups.root}></Part3D>
