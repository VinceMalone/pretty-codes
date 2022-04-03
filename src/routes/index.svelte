<script lang="ts">
	import type * as monaco from 'monaco-editor';
	import { onMount } from 'svelte';
	import Editor from '../components/Editor.svelte';

	let editor: { getInstance(): Promise<monaco.editor.IStandaloneCodeEditor> };

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

	onMount(async () => {
		const instance = await editor.getInstance();
		instance.focus();
		instance.onDidChangeModelContent(() => {
			codeStorage.set(instance.getValue());
		});
	});

	async function handleCopy() {
		const instance = await editor.getInstance();
		const selection = instance.getSelection();

		const viewState = instance.saveViewState();
		instance.focus();

		// if nothing is selected, select everything
		if (
			selection.selectionStartLineNumber === selection.positionLineNumber &&
			selection.selectionStartColumn === selection.positionColumn
		) {
			const range = instance.getModel().getFullModelRange();
			instance.setSelection(range);
		}

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

		console.log('text\n', text);
		console.log('html\n', html);

		await navigator.clipboard.write([
			new ClipboardItem({
				'text/plain': new Blob([text], { type: 'text/plain' }),
				'text/html': new Blob([html], { type: 'text/html' })
			})
		]);
	}

	function modifyHtml(html) {
		const root = document.createElement('div');
		root.innerHTML = html;

		// 1. remove redundant meta element
		root.querySelector('meta').remove();

		// 2. set expected font styles that should have come from monaco
		const container = root.firstElementChild as HTMLElement;
		container.style.setProperty('line-height', '1.15');
		container.style.setProperty('font-size', '13.33333333px'); // 10pt (10 / 72 * 96)

		// 3. replace spaces with 'no-break space', so docs doesn't collapse
		//    leading white-space
		const nodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_TEXT);
		let currentNode: Node;
		while ((currentNode = nodeIterator.nextNode())) {
			currentNode.nodeValue = currentNode.nodeValue.replaceAll(/ /g, '\u00A0');
		}

		html = root.innerHTML;

		// html = `<table style="background-color: rgb(243, 243, 243); padding: 16px; width: 100%;"><tr><td>${html}</td></tr></table>`;

		return html;
	}
</script>

<div class="container">
	<Editor bind:this={editor} initialValue={codeStorage.get() ?? ''} on:copy={handleCopy} />
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
</style>
