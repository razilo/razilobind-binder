import Binder from './binder.js'

/**
 * Show Binder
 * Shows element if data resolved to true
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class ShowBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'show';
		this.accepts = [];
	}

	/**
	 * bind()
	 * Bind the resolved data by showing hiding the node
	 * @param object oldValue The old value of the observed object
	 */
	bind() {
		if (!!this.resolver.resolved) this.node.style.display = '';
		else this.node.style.display = 'none';
	}
}
