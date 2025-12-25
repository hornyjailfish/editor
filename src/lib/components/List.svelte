<script lang="ts">
	let { onclick= (e: MouseEvent)=>{console.log(rooms)}, rooms = $bindable([]) } = $props();
	let data = $derived(rooms);
	function remove(index: number) {
		rooms.splice(index, 1);
	}
</script>


{#if data.length > 0}
<div class="p-2 bg-slate-200 flex flex-col items-stretch gap-1 justify-between size-auto">
		<button {onclick} class="border focus:border-0 focus:outline-2 outline-blue-600 px-2 text-gray-500 text-shadow-none text-shadow-white border-sky-500 bg-slate-300 w-full h-full" type="submit">Save to db?</button>
		<h1 class="text-center text-xl text-gray-500 font-bold">Rooms to add</h1>
	<ul class="list-inside flex flex-col items-stretch justify-around">
		{#each data as room, i}
			<span class="flex flex-row justify-between">
				<li class=" list-item text-gray-500 text-shadow-none text-shadow-white">
					{room?.name} - {room?.area}
				</li>
				<button onclick={()=>remove(i)} class="rounded-4xl border focus:border-0 focus:outline-2 outline-rose-600 px-0.5 text-rose-500 text-shadow-none text-shadow-white border-rose-500 bg-rose-300 w-auto h-full">x</button>
			</span>
		{/each}
	</ul>
</div>
	{/if}
