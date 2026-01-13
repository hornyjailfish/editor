<script lang="ts">
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import type { ColorMode } from "@xyflow/system";
  import ELK from 'elkjs/lib/elk-api';
  import type {  ElkNode , ELK as Elk } from 'elkjs/lib/elk-api';
  import Worker from "elkjs/lib/elk-worker?worker";
  import { browser } from '$app/environment';

  import Graph from "$lib/components/Graph.svelte";

  let { data } = $props();
  let elk: Elk | null = $state(null);
  let elkGraph: ElkNode | null = $state(null);
  if (browser) {
    elk = new ELK({ workerFactory: ()=>new Worker({ name: new URL('elkjs/lib/elk-worker.min.js', import.meta.url).toString()}) });
  }



  let colorMode: ColorMode = $state("system");
</script>

<SvelteFlowProvider>
  <Graph {elk} nodes={data.nodes} {colorMode} />
</SvelteFlowProvider>
