import type * as monaco from 'monaco-editor';

/**
 * Fields that, if present in a LanguageConfiguration, must be a RegExp object
 * rather than a string literal.
 */
const REGEXP_PROPERTIES = [
	// indentation
	'indentationRules.decreaseIndentPattern',
	'indentationRules.increaseIndentPattern',
	'indentationRules.indentNextLinePattern',
	'indentationRules.unIndentedLinePattern',

	// code folding
	'folding.markers.start',
	'folding.markers.end',

	// language's "word definition"
	'wordPattern',

	// on enter actions
	// https://github.com/bolinfest/monaco-tm/issues/12
	'onEnterRules.0.beforeText',
	'onEnterRules.0.afterText',
	'onEnterRules.1.beforeText',
	'onEnterRules.1.afterText',
	'onEnterRules.2.beforeText',
	'onEnterRules.2.afterText',
	'onEnterRules.3.beforeText',
	'onEnterRules.3.afterText',
	'onEnterRules.4.beforeText',
	'onEnterRules.4.afterText',
	'onEnterRules.5.beforeText',
	'onEnterRules.5.afterText',
	'onEnterRules.6.beforeText',
	'onEnterRules.6.afterText',
	'onEnterRules.7.beforeText',
	'onEnterRules.7.afterText',
	'onEnterRules.8.beforeText',
	'onEnterRules.8.afterText',
	'onEnterRules.9.beforeText',
	'onEnterRules.9.afterText',
	'onEnterRules.10.beforeText',
	'onEnterRules.10.afterText'
];

/**
 * Configuration data is read from JSON and JSONC files, which cannot contain
 * regular expression literals. Although Monarch grammars will often accept
 * either the source of a RegExp as a string OR a RegExp object, certain Monaco
 * APIs accept only a RegExp object, so we must "rehydrate" those, as appropriate.
 *
 * It would probably save everyone a lot of trouble if we updated the APIs to
 * accept a RegExp or a string literal. Possibly a small struct if flags need
 * to be specified to the RegExp constructor.
 */
export function rehydrateRegexps(rawConfiguration: string): monaco.languages.LanguageConfiguration {
	const out = JSON.parse(rawConfiguration);
	for (const property of REGEXP_PROPERTIES) {
		const value = getProp(out, property);
		if (typeof value === 'string') {
			setProp(out, property, new RegExp(value));
		} else if (typeof value?.pattern === 'string') {
			setProp(out, property, new RegExp(value.pattern, value.flags));
		}
	}
	return out;
}

function getProp(obj: { string: any }, selector: string): any {
	const components = selector.split('.');
	return components.reduce((acc, cur) => (acc != null ? acc[cur] : null), obj);
}

function setProp(obj: { string: any }, selector: string, value: RegExp): void {
	const components = selector.split('.');
	const indexToSet = components.length - 1;
	components.reduce((acc, cur, index) => {
		if (acc == null) {
			return acc;
		}

		if (index === indexToSet) {
			acc[cur] = value;
			return null;
		} else {
			return acc[cur];
		}
	}, obj);
}
