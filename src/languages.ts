import cssPackage from '../static/languages/css/package.json';
import diffPackage from '../static/languages/diff/package.json';
import htmlPackage from '../static/languages/html/package.json';
import javaPackage from '../static/languages/java/package.json';
import javascriptPackage from '../static/languages/javascript/package.json';
import markdownPackage from '../static/languages/markdown/package.json';
import pythonPackage from '../static/languages/python/package.json';
import rustPackage from '../static/languages/rust/package.json';
import swiftPackage from '../static/languages/swift/package.json';
import typescriptPackage from '../static/languages/typescript/package.json';

export const languages = [
	cssPackage,
	diffPackage,
	htmlPackage,
	javaPackage,
	javascriptPackage,
	markdownPackage,
	pythonPackage,
	rustPackage,
	swiftPackage,
	typescriptPackage
]
	.flatMap(({ contributes, name }) =>
		contributes.languages.map((language) => ({
			grammars: contributes.grammars.map((grammar) => ({
				...grammar,
				path: `/languages/${name}/${grammar.path}`
			})),
			language: {
				...language,
				configuration: `/languages/${name}/${language.configuration}`
			},
			id: language.id
		}))
	)
	.sort((a, b) => a.id.localeCompare(b.id));
