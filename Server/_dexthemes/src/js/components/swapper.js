"use strict";

// Class definition
var DEXSwapper = function(element, options) {
    ////////////////////////////
    // ** Private Variables  ** //
    ////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default Options
    var defaultOptions = {
        mode: 'append'
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( DEXUtil.data(element).has('swapper') === true ) {
            the = DEXUtil.data(element).get('swapper');
        } else {
            _init();
        }
    }

    var _init = function() {
        the.element = element;
        the.options = DEXUtil.deepExtend({}, defaultOptions, options);

        // Set initialized
        the.element.setAttribute('data-dex-swapper', 'true');

        // Initial update
        _update();

        // Bind Instance
        DEXUtil.data(the.element).set('swapper', the);
    }

    var _update = function(e) {
        var parentSelector = _getOption('parent');

        var mode = _getOption('mode');
        var parentElement = parentSelector ? document.querySelector(parentSelector) : null;
       

        if (parentElement && element.parentNode !== parentElement) {
            if (mode === 'prepend') {
                parentElement.prepend(element);
            } else if (mode === 'append') {
                parentElement.append(element);
            }
        }
    }

    var _getOption = function(name) {
        if ( the.element.hasAttribute('data-dex-swapper-' + name) === true ) {
            var attr = the.element.getAttribute('data-dex-swapper-' + name);
            var value = DEXUtil.getResponsiveValue(attr);

            if ( value !== null && String(value) === 'true' ) {
                value = true;
            } else if ( value !== null && String(value) === 'false' ) {
                value = false;
            }

            return value;
        } else {
            var optionName = DEXUtil.snakeToCamel(name);

            if ( the.options[optionName] ) {
                return DEXUtil.getResponsiveValue(the.options[optionName]);
            } else {
                return null;
            }
        }
    }

    var _destroy = function() {
        DEXUtil.data(the.element).remove('swapper');
    }

    // Construct Class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Methods
    the.update = function() {
        _update();
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
DEXSwapper.getInstance = function(element) {
    if ( element !== null && DEXUtil.data(element).has('swapper') ) {
        return DEXUtil.data(element).get('swapper');
    } else {
        return null;
    }
}

// Create instances
DEXSwapper.createInstances = function(selector = '[data-dex-swapper="true"]') {
    // Initialize Menus
    var elements = document.querySelectorAll(selector);
    var swapper;

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            swapper = new DEXSwapper(elements[i]);
        }
    }
}

// Window resize handler
window.addEventListener('resize', function() {
    var timer;

    DEXUtil.throttle(timer, function() {
        // Locate and update Offcanvas instances on window resize
        var elements = document.querySelectorAll('[data-dex-swapper="true"]');

        if ( elements && elements.length > 0 ) {
            for (var i = 0, len = elements.length; i < len; i++) {
                var swapper = DEXSwapper.getInstance(elements[i]);
                if (swapper) {
                    swapper.update();
                }                
            }
        }
    }, 200);
});

// Global initialization
DEXSwapper.init = function() {
    DEXSwapper.createInstances();
};


// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = DEXSwapper;
}
