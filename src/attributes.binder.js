import Binder from './binder.js'

/**
 * Attributes Binder
 * Alters elements attributes based on resolved data contents
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class AttributesBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'attributes';
		this.accepts = ['property', 'phantom', 'object', 'array', 'string', 'method'];
		this.attributes = {};
	}

	/**
	 * bind()
	 * Bind the resolved data by applying styles to node
	 * @param object oldValue The old value of the observed object
	 */
	bind() {
		// add new and update existing attributes
		var attributes = {};
		var atts = typeof this.resolver.resolved === 'string' ? [this.resolver.resolved.trim()] : this.resolver.resolved;
		for (var a in atts)
		{
			let attr = isNaN(a) ? a.trim() : atts[a].trim();
			let val = isNaN(a) ? atts[a] : true;
			attributes[attr] = val;

			if (typeof val === 'boolean') {
				if (!!val) this.node.setAttribute(attr, '');
				else this.node.removeAttribute(attr, '');
			}
			else this.node.setAttribute(attr, val);
		}

		// remove any attributes that have gone
		for (var b in this.attributes) {
			if (!!attributes[b]) continue;
			this.node.removeAttribute(b);
		}

		// update cache
		this.attributes = attributes;
	}
}
