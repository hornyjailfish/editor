<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="justify-center items-center flex flex-col gap-2 w-full h-full">
	<span class="flex flex-row">
		<h1 class=" text-center font-bold">Error: </h1>
		<h1 class=" text-center text-red-500 font-bold">{page.status}</h1></span>
	<p class="text-center" >{page.error?.message}</p>
</div>
