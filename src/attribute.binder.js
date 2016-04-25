import Binder from './binder.js'

/**
 * Attribute Binder
 * Alters elements attributes based on resolved data contents
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class AttributeBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'attribute';
		this.accepts = ['property', 'phantom', 'object', 'array', 'string', 'method'];
		this.attributes = [];
	}

	/**
	 * bind()
	 * Bind the resolved data by applying styles to node
	 * @param object oldValue The old value of the observed object
	 */
	bind() {
		var attributes = [];

		// add new classes if not already added
		var atts = typeof this.resolver.resolved === 'string' ? [this.resolver.resolved.trim()] : this.resolver.resolved;
		for (var a in atts)
		{
			var attribute = isNaN(a) ? a.trim() : atts[a].trim();
			if (typeof a === 'string' && typeof atts[a] === 'boolean' && !atts[a]) continue; // skip boolean falsy objects
			attributes.push(attribute); // add already present to stack
			if (this.node.hasAttribute(attribute)) continue; // skip already present

			this.node.setAttribute(attribute, isNaN(a) ? (typeof atts[a] === 'boolean' ? '' : atts[a]) : '');
			attributes.push(attribute);
		}

		// remove any that where there previosly but now not in stack
		if (this.attributes.length > 0)
		{
			// remove any classes not in
			for (var i = 0; i < this.attributes.length; i++)
			{
				if (attributes.indexOf(this.attributes[i]) >= 0) continue;
				this.node.removeAttribute(this.attributes[i]);
			}
		}

		// update node and cache stack
		this.attributes = attributes;
	}
}
