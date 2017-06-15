import Binder from './binder.js'

/**
 * Selected Binder
 * Alters selected attribute based on resolved data contents
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class SelectedBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'selected';
		this.accepts = ['property', 'phantom', 'object', 'string', 'method'];
	}

	/**
	 * bind()
	 * Bind the resolved data by applying styles to node
	 * @param object oldValue The old value of the observed object
	 */
	bind() {
		if (typeof this.resolver.resolved === 'string' && this.resolver.resolved.length > 0) this.node.setAttribute('selected', this.resolver.resolved);
		else if (typeof this.resolver.resolved === 'object' && this.resolver.resolved != null)
		{
			this.node.setAttribute('selected', '[object]@' + new Date().getTime());
			this.node.selected = this.resolver.resolved;
		}
		else if (!!this.resolver.resolved) this.node.setAttribute('selected', '');
		else this.node.removeAttribute('selected');
	}
}
