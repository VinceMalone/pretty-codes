<button on:click>
	<slot />
</button>

<style>
	button {
		background-color: white;
		border: 1px solid var(--border-color);
		border-radius: 0.25em;
		color: var(--text-color);
		cursor: pointer;
		font: normal 1rem/1 var(--font-mono);
		outline: none;
		padding: calc(0.25em - 1px) calc(0.5em - 1px);
	}

	button:focus-visible {
		border-color: transparent;
		outline: 0.125em solid currentColor;
	}

	button:hover {
		filter: brightness(0.925);
	}
</style>
