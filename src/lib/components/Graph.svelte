<script module>
import { SvelteMap } from "svelte/reactivity";
import { fromStore, writable } from "svelte/store";

export const resizer = writable(new SvelteMap<string, boolean>());
export const client_nodes = writable<Node[]>([]);
export const client_edges = writable<Edge[]>([]);
</script>

<script lang="ts">
import type { ELK, ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk-api';

import { Uuid } from 'surrealdb';
import { twMerge } from 'tailwind-merge';
import { error } from '@sveltejs/kit';
import {
    useSvelteFlow,
    useStore,
    useNodes,
    useNodesInitialized,
    useInternalNode,
    type OnConnectEnd,
    SvelteFlow,
    Panel,
    Controls,
    Background,
    BackgroundVariant,
    type SvelteFlowProps,
    type Node,
    type Edge,
    type ColorMode,
    useOnSelectionChange,
} from '@xyflow/svelte';
import { toast } from "svelte-sonner";
import Button from '$lib/components/Button.svelte';

// INFO: custom node types use global css class for styling
// each node wrapper has class "svelte-flow__node-{type}"
// where "type" is key from this table
// make sure keys in utls match styles in respective node component

import { Flow, splitByParent, toElk } from '$lib/utils';
import Toolbar  from './Toolbar.svelte';
import { nestedToFlat } from "$lib/client/utls";
	import { tick } from "svelte";

let { elk, nodes=$bindable([]), edges=$bindable([]), colorMode=$bindable("system") }: SvelteFlowProps & { elk: ELK | null } = $props();

const { nodeLookup } = useStore();
const nodesInitialized = $derived(useNodesInitialized().current);
let dbNodes: Node[] = $state.raw(nodes);
const { fitView, getZoom, getNodes, updateNode } = useSvelteFlow();

const boards = dbNodes.filter(n=>n.type == "breakers");
const zoom = $derived.by(getZoom);
const isHidden = $derived(zoom<0.8);


$effect(()=>{
    boards.forEach(n=>{
        n.hidden = isHidden;
        updateNode(n.id,{ hidden: isHidden });
    });
});

async function layout(nodes: Node[],edges: Edge[], options: any): Promise<{nodes: Node[], edges: Edge[]}> {
    if (!elk) {
        toast.error("elk not initialized");
        console.error("elk not initialized");
        return { nodes, edges }; // TODO: throw?
    }
    if(!nodesInitialized) return { nodes, edges };
    const groups = splitByParent(nodes);
    const [rooms, boards, breakers] = Object.values(groups);
    const base = toElk(rooms, boards, breakers);
    const elkGraph = await elk.layout(base, options);
    const flaten: ElkNode[] = nestedToFlat(elkGraph.children);
    const layoutedNodes = nodes.map((node)=>{
        let elkNode
        // INFO: there are only 3 nested levels right now Room-->Board-->Breaker
        // if it changes should rewrite it to maps/sets for better performance
        elkNode = flaten.find(n=>n.id === node.id );
        if (!elkNode) {
            console.log("node not found:", node.id);
            return node;
        }
        return {
            ...node,
            position: {
                x: elkNode.x,
                y: elkNode.y,
            },
            width: elkNode.width,
            height: elkNode.height,
        };
    });
    return { nodes: layoutedNodes, edges };
}
const store = useNodes();

async function onLayout() {
    try {
        let options = {
            "elk.algorithm": "layered",
            "elk.direction": "RIGHT",
            "elk.spacing.nodeNode": "8",
            "elk.padding": "4",
            // "elk.hierarchyHandling": "INCLUDE_CHILDREN",
        };
        const withLayout = await layout(dbNodes, edges, options);
        dbNodes = withLayout.nodes
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

async function testRoom() {
    const id = Uuid.v4().toString();
    console.log("add room", id);
    $client_nodes.push({
        id,
        type: 'electric_rooms',
        data: { id, name: 'щ 69' },
        position: { x: 0, y: 0 }
    });
    await onLayout();
}

type Theme = { mode: ColorMode, icon: string };
const themes: Theme[] = [
    { mode: "system", icon: "icon-[material-symbols--computer-outline-rounded]" },
    { mode: "light", icon: "icon-[material-symbols--light-mode-outline-rounded]" },
    { mode: "dark", icon: "icon-[material-symbols--dark-mode-outline-rounded]" }
];
let themeIdx = $state(0);

function toggleColorMode() {
    themeIdx =  (themeIdx + 1) % themes.length;
}

const node = useNodes();
$effect(() => {
    colorMode = themes[themeIdx].mode;
});

let selectedNodesIds = $state<string[]>([]);
let selectedNodes = $state<Node[]>([]);

useOnSelectionChange(({nodes})=>{
    selectedNodesIds = nodes.map(n=>n.id);
    selectedNodes = nodes;
});

let selectionReady = $state(true);
async function oninit() {
    console.log("oninit");
    tick().then(()=>{
        console.log("tick");
        console.log(nodesInitialized);
    });
    dbNodes.forEach(n=>$resizer.set(n.id, false));
    console.log("init",nodesInitialized);
    onLayout();
}

let appNodes: Node[] = $derived.by(()=>[...$client_nodes, ...nodes]);
function onflowerror(e: any) {
    console.error(e);
    toast.error("Flow error: "+e.message);
}
</script>

<SvelteFlow
    proOptions={{hideAttribution: true}}
    {oninit}
    {onflowerror}
    onselectionend={(e)=>{selectionReady = true}}
    onselectionstart={(e)=>{selectionReady = false}}
    selectionOnDrag
    panOnDrag={[1]}
    nodes={dbNodes}
    {edges}
    {colorMode}
    nodeTypes={Flow.nodeTypes}
    minZoom={0.1}
    maxZoom={99}
    snapGrid={[5, 5]}
    nodeDragThreshold={20}
>
    <Toolbar ready={selectionReady}  />
    <Controls position="top-right"  />
    <Panel class="bg-transparent p-1 flex flex-row gap-2 justify-center items-center w-auto h-fit" position="bottom-center">
        <Button class="text-emerald-600"  onclick={()=>testRoom()}>
            {#snippet children()}
                <span class="text-emerald-600 size-6 icon-[material-symbols--add-2-rounded]"></span>
                <div class="size-auto">Add Room</div>
            {/snippet}
        </Button>
        <Button onclick={()=>onLayout()}>
            {#snippet children()}
                <span class="text-amber-600 size-6 icon-[material-symbols--responsive-layout-outline-rounded]"></span>
                <div class="size-auto">layout?</div>
            {/snippet}
        </Button>
    </Panel>
    <Panel class="bg-transparent p-1 flex flex-row gap-2 justify-center items-center w-auto h-fit" position="bottom-right">
        <Button title="Update db" --color="var(--color-rose-400)" class="hover:bg-rose-200 hover:text-rose-500" onclick={()=>console.log("click")}>
            {#snippet children()}
                <span class="size-6 icon-[material-symbols--database-upload-outline-rounded]"></span>
            {/snippet}
        </Button>
    </Panel>
    <Panel class="bg-transparent p-1 flex flex-row gap-2 justify-center items-center w-auto h-fit" position="top-left">
        <Button title={themes[themeIdx].mode+" mode"} onclick={()=>{toggleColorMode(); }}>
            {#snippet children()}
                <span class={twMerge("size-6", themes[themeIdx].icon)}></span>
            {/snippet}
        </Button>
    </Panel>
    <Background size={1} variant={BackgroundVariant.Dots} />
</SvelteFlow>
