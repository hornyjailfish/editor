<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLButtonAttributes, DOMAttributes } from "svelte/elements";
    import { clsx } from 'clsx';
    import { twMerge } from 'tailwind-merge';

    type Props = {
	children?: Snippet<[object | undefined]>
    } & HTMLButtonAttributes & DOMAttributes<HTMLButtonElement>;

    const defaultClass = clsx(['bg-slate-200', 'hover:bg-slate-400', 'p-2', 'rounded-md', 'flex', 'flex-row', 'justify-center'])

    let { children, class: className=defaultClass, title, onclick, ...rest }: Props = $props();

    className = twMerge(clsx(defaultClass, className));
</script>

<button {title} {onclick} {...rest} class={className}>
    {@render children?.()}
</button>
