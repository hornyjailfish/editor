<script lang="ts">
    import { type Node } from "@xyflow/svelte";
    import type { NodeProps } from "@xyflow/system";
    import type { HTMLAttributes } from "svelte/elements";

    import RootBreaker from './RootBreaker.svelte';
    import Base from "./Base.svelte";
    import type { Breaker } from "$lib/server/schemas";

    type Props = {
    } & NodeProps<Node<Breaker>> & HTMLAttributes<HTMLElement>

    let {
        id,
        data,
        class: className,
        type,
        ...rest
    }: Props = $props();

    let breaker: HTMLElement | undefined = $state();
</script>

<Base {...rest} class={className} {type} {id} {data}>
    {#snippet children()}
        <RootBreaker {...rest} {type} {data} {id} class="size-full" />
    {/snippet}
</Base>
