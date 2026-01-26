<script lang="ts">
import { twMerge } from "tailwind-merge";
import { fade, slide, scale } from "svelte/transition";
import { RecordId, getIncrementalID, r } from "surrealdb";
import { ControlButton, NodeToolbar, Position, useNodes } from "@xyflow/svelte";

import * as Dialog from "$lib/components/ui/dialog";
import * as Input from "$lib/components/ui/input";
import * as Form from "$lib/components/ui/form";
let { id, size, isVisible, ...rest } =  $props();

const nodes = useNodes();

let editable = $state(false);

let openDiag = $state(false);
let prompt = $state("");

function addBoard() {
    nodes.update(current=>{
        current.push({
            id: "unsaved-board"+getIncrementalID(),
            type: "boards",
            position: { x: 0, y: 0 },
            data: {
                name: prompt,
                room: r(id)
            }
        });
        return current;
    });
}
</script>

<NodeToolbar {isVisible} offset={1} class="h-auto" position={Position.Right} align="start" nodeId={id}>
    <div class="border-l border-l-amber-500 flex flex-col gap-1 *:rounded-r-md items-start justify-baseline" in:slide={{ axis: "x" }} >
    <ControlButton title="Edit" onclick={()=>editable=!editable}>
        {#if !editable}
            <span class="bg-rose-300 icon-[solar--lock-password-bold-duotone]"></span>
        {:else}
            <span class="text-sky-300 icon-[solar--lock-password-unlocked-bold-duotone]"></span>
        {/if}
    </ControlButton>
    {#if editable}
        <div class="*:rounded-r-md flex flex-col gap-1" transition:slide={{ axis: "x" }}>
                <Dialog.Root open={openDiag} onOpenChange={()=>{console.log(); openDiag=false}}>
                    <Dialog.Content>
                        <Dialog.Header>
                            TST
                        </Dialog.Header>
                        <Dialog.Close />
                        <Form.Field >
                            <Form.Label >
                                tst
                            </Form.Label >
                            <Input.Root class="w-full" bind:value={prompt} >
                                <Input.Input />
                            </Input.Root>
                            <Form.FieldErrors />
                            <Form.Button/>
                        </Form.Field >
                    </Dialog.Content>
                    <Dialog.Footer>
                    </Dialog.Footer>
                    <Dialog.Trigger>
                        <ControlButton class="mt-auto" title="Layout">
                            <span class="bg-cyan-300 icon-[solar--widget-add-bold-duotone]"></span>
                        </ControlButton>
                    </Dialog.Trigger>
                </Dialog.Root>
                <ControlButton title="Add Board" onclick={()=>editable=false}>
                    <span class="bg-emerald-300 icon-[solar--check-bold-duotone]"></span>
                </ControlButton>
            </div>
    {/if}
    </div>
</NodeToolbar>
