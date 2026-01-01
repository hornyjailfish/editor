<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import { clsx } from 'clsx';
	import { ControlButton, type ControlButtonProps } from '@xyflow/svelte';

  let {
    children,
    class: className,
    ...restProps
  }: Partial<ControlButtonProps> = $props();
</script>

<ControlButton
    class={clsx(className)}
    {...restProps}
>
  {@render children?.()}
</ControlButton>

<style>
</style>
