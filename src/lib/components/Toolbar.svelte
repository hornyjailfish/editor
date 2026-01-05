<script lang="ts">
import { fade } from "svelte/transition";
import { NodeToolbar, useOnSelectionChange } from "@xyflow/svelte";
import { Toolbar } from "$lib/client/toolbar.svelte";


let { ready = $bindable(true) } = $props();


const toolbar = new Toolbar();
useOnSelectionChange(({nodes, edges})=>{
    toolbar.update(nodes, edges);
});
$inspect(toolbar.availableControls);
</script>

{#key toolbar.selectedNodes}
    <NodeToolbar isVisible={toolbar.isVisible && ready } position={toolbar.position} align={toolbar.align} nodeId={toolbar.nodeId} >
	<div transition:fade={{duration: 200, delay: 30}} class="w-full flex flex-row justify-evenly gap-1 *:rounded-lg">
	    {#each toolbar.availableControls as {item, props, condition}}
		{@render item(props)}
	    {/each}
	</div>
    </NodeToolbar>
{/key}
