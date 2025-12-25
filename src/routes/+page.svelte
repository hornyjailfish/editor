<script lang="ts">
  import Graph from "$lib/components/Graph.svelte";
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import type { ColorMode } from "@xyflow/system";

  let { data } = $props();
  const d = data.electric_rooms;
  let test_data = $state.raw(d);
const nodes = $state.raw([
  {
    id: 'electric_rooms:test',
    type: 'room_group',
    height: 200,
    data: {
      boards: [],
      id: "electric_rooms:test",
      name: 'Щ-67'
    } ,
    position: { x: 0, y: 0 }
  },
  {
    id: '1',
    type: 'board_group',
    parentId: 'electric_rooms:test',
    extent: 'parent',
    width: 100,
    data: { name: 'щ 69' },
    position: { x: 10, y: 10 }
  },
]);

const edges = $state.raw([
]);

let colorMode: ColorMode = $state('system');
</script>

<SvelteFlowProvider>
  <Graph nodes={test_data} {edges} {colorMode} />
</SvelteFlowProvider>
