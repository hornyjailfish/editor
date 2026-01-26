<script lang="ts">
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import type { ColorMode } from "@xyflow/system";
  import { mode } from "mode-watcher";
  import ELK, { type ELK as Elk } from "elkjs/lib/elk-api";
  import Worker from "elkjs/lib/elk-worker?worker";
  import { toast } from "svelte-sonner";
  import { browser } from '$app/environment';
  import { invalidateAll } from "$app/navigation";

  import Graph from "$lib/components/Graph.svelte";

  let { data } = $props();
  if (data.error != null) setTimeout(()=>{toast.error(data.error, { action: { label: "retry", onClick: invalidateAll }  });}, 1000);

  let elk: Elk | null = $state(null);
  if (browser) {
    elk = new ELK({ workerFactory: ()=>new Worker({ name: new URL('elkjs/lib/elk-worker.min.js', import.meta.url).toString()}) });
  }

  let colorMode: ColorMode = $state("system");
  $effect(() => {
    if (colorMode !== 'system') {
      document.documentElement.classList.toggle('dark', colorMode === 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      if(mode.current === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  });

  $effect(() => {
    return ()=>{
      if (elk) {
        elk.terminateWorker();
      }
    }
  });
</script>

<SvelteFlowProvider >
  {#if data.error == null}
    <Graph {elk} nodes={data.nodes} bind:colorMode />
  {/if}
</SvelteFlowProvider>
