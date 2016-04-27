# raziloBind - Binders for ES6 JS/HTML Binding Library

## What is raziloBind?


ES6 JS/HTML binding library for creating dynamic web applications through HTML attribute binding. Made up of 4 libraries, puled in via a parent package that pulls in all required parts and configures as importable ES6 module 'RaziloBind'.

* **[razilobind-core](https://github.com/smiffy6969/razilobind-core)** *(the main part)*, to traverse, detect and observe.
* **[razilobind-binder](https://github.com/smiffy6969/razilobind-binder) [injectables]** *(the actual binders)*, binding object properties to elements to do various things.
* **[razilobind-resolver](https://github.com/smiffy6969/razilobind-resolver) [injectables]** *(to parse attribute data)*, resolving attribute data to things like strings, numbers, objects, methods etc.
* **[razilobind-alterer](https://github.com/smiffy6969/razilobind-alterer) [injectables]** *(to change things)*, altering resolved data to something else without affecting the model.

This package **razilobind-core**, is the base functionality that binds, observes, traverses and detects, allowing injectables to be used on dom elements.


## What are Binders?

Binders are a way we do something with an element, such as showing it, hiding it, looping it many times, changing attributes, taking inputs etc. Basically the many things you can do manually to an element in your application to make your application come alive. This is the basis of having a binding engine/tool/framework, we have stripped these out into standalone classes to be injected into razilobind to allow you to configure what you need (razilobind-core) or just choose all defaults (razilobind).

Binders start with bind, then follow with the binder type (you can have a prefix too if you wish!). We then place resolvable data in the attribute, [see here for what types of resolvable data can be used](https://github.com/smiffy6969/razilobind-resolver), to be evaluated and used with the binder. Each binder can accept all [] or certain types ['boolean', 'object', 'phantom'] of resolved data. To use a binder we can...


```html
<!-- binding model data directly (two way) -->
<p bind-text="foobar"></p>

<!-- bind a literal (one way) -->
<p bind-show="true"></p>

<!-- binders producing phantom properties (two way) [configurable] -->
<ul>
	<li bind-for="object"><span bind-text="$key"></span> <span bind-text="$value"></span></li>
</ul>

<!-- one way binder (object) that gets re-evaluated like two way binding, by having an observed value inside it that changes -->
<p bind-attribute="{'disabled': something}"></p>

<!-- one way binder (method) that gets re-evaluated like two way binding, by having an observed value inside it that changes -->
<p bind-text="doSomething(foobar)"></p>
```


NOTE: Two way binding happens when binding properties of the model directly, or anything that uses a property of the model (including alterers and configs for binders!). Any time a re-evaluation is triggered, the elements complete binding is updated. Single binding is everything not falling into this rule meaning a one time evaluation on load.


## What Binders are Available


### text *Add text to element*

Adds text inside an element.

**Accepts Resolvers** all resolver types

```html
<span bind-text="foo"></span>
```


### html *Add html to element*

Adds html inside an element.

**Accepts Resolvers** string, property, phantom, method

```html
<span bind-html="foo"></span>
```


### show *Show an element*

Show an element and it's children only if resolved data is truthy.

**Accepts Resolvers** all resolver types

```html
<span bind-show="foo"></span>
```


### hide *Hide an element*

Hide an element and it's children only if resolved data is truthy. Use for constant showing and hiding during application use.

**Accepts Resolvers** all resolver types

```html
<span bind-hide="foo"></span>
```


### if *Use an element*

Use an element and it's children in the dom if resolved data is truthy. Not to be mistaken for 'show'. Use for one time evaluation of wether element should be present on load.

**Accepts Resolvers** property, phantom, boolean, method

```html
<span bind-if="foo"></span>
```


### else *Dont use an element*

Don't use an element and it's children in the dom if resolved data is truthy. Not to be mistaken for 'hide'. Use for one time evaluation of wether element should be present on load.

**Accepts Resolvers** property, phantom, boolean, method

```html
<span bind-else="foo"></span>
```


### class *Add class name/s to element*

Add class name/s to an element, do this as a one time bind or on a changable basis (add/remove based on truthy).

**Accepts Resolvers** property, phantom, object, array, string, method

```html
<!-- basic add -->
<span bind-class="'classname'"></span>

<!-- add property value -->
<span bind-class="foobar"></span>

<!-- add method value -->
<span bind-class="whatever(something, 'another')"></span>

<!-- add add/remove truthy -->
<span bind-class="{'something': foo.bar['baz']}"></span>

<!-- add collection of classes -->
<span bind-class="['test', foobar, whatever()]"></span>
```


### style *Add style to element*

Add style to an element.

**Accepts Resolvers** property, phantom, object, method

```html
<!-- basic add -->
<span bind-style="{'display': 'none'}"></span>

<!-- add property value -->
<span bind-style="{'color': some.color}"></span>

<!-- add method value -->
<span bind-style="{'margin': someFunction()}"></span>
```


### attribute *Add attribute to element*

Add attribute/s to an element either as an attribute only based on truthy, or an attribute with data set on it.

**Accepts Resolvers** property, phantom, object, array, string, method

```html
<!-- basic add attribute only -->
<span bind-attribute="'disabled'"></span>

<!-- basic add attribute from property -->
<span bind-attribute="foo.bar['baz']"></span>

<!-- basic add attribute with data -->
<span bind-attribute="{'type': foobar, 'data-help': 'help me'}"></span>

<!-- add/remove with property as data, or if  -->
<span bind-attribute="{'disabled': truthy}"></span>

<!-- add property value -->
<span bind-attribute="{'something': some.color}"></span>

<!-- add method value -->
<span bind-attribute="{'something': someFunction()}"></span>
```


### for *Loop over element*

Loop over an element, repeating it for each instance of resolved data.

**Accepts Resolvers** property, phantom, method, array, object
**Config** {'key': 'name', 'value': ''}
**Filter** {'title': 'name', 'value': ''}

```html
<!-- basic for loop, access itteration using phantom property -->
<ul>
	<li bind-for="['a', 'b', 'c']">
		<span bind-text="$key"></span>
		<span bind-text="$value"></span>
	</li>
</ul>

<!-- loop from property object/array, access itteration using phantom property -->
<ul>
	<li bind-for="list">
		<span bind-text="$key"></span>
		<span bind-text="$value.name"></span>
	</li>
</ul>

<!-- set phantom names for key and value -->
<ul>
	<li bind-for="list" config-for="{'key': 'idx', 'value': 'data'}">
		<span bind-text="$idx"></span>
		<span bind-text="$data.name"></span>
	</li>
</ul>

<!-- more complex optionsm ordering on contents, filtering on contents, limits and offsets -->
<ul>
	<li bind-for="list" order-for="{'id': 'desc', 'title': 'asc'}" filter-for="{'title': '*wild*', 'foo': 'literal', 'bar': ['*', property, '*']}" limit-for="2" offset-for="2">
		<span bind-text="$key"></span>
		<span bind-text="$value.title"></span>
	</li>
</ul>
```


### value *Two way bind to element value*

Offers two way binding to form controls such as inputs, select boxes textareas etc. Updating the controls will update the model, model updates will update the dom.

**Accepts Resolvers** property, phantom

```html
<!-- basic value binds -->
<input type="text" bind-value="some.value"/>
<textarea bind-value="some.value"></textarea>

<!-- binding values in selects -->
<select bind-value="some.value">
	<option bind-for="list" bind-value="$key" bind-text="$value"></option>
</select>
```


### checked *Two way bind to element checked value*

Offers two way binding to form controls that use checked status such as radio buttons and check boxes. Updating the controls will update the model, model updates will update the dom.

**Accepts Resolvers** property, phantom

```html
<!-- radio buttons -->
<ul>
	<li bind-for="list">
		<input type="radio" name="test" bind-value="$key" bind-checked="some.value"/>
		<label bind-text="$value"></label>
	</li>
</ul>

<!-- check box -->
<input type="checkbox" name="boohoo" value="whatever" bind-checked="some.value"/>
```


### event *Multi-purpose event binder*

Offers a simple way to bind any event to a method. Accepts all js element event types without the 'on' bit.

**Accepts Resolvers** method

```html
<!-- radio buttons -->
<button bind-event="{'click': someMethod()}"></button>
<button bind-event="{'mouseenter': someMethod($key, 'something else')}"></button>
```


## Making your own Binders


There are two ways to add your own binders to the library, by injecting them with the addBinders() method bundled with razilobind, or if you have decided to import the core and have extended it, you may inject them along with all the other binders in the same fashion.

First off you will need a new binder, you can start off by taking an existing binder and copying it, changing the necessary parts. Lets call this **your-test.binder.js**...

```javascript
import {RaziloBindBinder} from 'razilobind-binder'

/**
 * Test Binder
 * Do something to the element node based on resolved data
 *
 * Inherits
 *
 * properties: options, node, resolver, traverser, model, accepts
 * method: detect(node) { return bool }
 * method: build(model) { return binder }
 * method: update(newValue, oldValue) { }
 */
export default class ShowBinder extends Binder {
	constructor(options, traverser) {
		super();
		this.options = options; 		// prefix etc.
		this.traverser = traverser; 	// so you can re-traverse new elements for binds
		this.name = 'your-test'; 		// name of the resolver to search for
		this.accepts = []; 				// accept all resolvers
	}

	/**
	 * bind()
	 * Bind the resolved data by showing hiding the node
	 * @param object oldValue The old value of the observed object
	 */
	bind(oldValue, path, action, key) {
		// oldValue is the value before the new change, before it was re-evaluated or empty on load
		// path is the path to the model property if property bound
		// action is the action being performed in this evaluation, such as update or array-remove
		// key is the key of any objects or array values removed or added (to allow synching of elements such as looping)

		// this.resolver contains the element binds resolver (resolved is the data that has been resolved and after alterers applied)
		// this.node is the actual element node you are on
		// this.traverser is the traverser instance you can use to re-traverse new elements (garbage collection on removed nodes is automatic!)
		// this.model is the bound model at the root level

		// various things methods are automatically run on bind, such as detection, build and updates from observers (which fire this method)
		// all that is required is to complete the necessary changes for your element in this method

		// this is a sample of showing and hiding an element based in truthy data
		if (!!this.resolver.resolved) this.node.style.display = '';
		else this.node.style.display = 'none';
	}
}
```

You can now import this into your project logic along with razilobind, injecting YourTestBinder into razilobind by adding custom binder...


```javascript
import RaziloBind from 'razilobind'
import YourTestBinder from './your-test.binder.js'

var model = {foo: 'foo', bar: 'bar'};

var rb = new RaziloBind();
rb.addBinders({YourTest: YourTestBinder});
rb.bind('#test', model);
```

or if you have extended the core with your own class, you can add them as follows...


```javascript
import {RaziloBindCore, RaziloBindCoreDetector} from 'razilobind-core'
import {RaziloBindTrimAlterer, ...} from 'razilobind-alterer'
import {RaziloBindForBinder, ...} from 'razilobind-binder'
import {RaziloBindBooleanResolver, ...} from 'razilobind-resolver'
import YourTestBinder from './your-test.binder.js'

export default class YourProjectBind extends RaziloBindCore {
    constructor(options) {
		super(options);

		// Inject injectables, pull in what you need!
		RaziloBindCoreDetector.defaultAlterers = {TrimAlterer: RaziloBindTrimAlterer, ...};
		RaziloBindCoreDetector.defaultBinders = {ForBinder: RaziloBindForBinder, ...};
		RaziloBindCoreDetector.defaultResolvers = {BooleanResolver: RaziloBindBooleanResolver, ...};

		// Inject custom injectables
		RaziloBindCoreDetector.customBinders = {YourTest: YourTestBinder, ...};
	}
}
```


...either way will inject custom binders, should you wish to replace all default binders with your own custom ones, substitute the default injectables with your custom ones. Default injectables will also be parsed first, followed by custom ones, you choose how to and what to inject.


Once your new binder is injected, you should be able to use it like so (don't forget strings are in quotes, miss the quotes and you will be sending a property in!)


```html
<span bind-your-test="foo"></span>
```
