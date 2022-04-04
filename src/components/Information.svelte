<script lang="ts">
	import Button from './Button.svelte';

	let dialog: HTMLDialogElement;

	function show() {
		dialog.showModal();
	}

	function hide() {
		dialog.close();
	}
</script>

<Button on:click={show}>information</Button>

<dialog bind:this={dialog}>
	<h1>Information</h1>
	<p>
		This tool can be used to copy code snippets as rich text (HTML) to be pasted into Google Docs or
		Google Slides without needing to spend more time formatting the text after pasting.
	</p>
	<p>⚠️ <em>Currently only support JavaScript.</em></p>
	<h2>Features</h2>
	<ul>
		<li>
			Highlights code with a <var>light</var> theme so that it is visible with the default white background
			that Google Docs uses
		</li>
		<li>Sets font to <var>"Roboto Mono"</var></li>
		<li>Sets font-size to <var>10pt</var></li>
		<li>Sets line-spacing to <var>1.15</var></li>
		<li>
			Prevents Google products from stripping a single indentation character from lines that have
			multiple leading white-spaces characters
		</li>
	</ul>
	<h2>Instructions</h2>
	<ol>
		<li>Paste code snippet into editor or use editor to write a code snippet from scratch</li>
		<li>
			Copy contents (no need to <em>select all</em> first) by clicking the "copy" button or pressing
			<kbd>⌘C</kbd>
			or <kbd>⌘S</kbd>
		</li>
		<li>Paste with formatting (usually <kbd>⌘V</kbd>) into Google Docs or Google Slides</li>
	</ol>
	<h3>Debug</h3>
	<p>
		You can view the raw (text and HTML) contents of your clipboard, in your browser's developer
		console, by focusing the "debug" control and pasting (<kbd>⌘V</kbd>).
	</p>
	<footer>
		<Button on:click={hide}>Close</Button>
	</footer>
</dialog>

<style>
	dialog {
		border: none;
		border-radius: 0.75rem;
		box-shadow: rgb(0 0 0 / 20%) 0px 11px 15px -7px, rgb(0 0 0 / 14%) 0px 24px 38px 3px,
			rgb(0 0 0 / 12%) 0px 9px 46px 8px;
		font-family: -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif;
		line-height: 1.5;
		max-width: 80ch;
		padding: 1rem 2rem 2rem;
	}

	footer {
		display: flex;
		justify-content: flex-end;
		margin-top: 2rem;
	}

	kbd {
		display: inline-block;
		padding: 3px 5px;
		font: 14px ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
		line-height: 12px;
		color: #24292f;
		vertical-align: middle;
		background-color: #f6f8fa;
		border: 1px solid rgba(175, 184, 193, 0.2);
		border-bottom-color: rgba(175, 184, 193, 0.2);
		border-radius: 6px;
		box-shadow: inset 0 -1px 0 rgba(175, 184, 193, 0.2);
	}
</style>
