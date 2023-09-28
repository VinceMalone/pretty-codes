<script lang="ts">
	import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import { createEventDispatcher, onMount } from 'svelte';

	import { createEditor, type Grammars } from './editor';

	// import specific monaco features we want
	// TODO: audit other wanted features (node_modules/monaco-editor/esm/metadata.js)
	import 'monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu';
	import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess';

	type Grammar = Grammars[0] & { scopeName: string };

	interface LanguagePackage {
		grammars: Grammar[];
		language: monaco.languages.ILanguageExtensionPoint & { configuration: string };
		id: string;
	}

	const dispatch = createEventDispatcher();

	let editor: monaco.editor.IStandaloneCodeEditor;

	$: if (editor) {
		monaco.editor.setModelLanguage(editor.getModel(), language);
	}

	let setEditor: (_: typeof editor) => void;
	const editorPromise = new Promise<typeof editor>((resolve) => (setEditor = resolve));
	export function getInstance() {
		return editorPromise;
	}

	export let initialValue: string;
	export let language: string;
	export let languages: LanguagePackage[];

	let editorEl: HTMLDivElement;

	onMount(async () => {
		// @ts-ignore
		self.MonacoEnvironment = {
			getWorker() {
				return new EditorWorker();
			}
		};

		const extensionPoints: monaco.languages.ILanguageExtensionPoint[] = [];
		const grammars: Grammars = {};

		for (const l of languages) {
			extensionPoints.push({
				...l.language,
				configuration: monaco.Uri.parse(l.language.configuration)
			});

			for (const grammar of l.grammars) {
				grammars[grammar.scopeName] = grammar;
			}
		}

		editor = await createEditor(editorEl, extensionPoints, grammars, {
			value: initialValue,
			language,
			automaticLayout: true,
			minimap: { enabled: false },
			formatOnPaste: true,
			renderWhitespace: 'all',
			renderLineHighlight: 'none',
			wordWrapColumn: 80,
			wordWrap: 'off', // wordWrapColumn
			lineNumbers: 'on', // off
			rulers: [80],
			tabSize: 2,
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

		await document.fonts.ready;
		monaco.editor.remeasureFonts();

		setEditor(editor);

		return () => {
			editor.dispose();
			copy.dispose();
		};
	});
</script>

<div bind:this={editorEl} class="editor" />

<style>
	.editor {
		height: 100%;
	}
</style>
