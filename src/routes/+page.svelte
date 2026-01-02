<script lang="ts">
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import type { ColorMode } from "@xyflow/system";
  import ELK from "elkjs/lib/elk.bundled.js";

  import { elk2flow } from "$lib/utils";
  import Graph from "$lib/components/Graph.svelte";

  let { data } = $props();
  const d = data.nodes;
  const nodes = $state.raw(data.nodes);
  const edges = $state.raw(data.edges);

  const elk = new ELK();
  const layouting = elk.layout(data.elkTree);
  console.log("nodes", nodes);
  function oninit(e: any) {

  }

  let colorMode: ColorMode = $state("system");
</script>
{#await layouting}
  loading
  {:then layout}
    {#await Promise.all(layout.children.map((node)=>elk2flow(node)).flat())}
    {:then flow}
      <SvelteFlowProvider>
        <Graph nodes={flow} {edges} {colorMode} />
      </SvelteFlowProvider>
{/await}
{/await}
