import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { createOnigScanner, createOnigString, loadWASM } from 'vscode-oniguruma';
import oniguruma from 'vscode-oniguruma/release/onig.wasm?url';

import VsCodeLightTheme from '../../vs-light-plus-theme';
import { parse } from './configuration';
import type { ScopeName, TextMateGrammar, ScopeNameInfo } from './providers';
import { SimpleLanguageInfoProvider } from './providers';
import type { LanguageId } from './register';
import { registerLanguages } from './register';

interface DemoScopeNameInfo extends ScopeNameInfo {
	path: string;
}

export interface Grammars {
	[scopeName: ScopeName]: DemoScopeNameInfo;
}

export type Languages = monaco.languages.ILanguageExtensionPoint[];

export async function createEditor(
	editorEl: HTMLElement,
	languages: Languages,
	grammars: Grammars,
	options?: monaco.editor.IStandaloneEditorConstructionOptions
) {
	const languageMap = new Map(languages.map((language) => [language.id, language]));

	async function fetchGrammar(scopeName: ScopeName): Promise<TextMateGrammar> {
		const { path } = grammars[scopeName];
		const response = await fetch(path);
		const grammar = await response.text();
		const type = path.endsWith('.json') ? 'json' : 'plist';
		return { type, grammar };
	}

	async function fetchConfiguration(
		language: LanguageId
	): Promise<monaco.languages.LanguageConfiguration> {
		const extensionPoint = languageMap.get(language);
		const response = await fetch(extensionPoint.configuration.path);
		const rawConfiguration = await response.text();
		return parse(rawConfiguration);
	}

	loadWASM(await loadVSCodeOnigurumWASM());

	const onigLib = Promise.resolve({
		createOnigScanner,
		createOnigString
	});

	const provider = new SimpleLanguageInfoProvider({
		grammars,
		fetchGrammar,
		configurations: languages.map((language) => language.id),
		fetchConfiguration,
		theme: VsCodeLightTheme,
		onigLib,
		monaco
	});

	registerLanguages(languages, (language) => provider.fetchLanguageInfo(language), monaco);

	const editor = monaco.editor.create(editorEl, options);

	provider.injectCSS();

	return editor;
}

// Taken from https://github.com/microsoft/vscode/blob/829230a5a83768a3494ebbc61144e7cde9105c73/src/vs/workbench/services/textMate/browser/textMateService.ts#L33-L40
export async function loadVSCodeOnigurumWASM(): Promise<Response | ArrayBuffer> {
	const response = await fetch(oniguruma);
	const contentType = response.headers.get('content-type');
	if (contentType === 'application/wasm') {
		return response;
	}

	// Using the response directly only works if the server sets the MIME type 'application/wasm'.
	// Otherwise, a TypeError is thrown when using the streaming compiler.
	// We therefore use the non-streaming compiler :(.
	return await response.arrayBuffer();
}
