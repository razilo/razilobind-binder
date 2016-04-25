import Binder from './binder.js'

/**
 * Style Binder
 * Alters elements style based on resolved data contents
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class StyleBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'style';
		this.accepts = ['property', 'phantom', 'object', 'method'];
	}

	/**
	 * bind()
	 * Bind the resolved data by applying styles to node
	 * @param object oldValue The old value of the observed object
	 */
	bind(oldValue) {
		if (typeof this.resolver.resolved !== 'object') return;

		// set new values
		for (var key in this.resolver.resolved)
		{
			if (typeof key !== 'string' || typeof this.resolver.resolved[key] !== 'string') continue;
			this.node.style[key] = this.resolver.resolved[key];
		}

		// remove any old values not set by new ones
		for (var key2 in oldValue)
		{
			if (typeof this.resolver.resolved[key2] !== 'undefined') continue;
			this.node.style[key2] = '';
		}
	}
}
