<script>
	import { OrbitControls } from '@threlte/extras';
	import { T } from '@threlte/core';
</script>

<T.PerspectiveCamera makeDefault position={[1, 3, 6]}>
	<OrbitControls />
</T.PerspectiveCamera>
