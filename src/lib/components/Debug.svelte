<script lang="ts">
	function handleBeforeInput(event) {
		event.preventDefault();
	}

	function handlePaste(event: ClipboardEvent) {
		console.group('Debug: paste');
		console.group('text');
		console.log(event.clipboardData.getData('text/plain'));
		console.groupEnd();
		console.group('html');
		console.log(event.clipboardData.getData('text/html'));
		console.groupEnd();
		console.groupEnd();
		event.preventDefault();
	}
</script>

<textarea
	aria-label="debug: paste here and look at developer console"
	placeholder="debug"
	rows="1"
	value="debug"
	on:beforeinput={handleBeforeInput}
	on:paste={handlePaste}
/>

<style>
	textarea {
		background-color: white;
		border: 1px solid var(--border-color);
		border-radius: 0.25em;
		box-sizing: content-box;
		color: var(--text-color);
		cursor: pointer;
		font: normal 1rem/1 var(--font-mono);
		outline: none;
		padding: calc(0.25em - 1px) calc(0.5em - 1px);
		resize: none;
		width: 5ch;
	}

	textarea:focus {
		border-color: transparent;
		outline: 0.125em solid currentColor;
	}

	textarea:hover {
		filter: brightness(0.925);
	}
</style>
