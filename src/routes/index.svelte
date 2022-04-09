<script lang="ts">
	import type * as monaco from 'monaco-editor';
	import { onMount } from 'svelte';

	import Button from '../components/Button.svelte';
	import CopyToast from '../components/CopyToast.svelte';
	import Debug from '../components/Debug.svelte';
	import Editor from '../components/Editor.svelte';
	import Information from '../components/Information.svelte';
	import Select from '../components/Select.svelte';
	import { languages } from '../languages';
	import { Storage } from '../Storage';

	const codeStorage = new Storage('code');
	const languageStorage = new Storage('language');

	let editor: { getInstance(): Promise<monaco.editor.IStandaloneCodeEditor> };
	let copyToast: { show(): void };
	let language = languageStorage.get() ?? 'typescriptreact';

	$: languageStorage.set(language);

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

		copyToast.show();
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
	<header>
		<h1><span style="color: #001080">pretty</span>.<span style="color: #6d5522">codes</span></h1>
		<Information />
		<Button on:click={handleCopy}>copy</Button>
		<label for="language">
			language: <Select id="language" bind:value={language}>
				{#each languages as language}
					<option>{language.id}</option>
				{/each}
			</Select>
		</label>
		<Debug />
	</header>
	<div class="editor">
		<Editor
			bind:this={editor}
			on:copy={handleCopy}
			initialValue={codeStorage.get() ?? ''}
			{language}
			{languages}
		/>
		<CopyToast bind:this={copyToast} />
	</div>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(html) {
		--border-color: rgba(0, 0, 0, 0.12);
		--text-color: black;
		--font-mono: 'Roboto Mono';
	}

	:global(html, body) {
		height: 100%;
		margin: 0;
	}

	.container {
		display: grid;
		gap: 1rem;
		grid-template: auto 1fr / 1fr;
		height: 100%;
		padding: 1rem;
	}

	.editor {
		height: 100%;
		position: relative;
	}

	header {
		align-items: center;
		display: flex;
		gap: 0.75rem;
	}

	h1 {
		margin: 0;
		flex: 1;
		font: normal 1.125rem/1 'Roboto Mono';
		white-space: nowrap;
	}

	label {
		color: black;
		font: normal 1rem/1 var(--font-mono);
	}
</style>
