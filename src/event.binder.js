import Binder from './binder.js'

/**
 * Event Binder
 * Bind methods to element events
 *
 * Inherits
 *
 * properties: options, node, resolvable, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class EventBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'event';
		this.accepts = ['object'];
		this.events = {};
	}

	/**
	 * bind()
	 * Bind the resolved data by applying styles to node
	 * @param object oldValue The old value of the observed object
	 */
	bind(object) {
		// remove old events
		for (let name in this.events) {
			if (this.resolver.resolved[name]) continue;
			this.node.removeEventListener(name, this.listener, false);
			delete this.events[name];
		}

		// add new events
		for (let name in this.resolver.resolved)
		{
			if (!this.events[name])
			{
				if (typeof this.resolver.resolved[name].method !== 'function') continue;
				this.node.addEventListener(name, this.listener.bind(this), false);
			}
			this.events[name] = this.resolver.resolved[name];
		}
	}

	/**
	 * listener()
	 * Catch events on nodes and run functions set.
	 * @param event event The event that triggers the update
	 */
	listener(event) {
		let values = [event].concat(this.events[event.type].values);
		this.events[event.type].method.apply(this.model, values);
	}
}
