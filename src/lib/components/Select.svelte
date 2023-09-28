<script lang="ts">
	export let id: string;
	export let value;
</script>

<span class="container">
	<select {id} bind:value>
		<slot />
	</select>
</span>

<style>
	select {
		all: unset;
		appearance: none;
	}

	.container {
		background-color: white;
		border: 1px solid var(--border-color);
		border-radius: 0.25em;
		color: var(--text-color);
		cursor: pointer;
		font: normal 1rem / calc(1.5em - 2px) var(--font-mono);
		outline: none;
		padding: 0 calc(0.5em - 1px);
	}

	.container:focus-within {
		border-color: transparent;
		outline: 0.125em solid currentColor;
	}

	.container:hover {
		filter: brightness(0.925);
	}
</style>
