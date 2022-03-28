<script lang="ts">
	import * as monaco from 'monaco-editor';
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
	import { onMount } from 'svelte';

	export let initialValue: string;
	export let language: string;

	let instance: monaco.editor.IStandaloneCodeEditor;
	export function getInstance() {
		return instance;
	}

	let editorEl: HTMLDivElement;

	onMount(() => {
		// @ts-ignore
		self.MonacoEnvironment = {
			getWorker(_, label) {
				if (label === 'json') {
					return new jsonWorker();
				}
				if (label === 'css' || label === 'scss' || label === 'less') {
					return new cssWorker();
				}
				if (label === 'html' || label === 'handlebars' || label === 'razor') {
					return new htmlWorker();
				}
				if (label === 'typescript' || label === 'javascript') {
					return new tsWorker();
				}
				return new editorWorker();
			}
		};

		instance = monaco.editor.create(editorEl, {
			value: initialValue,
			language,
			minimap: { enabled: false },
			lineNumbers: 'off',
			lineHeight: 1.15,
			fontFamily: 'Roboto Mono',
			fontSize: 13.3333333333 // 10pt (10 / 72 * 96)
		});

		return () => {
			instance.dispose();
		};
	});
</script>

<div bind:this={editorEl} class="editor" />

<style>
	.editor {
		height: 100%;
	}
</style>
