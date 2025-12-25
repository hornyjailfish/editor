<script lang="ts">
import {
    useSvelteFlow,
    type OnConnectEnd,
    SvelteFlow,
    Panel,
    Controls,
    Background,
    BackgroundVariant,
    type SvelteFlowProps,
    type Node,
} from '@xyflow/svelte';

import ELK from "elkjs/lib/elk.bundled.js";

import Button from '$lib/components/Button.svelte';
import RoomGroup from '$lib/components/nodes/RoomGroup.svelte';
import BoardGroup from '$lib/components/nodes/BoardGroup.svelte';

let { nodes=$bindable([]), edges=$bindable([]), colorMode=$bindable("system") }: SvelteFlowProps = $props();

const elk = new ELK();
const { fitView } = useSvelteFlow();
const defalultSize = {width: 200, height: 200};

async function layout(nodes: Node[],edges, options) {
    if (!elk) return { nodes, edges };
    const graph = {
        id: 'root',
        layoutOptions: options,
        children: nodes.map((node)=>({
            id: node.id,
            width: node.measured?.width || defalultSize.width,
            height: node.measured?.height || defalultSize.height,
            x: node.position?.x || 0,
            y: node.position?.y || 0,
            data: node.data,
        })),
        edges: edges.map((edge)=>({
            id: edge.id,
            source: edge.source,
            target: edge.target,

        })),
    };
    const elkGraph = await elk.layout(graph);
    const layoutedNodes = nodes.map((node)=>{
        const elkNode = elkGraph?.children.find(n=>n.id === node.id);
        if (!elkNode) return node;
        return {
            ...node,
            position: {
                x: elkNode.x,
                y: elkNode.y,
            },
        };
    });
    return { nodes: layoutedNodes, edges };
}

import { error } from '@sveltejs/kit';
async function onLayout() {
    try {
        let options = {
            "elk.algorithm": "layered",
            "elk.direction": "DOWN",
            "elk.layered.spacing.nodeNodeBetweenLayers": "32",
            "elk.spacing.nodeNode": "100",
        };
        const withLayout = await layout(nodes, edges, options);
        nodes = withLayout.nodes
        edges = withLayout.edges
        fitView();
    } catch (e: any) {
        error(400, e.message);
    }
}

const { screenToFlowPosition } = useSvelteFlow();

const onconnectend: OnConnectEnd = (event, state) => {
    if (state.isValid)  return;
    const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
    const parent = state.fromNode?.parentId
    console.log("empty connect!", parent);
    // TODO: handle out of group case
}

const nodeTypes = {
    room_group: RoomGroup,
    board_group: BoardGroup,
}

</script>

<SvelteFlow
    proOptions={{hideAttribution: true}}
    {nodes}
    {edges}
    {colorMode}
    {nodeTypes}
    snapGrid={[5, 5]}
    onnodeclick={(event) => console.log('on node click', event)}
>
    <Controls position="top-right"  />
    <Panel class="bg-transparent p-1 flex flex-row gap-2 justify-center items-center w-auto h-fit" position="bottom-center">
            <Button class="text-emerald-600"  onclick={()=>console.log("click")}>
                {#snippet children()}
                    <span class="size-6 icon-[material-symbols--add-2-rounded]"></span>
                    <div class="size-auto">Add Room</div>
                {/snippet}
            </Button>
            <Button class="text-amber-600"  onclick={()=>onLayout()}>
                {#snippet children()}
                    <span class="size-6 icon-[material-symbols--responsive-layout-outline-rounded]"></span>
                    <div class="size-auto">layout?</div>
                {/snippet}
            </Button>
    </Panel>
    <Panel class="bg-transparent p-1 flex flex-row gap-2 justify-center items-center w-auto h-fit" position="bottom-right">
            <Button title="Update db" class="hover:bg-rose-200 hover:text-rose-500" onclick={()=>console.log("click")}>
                {#snippet children()}
                    <span class="size-6 icon-[material-symbols--database-upload-outline-rounded]"></span>
                {/snippet}
            </Button>
    </Panel>
    <Background size={1} bgColor='var(--color-gray-300)' variant={BackgroundVariant.Dots} />
</SvelteFlow>
