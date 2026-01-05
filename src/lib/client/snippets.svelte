<script module>
import { ControlButton, type ControlButtonProps } from "@xyflow/svelte";
import TristateButton from "$lib/components/TristateButton.svelte";

export { DumbButton, Lock, ResizeButton, FitViewButton, DeleteButton };

</script>
{#snippet DumbButton(props: ControlButtonProps)}
    <ControlButton onclick={(e)=>console.log(e)} {...props} type="button">
        PLACEHOLDER
    </ControlButton>
{/snippet}

{#snippet ResizeButton(props: ControlButtonProps & { active?: boolean } = {active: false})}
    <ControlButton {...props} type="button">
        <span class="icon-[material-symbols--resize-rounded]"></span>
    </ControlButton>
{/snippet}

{#snippet Lock(props: ControlButtonProps & { nodes?: string[] })}
    <TristateButton {...props} type="button">
        <span class="icon-[material-symbols--drag-pan-rounded]"></span>
    </TristateButton>
{/snippet}

{#snippet DeleteButton(props: ControlButtonProps)}
    <ControlButton {...props} type="button">
        <span class="icon-[solar--trash-bin-2-bold-duotone]"></span>
    </ControlButton>
{/snippet}

{#snippet FitViewButton(props: ControlButtonProps)}
    <ControlButton {...props}  type="button">
        <span class="icon-[solar--full-screen-line-duotone]"></span>
    </ControlButton>
{/snippet}

<script lang="ts">
</script>
