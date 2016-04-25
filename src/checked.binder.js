import Binder from './binder.js'

/**
 * Checked Binder
 * Binds resolved data to value attribute of elements such as input, textarea, select etc...
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class CheckedBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'checked';
		this.accepts = ['property', 'phantom', 'method'];
		this.event;
		this.type;
	}

	/**
	 * bind()
	 * Bind the resolved data to the node replacing contents
	 * @param object oldValue The old value of the observed object
	 */
	bind(oldValue, path) {
		// catch duplicate fires from ui
		if (this.node.value === this.resolver.resolved) return;

		// set value
		this.type = this.node.getAttribute('type');
		this.setValue();

		// should we watch for changes?
		if (!!this.event || this.resolver.observers.length < 1) return;

		// add event listener to node
		this.event = 'change';
		this.node.addEventListener(this.event, this.listener.bind(this), false);
	}

	/**
	 * listener()
	 * Update model when an element interaction updates its value
	 * @param event event The event that triggers the update
	 */
	listener(event) {
		// last observer is the full observed path to resolver (others before can make up sub properties)
		var path = this.resolver.observers[this.resolver.observers.length -1].split('.');
		let end = path.pop();

		// get parent object/array
		var model = this.model;
		for (var i = 0; i < path.length; i++) model = model[path[i]];

		// change model
		if (this.node.hasAttribute('type') && this.type == 'radio') model[end] = this.node.value;
		else model[end] = !!this.node.checked ? true : false;
	}

	/**
	 * setValue()
	 * Set a node value and attribute to ensure changes can be picked up by attribute watchers
	 */
	setValue() {
		if (this.node.hasAttribute('type') && this.type == 'radio')
		{
			// radio
			this.node.checked = this.node.value == this.resolver.resolved ? true : false;
			if (this.node.value == this.resolver.resolved) this.node.setAttribute('checked', '');
			else this.node.removeAttribute('checked');
		}
		else
		{
			// checkbox and others...
			this.node.checked = !!this.resolver.resolved ? true : false;
			if (!!this.resolver.resolved) this.node.setAttribute('checked', '');
			else this.node.removeAttribute('checked');
		}
	}
}
