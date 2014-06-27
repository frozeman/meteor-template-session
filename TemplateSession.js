/**
Template helpers

@module package template-store2
**/


/**
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


@class TemplateSession
@constructor
**/
TemplateSession = {

    /**
    Generates the key name e.g. `12344_myKeyName`.

    @method _getKeyName
    @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
    @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
    @return {String} The generated key name.
    **/
    _getKeyName: function(propertyName, options){
        var guid = 'default';

        if(options && options.id) {
            guid = options.id;

        } else {
            try {
                guid = UI._templateInstance().__component__.guid;
            } catch(e) {
                if(!this.__component__)
                    throw new Error('Pass the template instance using "call" from inside template hooks and events: TemplateSession.set.call(this|template, \'myProperty\', \'myValue\')');
                else
                    guid = this.__component__.guid;
            }
        }

        // build the keyname
        return guid + '_' + propertyName;
    },


    // PUBLIC

    /**
    When get is called we create a `Deps.Dependency.depend()` for that key in the store.

    @method get
    @param {String} id               The template instances id, best use `this._id` from your current data context.
    @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
    @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
    @return {Mixed} The stored value.
    **/
    get: function (propertyName, options) {
        var keyName = TemplateSession._getKeyName.call(this, propertyName, options);

        Session._ensureKey(keyName);

        if(!options || options.reactive !== false)
            Session.keyDeps[keyName].depend();

        return Session.keys[keyName];
    },


    /**
    When set is called every depending reactive function where `TemplateSession.get()` with the same key is called will rerun.

    @method set
    @param {String} id               The template instances id, best use `this._id` from your current data context.
    @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
    @param {String|Object} value     If the value is a string with `rerun`, then it will be rerun all dependent functions where get `TemplateInstance.get()` was called.
    @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
    @return undefined
    **/
    set: function (propertyName, value, options) {
        var keyName = TemplateSession._getKeyName.call(this, propertyName, options);

        Session._ensureKey(keyName);


        // only reload the dependencies, when value actually changed
        if(value === 'rerun') {

            Session.keyDeps[keyName].changed();

        // when object, always rerun, when something else, check if changed.
        } else if((!_.isObject(value) && Session.keys[keyName] !== value) ||
                  (_.isObject(value) && !_.isEqual(Session.keys[keyName], value))) {

            Session.keys[keyName] = value;

            if(!options || options.reactive !== false)
                Session.keyDeps[keyName].changed();
        }
    },

    /**
    Will set all keys of the given name, no matter of the id to the given value.

    @method set
    @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
    @param {String|Object} value     If the value is a string with `rerun`, then it will be rerun all dependent functions where get `TemplateInstance.get()` was called.
    @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
    @return undefined
    **/
    setAll: function (propertyName, value, options) {
        var propertyIds = _.compact(_.map(Session.keys, function(value, key){
                return (key.indexOf(propertyName) !== -1) ? _.trim(key.replace(propertyName, ''), '_') : null;
            }));

        _.each(propertyIds, function(propertyId){
            Session.set.call(this, propertyName, options);
        });
    },



    /**
    Clears a set property.

    **Note** This is by default NOT reactive. If you want it to rerun dependecies after removing the property, pass `{reactive: true}` as third parameter.

    @method unset
    @param {String} id               The template instances id, best use `this._id` from your current data context.
    @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
    @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
    @return undefined
    **/
    unset: function (id, propertyName, options) {
        var keyName = TemplateSession._getKeyName.call(this, propertyName, options);

        if(options && options.reactive === true)
            Session.keyDeps[keyName].changed();

        delete Session.keys[keyName];
        delete Session.keyDeps[keyName];
        delete Session.keyValueDeps[keyName];
    },

    /**
    Clears all instances of a set property.

    **Note** This is by default NOT reactive. If you want it to rerun dependecies before removing the property, pass `{reactive: true}` as third parameter.

    @method unsetAll
    @param {String} propertyName     The name of the property you want to get. Should consist of the `'templateName->myPropertyName'`
    @param {Object} options          give `{reactive: true}` if it shouldn't be reactive.
    @return undefined
    **/
    unsetAll: function (propertyName, options) {
        // find all keys containing this property name
        _.each(Sesion.keys, function(key, keyName){
            // delet those keys and dependecies
            if (keyName.indexOf(propertyName) !== -1) {
                if(options && options.reactive === true)
                    Session.keyDeps[keyName].changed();

                delete Session.keys[keyName];
                delete Session.keyDeps[keyName];
                delete Session.keyValueDeps[keyName];
            }
        });

    }
};