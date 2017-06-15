import Binder from './binder.js'

/**
 * Disabled Binder
 * Alters disabled attribute based on resolved data contents
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class DisabledBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'disabled';
		this.accepts = ['property', 'phantom', 'object', 'string', 'method'];
	}

	/**
	 * bind()
	 * Bind the resolved data by applying styles to node
	 * @param object oldValue The old value of the observed object
	 */
	bind() {
		if (!!this.resolver.resolved) this.node.setAttribute('disabled', '');
		else this.node.removeAttribute('disabled');
	}
}
