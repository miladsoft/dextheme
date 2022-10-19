"use strict";

// Class definition
var DEXSticky = function(element, options) {
    ////////////////////////////
    // ** Private Variables  ** //
    ////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default Options
    var defaultOptions = {
        offset: 200,
        reverse: false,
        animation: true,
        animationSpeed: '0.3s',
        animationClass: 'animation-slide-in-down'
    };
    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( DEXUtil.data(element).has('sticky') === true ) {
            the = DEXUtil.data(element).get('sticky');
        } else {
            _init();
        }
    }

    var _init = function() {
        the.element = element;
        the.options = DEXUtil.deepExtend({}, defaultOptions, options);
        the.uid = DEXUtil.getUniqueId('sticky');
        the.name = the.element.getAttribute('data-dex-sticky-name');
        the.attributeName = 'data-dex-sticky-' + the.name;
        the.attributeName2 = 'data-dex-' + the.name;
        the.eventTriggerState = true;
        the.lastScrollTop = 0;
        the.scrollHandler;

        // Set initialized
        the.element.setAttribute('data-dex-sticky', 'true');

        // Event Handlers
        window.addEventListener('scroll', _scroll);

        // Initial Launch
        _scroll();

        // Bind Instance
        DEXUtil.data(the.element).set('sticky', the);
    }

    var _scroll = function(e) {
        var offset = _getOption('offset');
        var reverse = _getOption('reverse');
        var st;
        var attrName;
        var diff;

        // Exit if false
        if ( offset === false ) {
            return;
        }

        offset = parseInt(offset);
        st = DEXUtil.getScrollTop();
        diff = document.documentElement.scrollHeight - window.innerHeight - DEXUtil.getScrollTop();

        if ( reverse === true ) {  // Release on reverse scroll mode
            if ( st > offset) {
                if ( document.body.hasAttribute(the.attributeName) === false) {
                    
                    if (_enable() === false) {
                        return;
                    }

                    document.body.setAttribute(the.attributeName, 'on');
                    document.body.setAttribute(the.attributeName2, 'on');
                }

                if ( the.eventTriggerState === true ) {
                    DEXEventHandler.trigger(the.element, 'kt.sticky.on', the);
                    DEXEventHandler.trigger(the.element, 'kt.sticky.change', the);

                    the.eventTriggerState = false;
                }
            } else { // Back scroll mode
                if ( document.body.hasAttribute(the.attributeName) === true) {
                    _disable();
                    document.body.removeAttribute(the.attributeName);
                    document.body.removeAttribute(the.attributeName2);
                }

                if ( the.eventTriggerState === false ) {
                    DEXEventHandler.trigger(the.element, 'kt.sticky.off', the);
                    DEXEventHandler.trigger(the.element, 'kt.sticky.change', the);
                    the.eventTriggerState = true;
                }
            }

            the.lastScrollTop = st;
        } else { // Classic scroll mode
            if ( st > offset) {
                if ( document.body.hasAttribute(the.attributeName) === false) {
                    
                    if (_enable() === false) {
                        return;
                    } 
                    
                    document.body.setAttribute(the.attributeName, 'on');
                    document.body.setAttribute(the.attributeName2, 'on');
                }

                if ( the.eventTriggerState === true ) {
                    DEXEventHandler.trigger(the.element, 'kt.sticky.on', the);
                    DEXEventHandler.trigger(the.element, 'kt.sticky.change', the);
                    the.eventTriggerState = false;
                }
            } else { // back scroll mode
                if ( document.body.hasAttribute(the.attributeName) === true ) {
                    _disable();
                    document.body.removeAttribute(the.attributeName);
                    document.body.removeAttribute(the.attributeName2);
                }

                if ( the.eventTriggerState === false ) {
                    DEXEventHandler.trigger(the.element, 'kt.sticky.off', the);
                    DEXEventHandler.trigger(the.element, 'kt.sticky.change', the);
                    the.eventTriggerState = true;
                }
            }
        }      
    }

    var _enable = function(update) {
        var top = _getOption('top');
        top = top ? parseInt(top) : 0;

        var left = _getOption('left');
        var right = _getOption('right');
        var width = _getOption('width');
        var zindex = _getOption('zindex');
        var dependencies = _getOption('dependencies');
        var classes = _getOption('class');

        var height = _calculateHeight();
        var heightOffset = _getOption('height-offset');
        heightOffset = heightOffset ? parseInt(heightOffset) : 0;

        if (height + heightOffset + top > DEXUtil.getViewPort().height) {
            return false;
        }
        
        if ( update !== true && _getOption('animation') === true ) {
            DEXUtil.css(the.element, 'animationDuration', _getOption('animationSpeed'));
            DEXUtil.animateClass(the.element, 'animation ' + _getOption('animationClass'));
        }

        if ( classes !== null ) {
            DEXUtil.addClass(the.element, classes);
        }

        if ( zindex !== null ) {
            DEXUtil.css(the.element, 'z-index', zindex);
            DEXUtil.css(the.element, 'position', 'fixed');
        }

        if ( top > 0 ) {
            DEXUtil.css(the.element, 'top', String(top) + 'px');
        }

        if ( width !== null ) {
            if (width['target']) {
                var targetElement = document.querySelector(width['target']);
                if (targetElement) {
                    width = DEXUtil.css(targetElement, 'width');
                }
            }

            DEXUtil.css(the.element, 'width', width);
        }

        if ( left !== null ) {
            if ( String(left).toLowerCase() === 'auto' ) {
                var offsetLeft = DEXUtil.offset(the.element).left;

                if ( offsetLeft > 0 ) {
                    DEXUtil.css(the.element, 'left', String(offsetLeft) + 'px');
                }
            } else {
                DEXUtil.css(the.element, 'left', left);
            }
        }

        if ( right !== null ) {
            DEXUtil.css(the.element, 'right', right);
        }        

        // Height dependencies
        if ( dependencies !== null ) {
            var dependencyElements = document.querySelectorAll(dependencies);
            
            if ( dependencyElements && dependencyElements.length > 0 ) {
                for ( var i = 0, len = dependencyElements.length; i < len; i++ ) {
                    DEXUtil.css(dependencyElements[i], 'padding-top', String(height) + 'px');
                }
            }
        }
    }

    var _disable = function() {
        DEXUtil.css(the.element, 'top', '');
        DEXUtil.css(the.element, 'width', '');
        DEXUtil.css(the.element, 'left', '');
        DEXUtil.css(the.element, 'right', '');
        DEXUtil.css(the.element, 'z-index', '');
        DEXUtil.css(the.element, 'position', '');

        var dependencies = _getOption('dependencies');
        var classes = _getOption('class');

        if ( classes !== null ) {
            DEXUtil.removeClass(the.element, classes);
        }

        // Height dependencies
        if ( dependencies !== null ) {
            var dependencyElements = document.querySelectorAll(dependencies);

            if ( dependencyElements && dependencyElements.length > 0 ) {
                for ( var i = 0, len = dependencyElements.length; i < len; i++ ) {
                    DEXUtil.css(dependencyElements[i], 'padding-top', '');
                }
            }
        }
    }

    var _check = function() {

    }

    var _calculateHeight = function() {
        var height = parseFloat(DEXUtil.css(the.element, 'height'));

        height = height + parseFloat(DEXUtil.css(the.element, 'margin-top'));
        height = height + parseFloat(DEXUtil.css(the.element, 'margin-bottom'));
        
        if (DEXUtil.css(element, 'border-top')) {
            height = height + parseFloat(DEXUtil.css(the.element, 'border-top'));
        }

        if (DEXUtil.css(element, 'border-bottom')) {
            height = height + parseFloat(DEXUtil.css(the.element, 'border-bottom'));
        }

        return height;
    }

    var _getOption = function(name) {
        if ( the.element.hasAttribute('data-dex-sticky-' + name) === true ) {
            var attr = the.element.getAttribute('data-dex-sticky-' + name);
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
        window.removeEventListener('scroll', _scroll);
        DEXUtil.data(the.element).remove('sticky');
    }

    // Construct Class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Methods
    the.update = function() {
        if ( document.body.hasAttribute(the.attributeName) === true ) {
            _disable();
            document.body.removeAttribute(the.attributeName);
            document.body.removeAttribute(the.attributeName2);
            _enable(true);
            document.body.setAttribute(the.attributeName, 'on');
            document.body.setAttribute(the.attributeName2, 'on');
        }
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
DEXSticky.getInstance = function(element) {
    if ( element !== null && DEXUtil.data(element).has('sticky') ) {
        return DEXUtil.data(element).get('sticky');
    } else {
        return null;
    }
}

// Create instances
DEXSticky.createInstances = function(selector = '[data-dex-sticky="true"]') {
    // Initialize Menus
    var elements = document.body.querySelectorAll(selector);
    var sticky;

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            sticky = new DEXSticky(elements[i]);
        }
    }
}

// Window resize handler
DEXSticky.handleResize = function() {
    window.addEventListener('resize', function() {
        var timer;
    
        DEXUtil.throttle(timer, function() {
            // Locate and update Offcanvas instances on window resize
            var elements = document.body.querySelectorAll('[data-dex-sticky="true"]');
    
            if ( elements && elements.length > 0 ) {
                for (var i = 0, len = elements.length; i < len; i++) {
                    var sticky = DEXSticky.getInstance(elements[i]);
                    if (sticky) {
                        sticky.update();
                    }
                }
            }
        }, 200);
    });
}

// Global initialization
DEXSticky.init = function() {
    DEXSticky.createInstances();
    DEXSticky.handleResize();
};


// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = DEXSticky;
}
