import {RaziloBindCoreDetector} from 'razilobind-core'

import Binder from './binder.js'

/**
 * For Binder
 * Alters elements style based on resolved data contents
 *
 * Inherits
 *
 * properties: options, node, resolvable, config, model, accepts
 */
export default class ForBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options;
		this.traverser = traverser;
		this.name = 'for';
		this.accepts = ['property', 'phantom', 'method', 'array', 'object'];
		this.placeholder = {};
		this.children = [];
	}

	/**
	 * OVERRIDE:detect()
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
		this.orderable = node.hasAttribute(this.options.prefix + 'order-' + this.name) ? node.getAttribute(this.options.prefix + 'order-' + this.name) : undefined;
		this.filterable = node.hasAttribute(this.options.prefix + 'filter-' + this.name) ? node.getAttribute(this.options.prefix + 'filter-' + this.name) : undefined;
		this.limitable = node.hasAttribute(this.options.prefix + 'limit-' + this.name) ? node.getAttribute(this.options.prefix + 'limit-' + this.name) : undefined;
		this.offsetable = node.hasAttribute(this.options.prefix + 'offset-' + this.name) ? node.getAttribute(this.options.prefix + 'offset-' + this.name) : undefined;

		if (!this.resolvable) return false;

		this.node = node;
		return true;
	}

	/**
	 * OVERRIDE:build()
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
		this.order = RaziloBindCoreDetector.resolver(this.orderable, this.node);
		this.filter = RaziloBindCoreDetector.resolver(this.filterable, this.node);
		this.limit = RaziloBindCoreDetector.resolver(this.limitable, this.node);
		this.offset = RaziloBindCoreDetector.resolver(this.offsetable, this.node);
		this.model = model;

		// resolve data to actuals and observables if of correct type or no types set
		if (this.resolver && (this.accepts.length === 0 || this.accepts.indexOf(this.resolver.name) >= 0)) this.update();

		// collate binders
		if (this.resolver.observers) for (let i = 0; i < this.resolver.observers.length; i++) if (this.observables.indexOf(this.resolver.observers[i]) < 0) this.observables.push(this.resolver.observers[i]);
		if (this.alterer.observers) for (let i = 0; i < this.alterer.observers.length; i++) if (this.observables.indexOf(this.alterer.observers[i]) < 0) this.observables.push(this.alterer.observers[i]);
		if (this.config.observers) for (let i = 0; i < this.config.observers.length; i++) if (this.observables.indexOf(this.config.observers[i]) < 0) this.observables.push(this.config.observers[i]);
		if (this.order.observers) for (let i = 0; i < this.order.observers.length; i++) if (this.observables.indexOf(this.order.observers[i]) < 0) this.observables.push(this.order.observers[i]);
		if (this.filter.observers) for (let i = 0; i < this.filter.observers.length; i++) if (this.observables.indexOf(this.filter.observers[i]) < 0) this.observables.push(this.filter.observers[i]);
		if (this.limit.observers) for (let i = 0; i < this.limit.observers.length; i++) if (this.observables.indexOf(this.limit.observers[i]) < 0) this.observables.push(this.limit.observers[i]);
		if (this.offset.observers) for (let i = 0; i < this.offset.observers.length; i++) if (this.observables.indexOf(this.offset.observers[i]) < 0) this.observables.push(this.offset.observers[i]);

		return this;
	}

	/**
	 * OVERRIDE:update()
	 * updates observers (as they can change if using properties as keys) and issue bind in child
	 * @param object oldValue The old value once object change detect
	 * @param string path The path that was affected (or the key if adding or removing a value to/from an object)
	 * @param string action The action to perform, 'update', 'array-add', 'array-remove', 'object-add', 'object-remove'
	 * @param object key The key name if an object value is added or removed
	 */
	update(oldValue, path, action, key) {
		// resolve data, bind to element from child class
		this.resolver.resolve(this.model);
		var newValue = this.resolver.resolved;

		if (this.config) this.config.resolve(this.model);
		if (this.order) this.order.resolve(this.model);
		if (this.filter) this.filter.resolve(this.model);
		if (this.limit) this.limit.resolve(this.model);
		if (this.offset) this.offset.resolve(this.model);
		if (this.alterer)
		{
			// alter resolved value
			this.alterer.resolve(this.model);
			this.resolver.resolved = RaziloBindCoreDetector.alterers(this.alterer.resolved, this.resolver.resolved);
		}

		this.bind(oldValue, path, action, key);

		// garbage collection on observables map which is only thing holding ref to binder (so binder will be released naturally)
		if (action === 'object-remove') delete this.traverser.observables[path + '.' + key];
		else if (action === 'array-remove')	for (var i = newValue.length -1; i < oldValue; i++) delete this.traverser.observables[path + '.' + i];
	}

	/**
	 * bind()
	 * Bind the resolved data by applying styles to node
	 * @param object oldValue The old value of the observed object
	 */
	bind(oldValue, path, action, objectKey) {
		if (typeof this.resolver.resolved !== 'object') return;

		// grab any config data
		var phantomKey = this.config && this.config.resolved.key ? this.config.resolved.key : '';
		var phantomValue = this.config && this.config.resolved.value ? this.config.resolved.value : '';
		var order = this.order && this.order.resolved ? this.order.resolved : undefined;
		var filter = this.filter && this.filter.resolved ? this.filter.resolved : undefined;

		// add placeholder and remove element from dom
		if (!this.placeholder.start)
		{
			this.placeholder.end = document.createComment('razilobind:for:end');
			if (this.node.nextSibling === null) this.node.parentNode.appendChild(this.placeholder.end);
			else this.node.parentNode.insertBefore(this.placeholder.end, this.node.nextSibling);

			this.placeholder.start = document.createComment('razilobind:for:start');
			this.placeholder.end.parentNode.insertBefore(this.placeholder.start, this.placeholder.end);

			this.node.parentNode.removeChild(this.node);
		}

		if (this.children.length > 0)
		{
			// remove any current children
			for (let i = 0; i < this.children.length; i++) this.children[i].parentNode.removeChild(this.children[i]);
			this.children = [];
		}

		// order and/or filter the resolved data, dont allow over length of data
		var orderedFiltered = this.orderFilter(this.resolver.resolved, order, filter);

		// limit and offset if either set
		if (this.offset || this.limit)
		{
			let offset = this.offset && this.offset.resolved ? parseInt(this.offset.resolved) : 0;
			let limit = this.limit && this.limit.resolved ? parseInt(this.limit.resolved) : 0;

			let nOffset = offset < 1 ? 0 : offset -1;
			let nLimit = nOffset + limit < 1 ? 0 : (nOffset > 0 ? nOffset - 1 : nOffset) + limit;

			orderedFiltered.resolved = orderedFiltered.resolved.splice(nOffset, nLimit);
			if (orderedFiltered.map) orderedFiltered.map = orderedFiltered.map.splice(nOffset, nLimit);
		}

		for (var key in orderedFiltered.resolved)
		{
			let newNode = this.node.cloneNode(true);
			newNode.removeAttribute(this.options.prefix + 'bind-' + this.name);
			newNode.removeAttribute(this.options.prefix + 'config-' + this.name);
			newNode.removeAttribute(this.options.prefix + 'alter-' + this.name);
			newNode.removeAttribute(this.options.prefix + 'order-' + this.name);
			newNode.removeAttribute(this.options.prefix + 'filter-' + this.name);
			newNode.removeAttribute(this.options.prefix + 'limit-' + this.name);
			newNode.removeAttribute(this.options.prefix + 'offset-' + this.name);
			newNode.phantom = {
				'iterationKey': orderedFiltered.map ? orderedFiltered.map[key] : key,
				'initialValue': orderedFiltered.resolved[key],
				'observers': this.resolver.observers,
				'keyName': phantomKey,
				'valueName': phantomValue
			};

			this.children.push(newNode);
		}

		// add children
		for (var i = 0; i < this.children.length; i++)
		{
			this.placeholder.end.parentNode.insertBefore(this.children[i], this.placeholder.end);
			if (path) this.traverser.traverse(this.children[i], this.model);
		}
	}

	// order data
	orderFilter(resolved, orderBy, filterBy) {
		if (!resolved || (!orderBy && !filterBy)) return {map: undefined, resolved: resolved};

		var isArray = Array.isArray(resolved);
		var newOrder = [];
		var map = [];

		resolvedloop:
		for (var key in resolved) {
			// filter out any data before ordering
			if (filterBy)
			{
				for (let name in filterBy)
				{
					if (typeof filterBy[name] === 'string' && new RegExp("^" + filterBy[name].split('*').join('.*') + "$").test(resolved[key][name])) continue resolvedloop;
					else if (Array.isArray(filterBy[name]) && new RegExp("^" + filterBy[name].join('').split('*').join('.*') + "$").test(resolved[key][name])) continue resolvedloop;
				}
			}

			// if first bit of data or no order defined, push data
			if (map.length < 1 || !orderBy) {
				map.push(key);
				newOrder.push(resolved[key]);
				continue;
			}

			// get position for order
			orderloop:
			for (var i = 0; i < newOrder.length; i++) {
				for (let name in orderBy) {
					if (orderBy[name] == 'asc' && resolved[key][name] > newOrder[i][name]) continue orderloop;
					if (resolved[key][name] == newOrder[i][name]) continue;
					if (orderBy[name] == 'desc' && resolved[key][name] < newOrder[i][name]) continue orderloop;
				}
				break;
			}

			// splice data into new stack
			map.splice(i, 0, key);
			newOrder.splice(i, 0, resolved[key]);
		}

		return {map: map, resolved: newOrder};
	}
}
