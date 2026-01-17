<script lang="ts">
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import type { ColorMode } from "@xyflow/system";
  import ELK, { type ElkNode } from "elkjs/lib/elk.bundled.js";

  import { elk2flow } from "$lib/utils";
  import Graph from "$lib/components/Graph.svelte";
	import { toast } from "svelte-sonner";
	import { invalidateAll } from "$app/navigation";

  let { data } = $props();
  $inspect(data);
  if (data.error != null) setTimeout(()=>{toast.error(data.error, { action: { label: "retry", onClick: invalidateAll }  });}, 1000);
  const d = data.nodes;
  const nodes = $state.raw(data.nodes);
  const edges = $state.raw(data.edges);

  const elk = new ELK();
  const layouting = data.elkTree && elk.layout(data.elkTree);

  function oninit(e: any) {

  }

  let colorMode: ColorMode = $state("system");
</script>
{#if data.error == undefined}
  {#await layouting}
    loading...
    {:then layout}
    {#await Promise.all(layout!.children!.map((node)=>elk2flow(node as ElkNode & any)).flat())}
      creating flow...
      {:then flow}
      <SvelteFlowProvider>
        <Graph nodes={flow} {edges} {colorMode} />
      </SvelteFlowProvider>
    {/await}
  {/await}
{:else}
      <SvelteFlowProvider>
        <Graph nodes={[]} edges={[]} {colorMode} />
      </SvelteFlowProvider>
{/if}
