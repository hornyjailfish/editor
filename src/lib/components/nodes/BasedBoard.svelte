<script lang="ts">
    import { type Node } from "@xyflow/svelte";
    import type { NodeProps } from "@xyflow/system";
    import type { HTMLAttributes } from "svelte/elements";

    import Boards from './BoardGroup.svelte';
    import Base from "./Base.svelte";
    import type { Board } from "$lib/server/schemas";

    type Props = {
    } & NodeProps<Node<Board>> & HTMLAttributes<HTMLElement>

    let {
        id,
        data,
        class: className,
        type,
        ...rest
    }: Props = $props();

    let board: HTMLElement | undefined = $state();
</script>

<Base {...rest} class={className} {type} {id} {data}>
    {#snippet children()}
        <Boards {...rest} {type} {data} {id} class="size-full" />
    {/snippet}
</Base>
