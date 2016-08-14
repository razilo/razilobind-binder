import Binder from './binder.js'

/**
 * Model Binder
 * Binds resolved data to model attribute of elements and model property of elements, if object, attribute will switch to changing description
 * to allow attribute change to be picked up by custom elements. Used primary to put data into a custom element
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class ModelBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'model';
		this.accepts = ['property', 'phantom', 'method'];
	}

	/**
	 * bind()
	 * Bind the resolved data to the node replacing contents
	 * @param object oldValue The old value of the observed object
	 */
	bind(oldValue, path) {
		// set value
		this.node.setAttribute('model', typeof this.resolver.resolved === 'object' ? '[object]@' + new Date().getTime() : this.resolver.resolved);
		this.node.model = this.resolver.resolved;
	}
}
