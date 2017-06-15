import Binder from './binder.js'

/**
 * Change Binder
 * Bind methods to element events
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class ChangeBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'change';
		this.delayMethod = true;
		this.accepts = ['method'];
		this.event;
	}

	/**
	 * bind()
	 * Bind the resolved data by applying styles to node
	 * @param object oldValue The old value of the observed object
	 */
	bind(object) {
		if (typeof this.resolver.resolved.method !== 'function') return;

		if (!this.event) {
			this.event = 'change';
			this.node.addEventListener('change', this.listener.bind(this), false);
		}
	}

	/**
	 * listener()
	 * Catch events on nodes and run functions set.
	 * @param event event The event that triggers the update
	 */
	listener(event) {
		event.stopPropagation();
		let values = [event].concat(this.resolver.resolved.values);
		this.resolver.resolved.method.apply(this.model, values);
	}
}
