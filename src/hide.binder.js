import Binder from './binder.js'

/**
 * Hide Binder
 * Hides element if data resolved to true
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class HideBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'hide';
		this.accepts = [];
	}

	/**
	 * bind()
	 * Bind the resolved data by showing or hiding node
	 * @param object oldValue The old value of the observed object
	 */
	bind() {
		if (!!this.resolver.resolved) this.node.style.display = 'none';
		else this.node.style.display = '';
	}
}
