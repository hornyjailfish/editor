<script lang="ts">
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import type { ColorMode } from "@xyflow/system";
  import ELK from 'elkjs/lib/elk-api';
  import type {  ElkNode , ELK as Elk } from 'elkjs/lib/elk-api';
  import Worker from "elkjs/lib/elk-worker?worker";
  import { browser } from '$app/environment';

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

  if (browser) {
    elk = new ELK({ workerFactory: ()=>new Worker({ name: new URL('elkjs/lib/elk-worker.min.js', import.meta.url).toString()}) });
  }



  let colorMode: ColorMode = $state("system");
</script>

<SvelteFlowProvider>
  <Graph {elk} nodes={data.nodes} {colorMode} />
</SvelteFlowProvider>
