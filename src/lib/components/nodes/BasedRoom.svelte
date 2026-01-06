<script lang="ts">
    import { type Node } from "@xyflow/svelte";
    import type { NodeProps } from "@xyflow/system";
    import type { HTMLAttributes } from "svelte/elements";

    import Room from './RoomGroup.svelte';
    import Base from "./Base.svelte";
    import type { ElectricRoom } from "$lib/server/schemas";

    type Props = {
    } & NodeProps<Node<ElectricRoom>> & HTMLAttributes<HTMLElement>

    let {
        id,
        data,
        class: className,
        type,
        ...rest
    }: Props = $props();

    let room: HTMLElement | undefined = $state();
</script>

<!-- <NodeToolbar class="text-slate-500 h-full"  position={Position.Left} align="end" nodeId={id}> -->
<!--     <div class="flex flex-col gap-1 *:rounded-lg" transition:fade> -->
<!--         <ControlButton {...resizeControlProps} type="button" onclick={()=>resizeable=!resizeable}> -->
<!--             <span class="icon-[material-symbols--resize-rounded]"></span> -->
<!--         </ControlButton> -->
<!--     </div> -->
<!-- </NodeToolbar> -->
<Base {...rest} class={className} {type} {id} {data}>
    {#snippet children()}
        <Room {...rest} {type} {data} {id} class="size-full" />
    {/snippet}
</Base>
