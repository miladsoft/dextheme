"use strict";

// Class definition
var DEXScrolltop = function(element, options) {
    ////////////////////////////
    // ** Private variables  ** //
    ////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default options
    var defaultOptions = {
        offset: 300,
        speed: 600
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        if (DEXUtil.data(element).has('scrolltop')) {
            the = DEXUtil.data(element).get('scrolltop');
        } else {
            _init();
        }
    }

    var _init = function() {
        // Variables
        the.options = DEXUtil.deepExtend({}, defaultOptions, options);
        the.uid = DEXUtil.getUniqueId('scrolltop');
        the.element = element;

        // Set initialized
        the.element.setAttribute('data-dex-scrolltop', 'true');

        // Event Handlers
        _handlers();

        // Bind Instance
        DEXUtil.data(the.element).set('scrolltop', the);
    }

    var _handlers = function() {
        var timer;

        window.addEventListener('scroll', function() {
            DEXUtil.throttle(timer, function() {
                _scroll();
            }, 200);
        });

        DEXUtil.addEvent(the.element, 'click', function(e) {
            e.preventDefault();

            _go();
        });
    }

    var _scroll = function() {
        var offset = parseInt(_getOption('offset'));

        var pos = DEXUtil.getScrollTop(); // current vertical position

        if ( pos > offset ) {
            if ( document.body.hasAttribute('data-dex-scrolltop') === false ) {
                document.body.setAttribute('data-dex-scrolltop', 'on');
            }
        } else {
            if ( document.body.hasAttribute('data-dex-scrolltop') === true ) {
                document.body.removeAttribute('data-dex-scrolltop');
            }
        }
    }

    var _go = function() {
        var speed = parseInt(_getOption('speed'));

        window.scrollTo({top: 0, behavior: 'smooth'});
        //DEXUtil.scrollTop(0, speed);
    }

    var _getOption = function(name) {
        if ( the.element.hasAttribute('data-dex-scrolltop-' + name) === true ) {
            var attr = the.element.getAttribute('data-dex-scrolltop-' + name);
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
        DEXUtil.data(the.element).remove('scrolltop');
    }

    // Construct class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.go = function() {
        return _go();
    }

    the.getElement = function() {
        return the.element;
    }

    the.destroy = function() {
        return _destroy();
    }
};

// Static methods
DEXScrolltop.getInstance = function(element) {
    if (element && DEXUtil.data(element).has('scrolltop')) {
        return DEXUtil.data(element).get('scrolltop');
    } else {
        return null;
    }
}

// Create instances
DEXScrolltop.createInstances = function(selector = '[data-dex-scrolltop="true"]') {
    // Initialize Menus
    var elements = document.body.querySelectorAll(selector);
    var scrolltop;

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            scrolltop = new DEXScrolltop(elements[i]);
        }
    }
}

// Global initialization
DEXScrolltop.init = function() {
    DEXScrolltop.createInstances();
};


// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = DEXScrolltop;
}
