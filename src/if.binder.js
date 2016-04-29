import Binder from './binder.js'

/**
 * If Binder
 * Alters elements style based on resolved data contents
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class IfBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'if';
		this.accepts = ['property', 'phantom', 'boolean', 'method'];
		this.placeholder = null;
	}

	/**
	 * bind()
	 * Bind the resolved data by applying styles to node
	 * @param object oldValue The old value of the observed object
	 */
	bind() {
		if (!this.resolver.resolved)
		{
			// insert placeholder
			this.placeholder = document.createComment('razilobind:if');
			this.node.parentNode.insertBefore(this.placeholder, this.node);
			this.node.parentNode.removeChild(this.node);
		}
		else if (this.placeholder)
		{
			this.placeholder.parentNode.insertBefore(this.node, this.placeholder);
			this.placeholder.parentNode.removeChild(this.placeholder);
			this.placeholder = null;
		}
	}
}
