import Binder from './binder.js'

/**
 * Value Binder
 * Binds resolved data to value attribute of elements such as input, textarea, select etc...
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class ValueBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'value';
		this.accepts = ['property', 'phantom', 'method'];
		this.event;
		this.tag;
		this.type;
	}

	/**
	 * bind()
	 * Bind the resolved data to the node replacing contents
	 * @param object oldValue The old value of the observed object
	 */
	bind(oldValue, path) {
		// set value
		this.tag = this.node.tagName.toLowerCase();
		this.type = this.node.getAttribute('type');
		if (this.type != 'file')
		{
			if (this.tag === 'select') setTimeout(this.setValue.bind(this), 10);
			else this.setValue();
		}

		// should we watch for changes?
		if (!!this.event || this.resolver.observers.length < 1 || this.tag === 'option' || this.type == 'radio') return;

		// add event listener to node
		this.event = this.eventType();
		this.node.addEventListener(this.event, this.listener.bind(this), false);
	}

	/**
	 * listener()
	 * Update model when an element interaction updates its value
	 * @param event event The event that triggers the update
	 */
	listener(event) {
		event.stopPropagation();

		// last observer is the full observed path to resolver (others before can make up sub properties)
		var path = this.resolver.observers[this.resolver.observers.length -1].split('.');
		let end = path.pop();

		// get parent object/array
		var model = this.model;
		for (var i = 0; i < path.length; i++) model = model[path[i]];

		// change model
		if (this.tag === 'select' && this.node.hasAttribute('multiple'))
		{
			var selected = [];
			var opts = this.node.querySelectorAll('option');
			for (var i = 0; i < opts.length; i++) if (!!opts[i].selected) selected.push(opts[i].value);
			model[end] = selected;
		}
		else
		{
			model[end] = this.node.value;
			this.node.setAttribute('value', typeof this.node.value === 'object' ? '[object]@' + new Date().getTime() : this.node.value);
		}
	}

	/**
	 * setValue()
	 * Set a node value and attribute to ensure changes can be picked up by attribute watchers
	 */
	setValue() {
		if (this.tag === 'select' && this.node.hasAttribute('multiple') && Array.isArray(this.resolver.resolved))
		{
			var opts = this.node.querySelectorAll('option');
			for (var i = 0; i < opts.length; i++) {
				// do not indexOf to stop issues with mixed var type
				for (var ii = 0; ii < this.resolver.resolved.length; ii++) if (opts[i].value == this.resolver.resolved[ii]) opts[i].selected = true;
			}
		}
		else
		{
			this.node.setAttribute('value', typeof this.resolver.resolved === 'object' ? '[object]@' + new Date().getTime() : this.resolver.resolved);
			this.node.value = this.resolver.resolved;
		}
	}

	/**
	 * eventType()
	 * Get the type of event we want to listen on
	 */
	eventType() {
		let name = 'change';
		if (this.tag === 'input') name = 'input';

		return name;
	}
}
