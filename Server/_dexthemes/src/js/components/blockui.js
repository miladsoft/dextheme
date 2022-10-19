"use strict";

// Class definition
var DEXBlockUI = function(element, options) {
    //////////////////////////////
    // ** Private variables  ** //
    //////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default options
    var defaultOptions = {
        zIndex: false,
        overlayClass: '',
        overflow: 'hidden',
        message: '<span class="spinner-border text-primary"></span>'
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( DEXUtil.data(element).has('blockui') ) {
            the = DEXUtil.data(element).get('blockui');
        } else {
            _init();
        }
    }

    var _init = function() {
        // Variables
        the.options = DEXUtil.deepExtend({}, defaultOptions, options);
        the.element = element;
        the.overlayElement = null;
        the.blocked = false;
        the.positionChanged = false;
        the.overflowChanged = false;

        // Bind Instance
        DEXUtil.data(the.element).set('blockui', the);
    }

    var _block = function() {
        if ( DEXEventHandler.trigger(the.element, 'kt.blockui.block', the) === false ) {
            return;
        }

        var isPage = (the.element.tagName === 'BODY');
       
        var position = DEXUtil.css(the.element, 'position');
        var overflow = DEXUtil.css(the.element, 'overflow');
        var zIndex = isPage ? 10000 : 1;

        if (the.options.zIndex > 0) {
            zIndex = the.options.zIndex;
        } else {
            if (DEXUtil.css(the.element, 'z-index') != 'auto') {
                zIndex = DEXUtil.css(the.element, 'z-index');
            }
        }

        the.element.classList.add('blockui');

        if (position === "absolute" || position === "relative" || position === "fixed") {
            DEXUtil.css(the.element, 'position', 'relative');
            the.positionChanged = true;
        }

        if (the.options.overflow === 'hidden' && overflow === 'visible') {           
            DEXUtil.css(the.element, 'overflow', 'hidden');
            the.overflowChanged = true;
        }

        the.overlayElement = document.createElement('DIV');    
        the.overlayElement.setAttribute('class', 'blockui-overlay ' + the.options.overlayClass);
        
        the.overlayElement.innerHTML = the.options.message;

        DEXUtil.css(the.overlayElement, 'z-index', zIndex);

        the.element.append(the.overlayElement);
        the.blocked = true;

        DEXEventHandler.trigger(the.element, 'kt.blockui.after.blocked', the)
    }

    var _release = function() {
        if ( DEXEventHandler.trigger(the.element, 'kt.blockui.release', the) === false ) {
            return;
        }

        the.element.classList.add('blockui');
        
        if (the.positionChanged) {
            DEXUtil.css(the.element, 'position', '');
        }

        if (the.overflowChanged) {
            DEXUtil.css(the.element, 'overflow', '');
        }

        if (the.overlayElement) {
            DEXUtil.remove(the.overlayElement);
        }        

        the.blocked = false;

        DEXEventHandler.trigger(the.element, 'kt.blockui.released', the);
    }

    var _isBlocked = function() {
        return the.blocked;
    }

    var _destroy = function() {
        DEXUtil.data(the.element).remove('blockui');
    }

    // Construct class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.block = function() {
        _block();
    }

    the.release = function() {
        _release();
    }

    the.isBlocked = function() {
        return _isBlocked();
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
DEXBlockUI.getInstance = function(element) {
    if (element !== null && DEXUtil.data(element).has('blockui')) {
        return DEXUtil.data(element).get('blockui');
    } else {
        return null;
    }
}

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = DEXBlockUI;
}