import Binder from './binder.js'

/**
 * Required Binder
 * Alters required attribute based on resolved data contents
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class RequiredBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'required';
		this.accepts = ['property', 'phantom', 'object', 'string', 'method'];
	}

	/**
	 * bind()
	 * Bind the resolved data by applying styles to node
	 * @param object oldValue The old value of the observed object
	 */
	bind() {
		if (!!this.resolver.resolved) this.node.setAttribute('required', '');
		else this.node.removeAttribute('required');
	}
}
