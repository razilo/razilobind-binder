import {RaziloBindCoreDetector} from 'razilobind-core'

/**
 * Binder
 * Generic binder methods used accross all binders
 */
export default class Binder {
	constructor() {
		this.id = Math.random().toString(36).slice(2) + Date.now(); // create unique id for binder
		this.options = undefined;
		this.traverser = undefined;
		this.name = undefined;
		this.observables = [];
		this.accepts = [];
	}

	setup(options, traverser) {
		this.options = options;
		this.traverser = traverser;
	}

	/**
	 * detect()
	 * Basic detection of an element by its attribute, setting resolvable
	 * @param html-node node The node to detect any bindables on
	 * @return bool True on bindable, false on fail
	 */
	detect(node) {
		// allow element nodes only
		if (node.nodeType !== 1) return false;

		this.resolvable = node.hasAttribute(this.options.prefix + 'bind-' + this.name) ? node.getAttribute(this.options.prefix + 'bind-' + this.name) : undefined;
		this.configurable = node.hasAttribute(this.options.prefix + 'config-' + this.name) ? node.getAttribute(this.options.prefix + 'config-' + this.name) : undefined;
		this.alterable = node.hasAttribute(this.options.prefix + 'alter-' + this.name) ? node.getAttribute(this.options.prefix + 'alter-' + this.name) : undefined;

		if (!this.resolvable) return false;

		this.node = node;
		return true;
	}

	/**
	 * build()
	 * Build a bindable object and try to resolve data, if resolved creates initial bind too
	 * @param object model The model to attempt to build the binder against
	 * @return Binder The binder of specific type
	 */
	build(model) {
		// set bindable data
		this.priority = 1;
		this.resolver = RaziloBindCoreDetector.resolver(this.resolvable, this.node);
		this.alterer = RaziloBindCoreDetector.resolver(this.alterable, this.node);
		this.config = RaziloBindCoreDetector.resolver(this.configurable, this.node);
		this.model = model;

		// resolve data to actuals and observables if of correct type or no types set
		if (this.resolver && (this.accepts.length === 0 || this.accepts.indexOf(this.resolver.name) >= 0)) this.update();

		// collate binders
	    if (this.resolver.observers) for (let i = 0; i < this.resolver.observers.length; i++) if (this.observables.indexOf(this.resolver.observers[i]) < 0) this.observables.push(this.resolver.observers[i]);
	    if (this.alterer.observers) for (let i = 0; i < this.alterer.observers.length; i++) if (this.observables.indexOf(this.alterer.observers[i]) < 0) this.observables.push(this.alterer.observers[i]);
	    if (this.config.observers) for (let i = 0; i < this.config.observers.length; i++) if (this.observables.indexOf(this.config.observers[i]) < 0) this.observables.push(this.config.observers[i]);

		return this;
	}

	/**
	 * update()
	 * updates observers (as they can change if using properties as keys) and issue bind in child
	 * @param object oldValue The old value once object change detect
	 * @param string path The path that was affected (or the key if adding or removing a value to/from an object)
	 * @param string action The action to perform, 'update', 'array-add', 'array-remove', 'object-add', 'object-remove'
	 * @param object key The key name if an object value is added or removed
	 */
	update(oldValue, path, action, key) {
		// resolve data, bind to element from child class
		this.resolver.resolve(this.model, this.delayMethod === true ? true : false);
		var newValue = this.resolver.resolved;

		if (this.config) this.config.resolve(this.model);
		if (this.alterer)
		{
			this.alterer.resolve(this.model);
			this.resolver.resolved = RaziloBindCoreDetector.alterers(this.alterer.resolved, this.resolver.resolved);
		}

		this.bind(oldValue, path, action, key);

		// garbage collection on observables map which is only thing holding ref to binder (so binder will be released naturally)
		if (action === 'object-remove') delete this.traverser.observables[path + '.' + key];
		else if (action === 'array-remove')	for (var i = newValue.length -1; i < oldValue; i++) delete this.traverser.observables[path + '.' + i];
	}
}
