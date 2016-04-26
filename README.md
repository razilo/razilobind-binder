# raziloBind

## Binders ES6 JS/HTML Binding Library

Binders for ES6 JS/HTML binding library for creating cynamic web applications through HTML attribtue binding. Pulls in all required parts and configures as RaziloBind

A data binding library to bind ES6 JS to HTML views thorugh HTML attributes, offering live changes to update modules and vice versa.

Bind model properties to HTML elements via attributes. Substitue * for the binder to use `bind-*=""`, such as bind-text, bind-show...

* bind-text - (all resolvers, phantom) Bind data to element contents
* bind-show - (all resolvers, phantom) Show element if data truthy
* bind-hide - (all resolvers, phantom) Hide element if data truthy
* bind-style - (objects or properties, phantom) Apply style to element from data as object data {'color': 'red'} object embedded model properties {'color': color} or model object
* bind-class - (objects, arrays, strings or properties, phantom) Apply classes to element from data as object data {'foobar': truthy}, arrays ['foo', modelProperty, ... ], string 'foobar' or property fooBar (string value, object with truthies or array)
* bind-html - (string, property, phantom), bind to elements innerHTML replacing contents with html, use with caution, only bind HTML from trusted sources.
* bind-attribute - (string, array, object, property, phantom), adds attribute to element via string, array, object or property. use objects with truthy or stirng/array to ad attribute only, or objects with key as attribute and value as attribute value to populate the attribute value.
* bind-if - (property, method, boolean, phantom) Add or remove an element from dom based on a truthy conditional.
* bind-else - (property, method, boolean, phantom) Add or remove an element from dom based on a falsey conditional.
* bind-for - (property, method, object, array, phantom) Add multiple elements by looping over resolved data (generates phantom properties, defaults $key, $value). Can use order-for="{key: value,..}", filter-for="{key: ['*', foobar, '*']}", limit-for="10", offset-for="1" to affect the for loop
* bind-value - (property, method, phantom) Bind a model to inputs, selects, options... anything that takes a value. updated to the elements will be changed on the model! If using mutliple select, will give an array of option values.
* bind-checked - (property, method, phantom) As per bind-value... but for inputs that check something, e.g. checkboxes and radio buttons.
* bind-event - (object) Bind any event types of the element to functions in the model using {'eventName': method()}. Methods contain the event followed by any properties sent in e.g. method(event, propertyA, propertyB,...)
