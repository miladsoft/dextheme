"use strict";

// Class definition
var DEXToggle = function(element, options) {
    ////////////////////////////
    // ** Private variables  ** //
    ////////////////////////////
    var the = this;

    if (!element) {
        return;
    }

    // Default Options
    var defaultOptions = {
        saveState: true
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( DEXUtil.data(element).has('toggle') === true ) {
            the = DEXUtil.data(element).get('toggle');
        } else {
            _init();
        }
    }

    var _init = function() {
        // Variables
        the.options = DEXUtil.deepExtend({}, defaultOptions, options);
        the.uid = DEXUtil.getUniqueId('toggle');

        // Elements
        the.element = element;

        the.target = document.querySelector(the.element.getAttribute('data-dex-toggle-target')) ? document.querySelector(the.element.getAttribute('data-dex-toggle-target')) : the.element;
        the.state = the.element.hasAttribute('data-dex-toggle-state') ? the.element.getAttribute('data-dex-toggle-state') : '';
        the.mode = the.element.hasAttribute('data-dex-toggle-mode') ? the.element.getAttribute('data-dex-toggle-mode') : '';
        the.attribute = 'data-dex-' + the.element.getAttribute('data-dex-toggle-name');

        // Event Handlers
        _handlers();

        // Bind Instance
        DEXUtil.data(the.element).set('toggle', the);
    }

    var _handlers = function() {
        DEXUtil.addEvent(the.element, 'click', function(e) {
            e.preventDefault();

            if ( the.mode !== '' ) {
                if ( the.mode === 'off' && _isEnabled() === false ) {
                    _toggle();
                } else if ( the.mode === 'on' && _isEnabled() === true ) {
                    _toggle();
                }
            } else {
                _toggle();
            }
        });
    }

    // Event handlers
    var _toggle = function() {
        // Trigger "after.toggle" event
        DEXEventHandler.trigger(the.element, 'kt.toggle.change', the);

        if ( _isEnabled() ) {
            _disable();
        } else {
            _enable();
        }       

        // Trigger "before.toggle" event
        DEXEventHandler.trigger(the.element, 'kt.toggle.changed', the);

        return the;
    }

    var _enable = function() {
        if ( _isEnabled() === true ) {
            return;
        }

        DEXEventHandler.trigger(the.element, 'kt.toggle.enable', the);

        the.target.setAttribute(the.attribute, 'on');

        if (the.state.length > 0) {
            the.element.classList.add(the.state);
        }        

        if ( typeof DEXCookie !== 'undefined' && the.options.saveState === true ) {
            DEXCookie.set(the.attribute, 'on');
        }

        DEXEventHandler.trigger(the.element, 'kt.toggle.enabled', the);

        return the;
    }

    var _disable = function() {
        if ( _isEnabled() === false ) {
            return;
        }

        DEXEventHandler.trigger(the.element, 'kt.toggle.disable', the);

        the.target.removeAttribute(the.attribute);

        if (the.state.length > 0) {
            the.element.classList.remove(the.state);
        } 

        if ( typeof DEXCookie !== 'undefined' && the.options.saveState === true ) {
            DEXCookie.remove(the.attribute);
        }

        DEXEventHandler.trigger(the.element, 'kt.toggle.disabled', the);

        return the;
    }

    var _isEnabled = function() {
        return (String(the.target.getAttribute(the.attribute)).toLowerCase() === 'on');
    }

    var _destroy = function() {
        DEXUtil.data(the.element).remove('toggle');
    }

    // Construct class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.toggle = function() {
        return _toggle();
    }

    the.enable = function() {
        return _enable();
    }

    the.disable = function() {
        return _disable();
    }

    the.isEnabled = function() {
        return _isEnabled();
    }

    the.goElement = function() {
        return the.element;
    }

    the.destroy = function() {
        return _destroy();
    }

    // Event API
    the.on = function(name, handler) {
        return DEXEventHandler.on(the.element, name, handler);
    }

    the.one = function(name, handler) {
        return DEXEventHandler.one(the.element, name, handler);
    }

    the.off = function(name, handlerId) {
        return DEXEventHandler.off(the.element, name, handlerId);
    }

    the.trigger = function(name, event) {
        return DEXEventHandler.trigger(the.element, name, event, the, event);
    }
};

// Static methods
DEXToggle.getInstance = function(element) {
    if ( element !== null && DEXUtil.data(element).has('toggle') ) {
        return DEXUtil.data(element).get('toggle');
    } else {
        return null;
    }
}

// Create instances
DEXToggle.createInstances = function(selector = '[data-dex-toggle]') {
    // Get instances
    var elements = document.body.querySelectorAll(selector);

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            // Initialize instances
            new DEXToggle(elements[i]);
        }
    }
}

// Global initialization
DEXToggle.init = function() {
    DEXToggle.createInstances();
};


// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = DEXToggle;
}