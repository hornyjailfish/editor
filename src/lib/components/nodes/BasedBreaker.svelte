<script lang="ts">
    import { useSvelteFlow, type Node } from "@xyflow/svelte";
    import type { NodeProps } from "@xyflow/system";
    import type { HTMLAttributes } from "svelte/elements";

    import Breakers from './Breaker.svelte';
    import Base from "./Base.svelte";
    import type { Breaker } from "$lib/server/schemas";

    type Props = {
    } & NodeProps<Node<Breaker>> & HTMLAttributes<HTMLElement>

    let {
        id,
        data,
        class: className,
        type,
        hidden,
        ...rest
    }: Props = $props();

</script>

<Base {...rest} class={className} {type} {id} {data}>
    {#snippet children()}
        <Breakers {...rest} {type} {data} {id} class="size-full" />
    {/snippet}
</Base>
