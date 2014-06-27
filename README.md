Works like Meteor's Session, but bound to template instances.
The `TemplateSession` class is used for making reactive property transfers between helpers and callbacks possible.

Installation
============

    $ mrt add template-session

Usage
=====

The `TemplateSession` works like Session, but for template instance specific


To set and get properties does as follow:

    // set a property
    TemplateSession.set('myProperty', 'myValue');

    // to get it inside a helper, or callback
    TemplateSession.get('myProperty');


Additional you can pass a third options parameter with `{reactive: false}`, to prevent reactive reruns.
You also can pass a fixed id, to be used for the TemplateSession like: `{id: 1234}`

When you want to to get/set TemplateSession fomr within a template hook or event use the following syntax:

    // set a property
    TemplateSession.set.call(this, 'myProperty', 'myValue');

    // to get it inside a helper, or callback
    TemplateSession.get.call(this, 'myProperty');

    // or from an event
    'click button': function(e, template) {
        TemplateSession.set.call(template, 'myProperty', 'myValue');
    }

**Re-run**
You cans also use the `TemplateSession` to reactivily "re-run" helpers by setting the value to `rerun`.
This will just rerun all reactive helpers which call `TemplateSession.get()`.

**Note**

It won't rerun depending functions, when calling `TemplateSession.set()` and the value didn't changed. Except when the stored value is an object or array (as this is only a stored reference).


API Docs
========

### TemplateSession.get(propertyName, options)

When get is called it creates a `Deps.Dependency.depend()` for that key in the store.

- @method get
- @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
- @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
- @return {Mixed} The stored value.



### TemplateSession.set(propertyName, value, options)

When set is called every depending reactive function where `TemplateSession.get()` with the same key is called will rerun.

- @method set
- @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
- @param {String|Object} value     If the value is a string with `rerun`, then it will be rerun all dependent functions where get `TemplateInstance.get()` was called.
- @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
- @return undefined

### TemplateSession.setAll(propertyName, value, options)

Will run `set()` for all key, which match the property name, independent of its id.

- @method set
- @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
- @param {String|Object} value     If the value is a string with `rerun`, then it will be rerun all dependent functions where get `TemplateInstance.get()` was called.
- @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
- @return undefined


### TemplateSession.unset(propertyName, options)

Clears a set property.

**Note** This is by default NOT reactive. If you want it to rerun dependecies before removing the property, pass `{reactive: true}` as third parameter.

- @method unset
- @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
- @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
- @return undefined


### TemplateSession.unsetAll(propertyName, options)

Clears all instances of a set property.

**Note** This is by default NOT reactive. If you want it to rerun dependecies before removing the property, pass `{reactive: true}` as third parameter.

- @method unsetAll
- @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
- @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
- @return undefined
