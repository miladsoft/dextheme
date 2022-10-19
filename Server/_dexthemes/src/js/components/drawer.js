"use strict";

// Class definition
var DEXDrawer = function(element, options) {
    //////////////////////////////
    // ** Private variables  ** //
    //////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default options
    var defaultOptions = {
        overlay: true,
        direction: 'end',
        baseClass: 'drawer',
        overlayClass: 'drawer-overlay'
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( DEXUtil.data(element).has('drawer') ) {
            the = DEXUtil.data(element).get('drawer');
        } else {
            _init();
        }
    }

    var _init = function() {
        // Variables
        the.options = DEXUtil.deepExtend({}, defaultOptions, options);
        the.uid = DEXUtil.getUniqueId('drawer');
        the.element = element;
        the.overlayElement = null;
        the.name = the.element.getAttribute('data-dex-drawer-name');
        the.shown = false;
        the.lastWidth;
        the.toggleElement = null;

        // Set initialized
        the.element.setAttribute('data-dex-drawer', 'true');

        // Event Handlers
        _handlers();

        // Update Instance
        _update();

        // Bind Instance
        DEXUtil.data(the.element).set('drawer', the);
    }

    var _handlers = function() {
        var togglers = _getOption('toggle');
        var closers = _getOption('close');

        if ( togglers !== null && togglers.length > 0 ) {
            DEXUtil.on(document.body, togglers, 'click', function(e) {
                e.preventDefault();

                the.toggleElement = this;
                _toggle();
            });
        }

        if ( closers !== null && closers.length > 0 ) {
            DEXUtil.on(document.body, closers, 'click', function(e) {
                e.preventDefault();

                the.closeElement = this;
                _hide();
            });
        }
    }

    var _toggle = function() {
        if ( DEXEventHandler.trigger(the.element, 'kt.drawer.toggle', the) === false ) {
            return;
        }

        if ( the.shown === true ) {
            _hide();
        } else {
            _show();
        }

        DEXEventHandler.trigger(the.element, 'kt.drawer.toggled', the);
    }

    var _hide = function() {
        if ( DEXEventHandler.trigger(the.element, 'kt.drawer.hide', the) === false ) {
            return;
        }

        the.shown = false;

        _deleteOverlay();

        document.body.removeAttribute('data-dex-drawer-' + the.name, 'on');
        document.body.removeAttribute('data-dex-drawer');

        DEXUtil.removeClass(the.element, the.options.baseClass + '-on');

        if ( the.toggleElement !== null ) {
            DEXUtil.removeClass(the.toggleElement, 'active');
        }

        DEXEventHandler.trigger(the.element, 'kt.drawer.after.hidden', the) === false
    }

    var _show = function() {
        if ( DEXEventHandler.trigger(the.element, 'kt.drawer.show', the) === false ) {
            return;
        }

        the.shown = true;

        _createOverlay();
        document.body.setAttribute('data-dex-drawer-' + the.name, 'on');
        document.body.setAttribute('data-dex-drawer', 'on');

        DEXUtil.addClass(the.element, the.options.baseClass + '-on');

        if ( the.toggleElement !== null ) {
            DEXUtil.addClass(the.toggleElement, 'active');
        }

        DEXEventHandler.trigger(the.element, 'kt.drawer.shown', the);
    }

    var _update = function() {
        var width = _getWidth();
        var direction = _getOption('direction');

        var top = _getOption('top');
        var bottom = _getOption('bottom');
        var start = _getOption('start');
        var end = _getOption('end');

        // Reset state
        if ( DEXUtil.hasClass(the.element, the.options.baseClass + '-on') === true && String(document.body.getAttribute('data-dex-drawer-' + the.name + '-')) === 'on' ) {
            the.shown = true;
        } else {
            the.shown = false;
        }       

        // Activate/deactivate
        if ( _getOption('activate') === true ) {
            DEXUtil.addClass(the.element, the.options.baseClass);
            DEXUtil.addClass(the.element, the.options.baseClass + '-' + direction);
            
            DEXUtil.css(the.element, 'width', width, true);
            the.lastWidth = width;

            if (top) {
                DEXUtil.css(the.element, 'top', top);
            }

            if (bottom) {
                DEXUtil.css(the.element, 'bottom', bottom);
            }

            if (start) {
                if (DEXUtil.isRTL()) {
                    DEXUtil.css(the.element, 'right', start);
                } else {
                    DEXUtil.css(the.element, 'left', start);
                }
            }

            if (end) {
                if (DEXUtil.isRTL()) {
                    DEXUtil.css(the.element, 'left', end);
                } else {
                    DEXUtil.css(the.element, 'right', end);
                }
            }
        } else {
            DEXUtil.removeClass(the.element, the.options.baseClass);
            DEXUtil.removeClass(the.element, the.options.baseClass + '-' + direction);

            DEXUtil.css(the.element, 'width', '');

            if (top) {
                DEXUtil.css(the.element, 'top', '');
            }

            if (bottom) {
                DEXUtil.css(the.element, 'bottom', '');
            }

            if (start) {
                if (DEXUtil.isRTL()) {
                    DEXUtil.css(the.element, 'right', '');
                } else {
                    DEXUtil.css(the.element, 'left', '');
                }
            }

            if (end) {
                if (DEXUtil.isRTL()) {
                    DEXUtil.css(the.element, 'left', '');
                } else {
                    DEXUtil.css(the.element, 'right', '');
                }
            }

            _hide();
        }
    }

    var _createOverlay = function() {
        if ( _getOption('overlay') === true ) {
            the.overlayElement = document.createElement('DIV');

            DEXUtil.css(the.overlayElement, 'z-index', DEXUtil.css(the.element, 'z-index') - 1); // update

            document.body.append(the.overlayElement);

            DEXUtil.addClass(the.overlayElement, _getOption('overlay-class'));

            DEXUtil.addEvent(the.overlayElement, 'click', function(e) {
                e.preventDefault();
                _hide();
            });
        }
    }

    var _deleteOverlay = function() {
        if ( the.overlayElement !== null ) {
            DEXUtil.remove(the.overlayElement);
        }
    }

    var _getOption = function(name) {
        if ( the.element.hasAttribute('data-dex-drawer-' + name) === true ) {
            var attr = the.element.getAttribute('data-dex-drawer-' + name);
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

    var _getWidth = function() {
        var width = _getOption('width');

        if ( width === 'auto') {
            width = DEXUtil.css(the.element, 'width');
        }

        return width;
    }

    var _destroy = function() {
        DEXUtil.data(the.element).remove('drawer');
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

    the.show = function() {
        return _show();
    }

    the.hide = function() {
        return _hide();
    }

    the.isShown = function() {
        return the.shown;
    }

    the.update = function() {
        _update();
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
DEXDrawer.getInstance = function(element) {
    if (element !== null && DEXUtil.data(element).has('drawer')) {
        return DEXUtil.data(element).get('drawer');
    } else {
        return null;
    }
}

// Hide all drawers and skip one if provided
DEXDrawer.hideAll = function(skip = null, selector = '[data-dex-drawer="true"]') {
    var items = document.querySelectorAll(selector);

    if (items && items.length > 0) {
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var drawer = DEXDrawer.getInstance(item);

            if (!drawer) {
                continue;
            }

            if ( skip ) {
                if ( item !== skip ) {
                    drawer.hide();
                }
            } else {
                drawer.hide();
            }
        }
    }
}

// Update all drawers
DEXDrawer.updateAll = function(selector = '[data-dex-drawer="true"]') {
    var items = document.querySelectorAll(selector);

    if (items && items.length > 0) {
        for (var i = 0, len = items.length; i < len; i++) {
            var drawer = DEXDrawer.getInstance(items[i]);

            if (drawer) {
                drawer.update();
            }
        }
    }
}

// Create instances
DEXDrawer.createInstances = function(selector = '[data-dex-drawer="true"]') {
    // Initialize Menus
    var elements = document.querySelectorAll(selector);

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            new DEXDrawer(elements[i]);
        }
    }
}

// Toggle instances
DEXDrawer.handleShow = function() {
    // External drawer toggle handler
    DEXUtil.on(document.body,  '[data-dex-drawer-show="true"][data-dex-drawer-target]', 'click', function(e) {
        e.preventDefault();
        
        var element = document.querySelector(this.getAttribute('data-dex-drawer-target'));

        if (element) {
            DEXDrawer.getInstance(element).show();
        } 
    });
}

// Dismiss instances
DEXDrawer.handleDismiss = function() {
    // External drawer toggle handler
    DEXUtil.on(document.body,  '[data-dex-drawer-dismiss="true"]', 'click', function(e) {
        var element = this.closest('[data-dex-drawer="true"]');

        if (element) {
            var drawer = DEXDrawer.getInstance(element);
            if (drawer.isShown()) {
                drawer.hide();
            }
        } 
    });
}

// Handle resize
DEXDrawer.handleResize = function() {
    // Window resize Handling
    window.addEventListener('resize', function() {
        var timer;

        DEXUtil.throttle(timer, function() {
            // Locate and update drawer instances on window resize
            var elements = document.querySelectorAll('[data-dex-drawer="true"]');

            if ( elements && elements.length > 0 ) {
                for (var i = 0, len = elements.length; i < len; i++) {
                    var drawer = DEXDrawer.getInstance(elements[i]);
                    if (drawer) {
                        drawer.update();
                    }
                }
            }
        }, 200);
    });
}

// Global initialization
DEXDrawer.init = function() {
    DEXDrawer.createInstances();
    DEXDrawer.handleResize();
    DEXDrawer.handleShow();
    DEXDrawer.handleDismiss();
};


// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = DEXDrawer;
}