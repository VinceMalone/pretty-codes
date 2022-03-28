<script lang="ts">
	import type * as monaco from 'monaco-editor';
	import { onMount } from 'svelte';
	import Editor from '../components/Editor.svelte';

	let editor: { getInstance(): monaco.editor.IStandaloneCodeEditor };

	const codeStorage = (() => {
		const KEY = 'code';

		return {
			get() {
				try {
					return JSON.parse(localStorage.getItem(KEY));
				} catch (error) {
					console.error(`couldn't parse code from storage`, error);
				}
			},
			set(value) {
				try {
					localStorage.setItem(KEY, JSON.stringify(value));
				} catch (error) {
					console.error(`couldn't save code to storage`, error);
				}
			}
		};
	})();

	onMount(() => {
		editor.getInstance().onDidChangeModelContent(() => {
			codeStorage.set(editor.getInstance().getValue());
		});
	});

	function handlePaste(event: ClipboardEvent) {
		console.log('text\n', event.clipboardData.getData('text/plain'));
		console.log('html\n', event.clipboardData.getData('text/html'));
	}

	async function handleCopy() {
		const instance = editor.getInstance();
		const viewState = instance.saveViewState();
		const range = instance.getModel().getFullModelRange();
		instance.focus();
		instance.setSelection(range);
		document.execCommand('copy'); // 🔥
		instance.restoreViewState(viewState);

		let text = '';
		let html = '';

		const items = await navigator.clipboard.read();

		for (const item of items) {
			for (const type of item.types) {
				if (type === 'text/plain') {
					text = await (await item.getType(type)).text();
				}
				if (type === 'text/html') {
					html = await (await item.getType(type)).text();
				}
			}
		}

		html = modifyHtml(html);

		console.log(text);
		console.log(html);

		await navigator.clipboard.write([
			new ClipboardItem({
				'text/plain': new Blob([text], { type: 'text/plain' }),
				'text/html': new Blob([html], { type: 'text/html' })
			})
		]);
	}

	function modifyHtml(html) {
		html = html
			// remove redundant `<meta charset="utf-8">` tag (on chrome)
			.replace(/^<meta.*?>/, '')
			// fix leading space collapsing in google docs
			.replaceAll(/ /g, '&nbsp;');

		// html = `<table style="background-color: rgb(243, 243, 243); padding: 16px; width: 100%;"><tr><td>${html}</td></tr></table>`;

		return html;
	}
</script>

<div class="container">
	<Editor bind:this={editor} initialValue={codeStorage.get() ?? ''} language="javascript" />
	<aside>
		<button on:click={handleCopy}>copy</button>
		<textarea
			on:paste={handlePaste}
			class="paste"
			placeholder="paste here and look at console"
			rows="10"
		/>
	</aside>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
	}

	.container {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr max-content;
		height: 100vh;
		padding: 1rem;
	}

	aside {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.paste {
		display: block;
		resize: none;
		width: 100%;
	}
</style>
