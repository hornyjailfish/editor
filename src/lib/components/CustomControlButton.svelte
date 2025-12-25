<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import { clsx } from 'clsx';
  let {
    class: className,
    type="button",
    title="button",
    onclick,
    children,
    ...restProps
  } = $props();
</script>

<button
    {type}
    {onclick}
    class={clsx(className)}
    {...restProps}
>
  {@render children?.()}
</button>

<style>
  .button {

}
</style>
