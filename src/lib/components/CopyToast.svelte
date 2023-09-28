<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	let queued = false;
	let visible = false;
	let timer: number | undefined;

	export function show() {
		if (!visible) {
			visible = true;
		} else {
			window.clearTimeout(timer);
			visible = false;
			queued = true;
		}
	}

	function introend() {
		timer = window.setTimeout(() => {
			visible = false;
		}, 1500);
	}

	function outroend() {
		if (queued) {
			queued = false;
			show();
		}
	}
</script>

{#if visible}
	<div
		class="toast"
		in:fly={{ duration: 100, x: 100 }}
		out:fade={{ duration: 100 }}
		on:introend={introend}
		on:outroend={outroend}
	>
		Copied
	</div>
{/if}

<style>
	.toast {
		background-color: black;
		border-radius: 0.25em;
		color: white;
		font: normal 1rem/1 var(--font-mono);
		padding: 0.75em;
		position: absolute;
		right: 0.5rem;
		top: 0.5rem;
	}
</style>
