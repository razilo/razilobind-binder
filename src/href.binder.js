import Binder from './binder.js'

/**
 * Href Binder
 * Alters href attribute based on resolved data contents
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class HrefBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'href';
		this.accepts = ['property', 'phantom', 'object', 'string', 'method'];
	}

	/**
	 * bind()
	 * Bind the resolved data by applying styles to node
	 * @param object oldValue The old value of the observed object
	 */
	bind() {
		// this.resolver.resolved
		if (typeof this.resolver.resolved !== 'string' || this.resolver.resolved.length < 1) this.node.removeAttribute('href');
		else this.node.setAttribute('href', this.resolver.resolved);
	}
}
