import Binder from './binder.js'

/**
 * Class Binder
 * Alters elements style based on resolved data contents
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class ClassBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'class';
		this.accepts = ['property', 'phantom', 'object', 'array', 'string', 'method'];
		this.classnames = [];
	}

	/**
	 * bind()
	 * Bind the resolved data by applying styles to node
	 * @param object oldValue The old value of the observed object
	 */
	bind() {
		var classnames = [];

		// add new classes if not already added
		var names = typeof this.resolver.resolved === 'string' ? [this.resolver.resolved.trim()] : this.resolver.resolved;
		for (var a in names)
		{
			var classname = isNaN(a) ? a.trim() : names[a].trim();
			if (typeof a === 'string' && !names[a]) continue; // skip falsy objects
			classnames.push(classname); // add already present to stack
			if (new RegExp('([^a-z0-9_-]{1}|^)' + classname + '([^a-z0-9_-]{1}|$)').test(this.node.className)) continue; // skip already present

			this.node.className += ' ' + classname + ' ';
			classnames.push(classname);
		}

		// remove any that where there previosly but now not in stack
		if (this.classnames.length > 0)
		{
			// remove any classes not in
			for (var i = 0; i < this.classnames.length; i++)
			{
				if (classnames.indexOf(this.classnames[i]) >= 0) continue;
				this.node.className = this.node.className.replace(new RegExp('([^a-z0-9_-]{1}|^)' + this.classnames[i] + '([^a-z0-9_-]{1}|$)', 'g'), ' ');

			}
		}

		// update node and cache stack
		this.node.className = this.node.className.replace(/\s{1}\s{1}/g, ' ');
		this.classnames = classnames;
	}
}
