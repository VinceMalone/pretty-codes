import cssPackage from './css/package.json';
import diffPackage from './diff/package.json';
import htmlPackage from './html/package.json';
import javaPackage from './java/package.json';
import javascriptPackage from './javascript/package.json';
import markdownPackage from './markdown/package.json';
import pythonPackage from './python/package.json';
import rustPackage from './rust/package.json';
import sqlPackage from './sql/package.json';
import sveltePackage from './svelte/package.json';
import swiftPackage from './swift/package.json';
import typescriptPackage from './typescript/package.json';

export const languages = [
	cssPackage,
	diffPackage,
	htmlPackage,
	javaPackage,
	javascriptPackage,
	markdownPackage,
	pythonPackage,
	rustPackage,
	sqlPackage,
	sveltePackage,
	swiftPackage,
	typescriptPackage
]
	.flatMap(({ contributes, name }) =>
		contributes.languages.map((language) => ({
			grammars: contributes.grammars.map((grammar) => ({
				...grammar,
				path: new URL(`./${name}/${grammar.path.slice(2)}`, import.meta.url).href
			})),
			language: {
				...language,
				configuration: new URL(`./${name}/${language.configuration?.slice(2)}`, import.meta.url)
					.href
			},
			id: language.id
		}))
	)
	.sort((a, b) => a.id.localeCompare(b.id));
