<script lang="ts">
    let { cleanup, rooms= $bindable([]) } = $props();

    let name = $state('');
    let area = $state(0.00);

    function addRoom(e: SubmitEvent) {
        e.preventDefault();
        const data = {
            name,
            area
        };
        rooms.push(data);
        name = '';
        area = 0.00;
    }

    $effect(() => {
    });
</script>

<div class=" p-2  bg-slate-200 flex flex-col items-center justify-between size-auto">
    <div class="flex flex-row justify-around size-full">
        <button class="border focus:border-0 focus:outline-2 outline-rose-600 px-2 text-gray-500 text-shadow-none text-shadow-white border-rose-500 bg-rose-300 size-auto" onclick={cleanup}>Clean</button>
        <form  method="POST" onsubmit={addRoom}>
            <div class="flex flex-row gap-8 size-auto items-baseline">
            <label for="name" class="text-gray-500 text-shadow-none text-shadow-white">Name</label>
            <input bind:value={name} required class="form-input border-sky-500" type="text" name="name" placeholder="Room name" />
            <label for="area" class="text-gray-500 text-shadow-none text-shadow-white">Area</label>
            <input bind:value={area} class="form-input border-sky-500" type="number" step=".01" name="area" placeholder="Area" />
            <button class="border focus:border-0 focus:outline-2 outline-blue-600 px-2 text-gray-500 text-shadow-none text-shadow-white border-sky-500 bg-slate-300 w-auto h-full" type="submit">Add room</button>
            </div>
        </form>
    </div>
</div>
