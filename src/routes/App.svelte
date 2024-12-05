<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import UI from './UI.svelte';
</script>

<div class="ui">
	<UI />
</div>
<div class="canvas">
	<Canvas>
		<Scene />
	</Canvas>
</div>

<style>
	.ui {
		position: absolute;
		z-index: 4;
	}
	.canvas {
		position: absolute;
		z-index: 3;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
	}
</style>
