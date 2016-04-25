import Binder from './binder.js'

/**
 * Text Binder
 * Binds resolved data to element contents via HTML innerText
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class TextBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'text';
		this.accepts = [];
	}

	/**
	 * bind()
	 * Bind the resolved data to the node replacing contents
	 * @param object oldValue The old value of the observed object
	 */
	bind(oldValue, path) {
		this.node.innerText = String(typeof this.resolver.resolved === 'symbol' ? Symbol(this.resolver.resolved) : this.resolver.resolved);
	}
}
