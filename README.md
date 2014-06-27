A reactive store based on IDs for template instance specific triggers.
The `TemplateStore` class is used for making reactive property transfers between helpers and callbacks possible.

Installation
============

    $ mrt add template-store

Usage
=====

This works like sessions with an added id, to make it unique for template instances.
The `this` in the following examples, can either be the data context from within a helper,
or the template instance from a template callback (like `created()`,`rendered()`,`destroyed()` or events).
It will then look for the `_id` property to be use as the instance as identifier.
You can also pass your own custom ID, but you have to make sure, that you also pass this same ID everytime you call `TemplateStore.get()` or  `TemplateStore.set()`.
If you don't pass an ID a standard ID will be used, which is then the same for all stores with the given property name (which makes it a general session).

To set and get properties does as follow:

    // set a property
    TemplateStore.set(this,'cards_tvguide_broadcast->myProperty','myValue');

    // to get it inside a helper, or callback
    TemplateStore.get(this,'cards_tvguide_broadcast->myProperty');

Additional you can pass a third options parameter with `{reactive: false}`, to prevent reactive reruns.

**Note** Be aware that your data context need to have an `_id` property,
otherwise you have to manually set an id parameter with an value which is accessable from inside the helpers or callbacks (e.g setting an id manually to the data context).

You also should be aware when using the `{{#with}}` helper, as this changes the data context.

**Re-run**
You cans also use the `TemplateStore` to reactivily "re-run" helpers by setting the value to `rerun`.
This will just rerun all reactive helpers which call `TemplateStore.get()`.

**Note**

It won't rerun depending functions, when calling `TemplateStore.set()` and the value didn't changed. Except when the stored value is an object or array (as this is only a stored reference).


API Docs
========

### TemplateStore.get(id, propertyName, options)

When get is called it creates a `Deps.Dependency.depend()` for that key in the store.

- @method get
- @param {String} id               The template instances id, best use `this._id` from your current data context.
- @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
- @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
- @return {Mixed} The stored value.



### TemplateStore.set(id, propertyName, value, options)

When set is called every depending reactive function where `TemplateStore.get()` with the same key is called will rerun.

- @method set
- @param {String} id               The template instances id, best use `this._id` from your current data context.
- @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
- @param {String|Object} value     If the value is a string with `rerun`, then it will be rerun all dependent functions where get `TemplateInstance.get()` was called.
- @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
- @return undefined

### TemplateStore.setAll(propertyName, value, options)

Will run `set()` for all key, which match the property name, independent of its id.

- @method set
- @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
- @param {String|Object} value     If the value is a string with `rerun`, then it will be rerun all dependent functions where get `TemplateInstance.get()` was called.
- @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
- @return undefined


### TemplateStore.unset(id, propertyName, options)

Clears a set property.

**Note** This is by default NOT reactive. If you want it to rerun dependecies before removing the property, pass `{reactive: true}` as third parameter.

- @method unset
- @param {String} id               The template instances id, best use `this._id` from your current data context.
- @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
- @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
- @return undefined


### TemplateStore.unsetAll(propertyName, options)

Clears all instances of a set property.

**Note** This is by default NOT reactive. If you want it to rerun dependecies before removing the property, pass `{reactive: true}` as third parameter.

- @method unsetAll
- @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
- @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
- @return undefined
