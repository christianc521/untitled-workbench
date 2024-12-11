<script lang="ts">
	import { TransformControls } from '@threlte/extras';
	import { globalStates } from './global.svelte';
	import { Part } from './parts.svelte';
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	interface Props {
		buffer: Part;
	}

	let { buffer }: Props = $props();
	const bufferMaterial = new THREE.MeshStandardMaterial({
		color: 0xf8dfa1,
		transparent: true,
		opacity: 0.5
	});
</script>

<T.Mesh
	material={bufferMaterial}
	position={buffer.mesh.position.toArray()}
	object={buffer.mesh}
	rotation={buffer.mesh.rotation.toArray()}
	geometry={buffer.mesh.geometry}
	scale={buffer.scale}
>
	{#snippet children({ ref })}
		<TransformControls
			mode="translate"
			object={ref}
			onmouseUp={() => {
				if (globalStates.partPlaceholder) {
					globalStates.partPlaceholder.mesh.position.copy(ref.position);
				}
			}}
		/>
	{/snippet}
</T.Mesh>
