<script lang="ts">
	import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import { createEventDispatcher, onMount } from 'svelte';

	import { createEditor, type Grammars } from './editor';

	// import specific monaco features we want
	import 'monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu';
	import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess';

	const dispatch = createEventDispatcher();

	let editor: monaco.editor.IStandaloneCodeEditor;

	let setEditor: (_: typeof editor) => void;
	const editorPromise = new Promise<typeof editor>((resolve) => (setEditor = resolve));
	export function getInstance() {
		return editorPromise;
	}

	export let initialValue: string;

	let editorEl: HTMLDivElement;

	onMount(async () => {
		// @ts-ignore
		self.MonacoEnvironment = {
			getWorker() {
				return new EditorWorker();
			}
		};

		const languages: monaco.languages.ILanguageExtensionPoint[] = [
			{
				id: 'javascript',
				extensions: ['.js', '.jsx', '.mjs', '.cjs'],
				aliases: ['JavaScript', 'javascript', 'javascriptreact', 'js']
			}
		];

		const grammars: Grammars = {
			'source.js.jsx': {
				language: 'javascript',
				path: 'JavaScriptReact.tmLanguage.json'
			}
		};

		editor = await createEditor(editorEl, languages, grammars, {
			value: initialValue,
			language: 'javascript',
			minimap: { enabled: false },
			formatOnPaste: true,
			renderWhitespace: 'all',
			renderLineHighlight: 'none',
			wordWrapColumn: 80,
			wordWrap: 'off', // wordWrapColumn
			lineNumbers: 'on', // off
			rulers: [80],
			fontFamily: 'Roboto Mono',
			fontSize: 14
		});

		const copy = editor.addAction({
			id: 'copy',
			label: 'Copy',
			keybindings: [
				monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
				monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC
			],
			run: () => dispatch('copy')
		});

		const paste = editor.onDidPaste(() => {
			// hack! need to wait until after the tokenizer has done its job and the
			// styles applied before copying
			setTimeout(() => dispatch('copy'), 100);
		});

		await document.fonts.ready;
		monaco.editor.remeasureFonts();

		setEditor(editor);

		return () => {
			editor.dispose();
			copy.dispose();
			paste.dispose();
		};
	});
</script>

<div bind:this={editorEl} class="editor" />

<style>
	.editor {
		height: 100%;
	}
</style>
