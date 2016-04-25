import Binder from './binder.js'

/**
 * HTML Binder
 * Binds resolved data to element contents (innerHTML)
 * !!! USE WITH CAUTION ONLY BIND TRUSTED HTML !!!
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class HtmlBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'html';
		this.accepts = ['string', 'property', 'phantom', 'method'];
	}

	/**
	 * bind()
	 * Bind the resolved data to the node replacing contents
	 * @param object oldValue The old value of the observed object
	 */
	bind() {
		this.node.innerHTML = this.resolver.resolved;
	}
}
