<script lang="ts">
</script>

<div class="text-center">
	<form method="POST" action="/api/rooms">
		<input class="form-input" type="text" name="name" placeholder="Room name" />
		<input class="form-input" type="number" step=".01" name="area" placeholder="Area" />
		<button type="submit">Create room</button>
	</form>
</div>
