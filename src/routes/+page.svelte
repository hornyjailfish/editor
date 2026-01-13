<script lang="ts">
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import type { ColorMode } from "@xyflow/system";
  import ELK from 'elkjs/lib/elk-api';
  import { type ELK as Elk } from 'elkjs/lib/elk-api';
  import Worker from "elkjs/lib/elk-worker?worker";
  import { browser } from '$app/environment';

  import Graph from "$lib/components/Graph.svelte";

  let { data } = $props();
  let elk: Elk;
  if (browser) {
    elk = new ELK({ workerFactory: ()=>new Worker({ name: new URL('elkjs/lib/elk-worker.min.js', import.meta.url).toString()}) });
  }

  // const layouting = elk.layout(data.elk);


  let colorMode: ColorMode = $state("system");
</script>

<SvelteFlowProvider>
  <Graph nodes={data.nodes} {colorMode} />
</SvelteFlowProvider>
