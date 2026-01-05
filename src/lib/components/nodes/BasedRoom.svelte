<script lang="ts">
	import type { NodeProps } from "@xyflow/system";
    import type { Node } from "@xyflow/svelte";
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

<Base {...rest} class={className} {type} {id} {data}>
    {#snippet children()}
        <Room {...rest} {type} {data} {id} class="size-full" />
    {/snippet}
</Base>
