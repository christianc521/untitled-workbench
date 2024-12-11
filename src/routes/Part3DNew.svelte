<script lang="ts">
	import type { Snippet } from 'svelte';
	import { T } from '@threlte/core';
	import type { IntersectionEvent } from '@threlte/extras';
	import { interactivity } from '@threlte/extras';
	import { globalStates } from './global.svelte';
	import { parts } from './parts.svelte';
	import { Part, Joint } from './parts.svelte';
	import * as THREE from 'three';
	import { injectLookAtPlugin } from './lookAtPlugin';
	interactivity();
	injectLookAtPlugin();

	let {
		PartInstance,
		children
	}: {
		PartInstance: Part | Joint;
		children?: Snippet<[{ ref: THREE.Mesh }]>;
	} = $props();

	let meshRef: THREE.Mesh | undefined = $state(PartInstance.mesh);
</script>

{#if PartInstance.meshType === 'cylinder'}
	<T.Mesh
		bind:ref={meshRef}
		position={PartInstance.mesh.position.toArray()}
		rotation={PartInstance.mesh.rotation.toArray()}
		geometry={PartInstance.mesh.geometry}
		object={PartInstance.mesh}
		scale={PartInstance.mesh.scale.toArray()}
		onclick={(e: IntersectionEvent<MouseEvent>) => {
			e.stopPropagation();
			if (globalStates.activeTool != 'addingJoint') {
				PartInstance.active = true;
				// globalStates.partPlaceholder = PartInstance;
			}

			parts[0] = parts[0];
			PartInstance.handleOnClickEditing(e);
		}}
	>
		<T.MeshStandardMaterial wireframe={true} color={0xf8dfa1} />
	</T.Mesh>
	{#if children && meshRef}
		{@render children({ ref: meshRef })}
	{/if}
{/if}
{#if PartInstance instanceof Joint}
	<T.Mesh
		bind:ref={meshRef}
		position={PartInstance.parentMesh.position.toArray()}
		rotation={PartInstance.mesh.rotation.toArray()}
		geometry={PartInstance.mesh.geometry}
		object={PartInstance.mesh}
		scale={PartInstance.mesh.scale.toArray()}
		onclick={(e: IntersectionEvent<MouseEvent>) => {
			e.stopPropagation();
			console.log('parent position: ', PartInstance.parentMesh.position.toArray());
			if (globalStates.activeTool != 'addingJoint') {
				PartInstance.active = true;
				// globalStates.partPlaceholder = PartInstance;
			}
		}}
	>
		<T.MeshStandardMaterial wireframe={true} color={0xf8dfa1} />
	</T.Mesh>
	{#if children && meshRef}
		{@render children({ ref: meshRef })}
	{/if}
{/if}
