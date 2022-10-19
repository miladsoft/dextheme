"use strict";

// Class definition
var DEXImageInput = function(element, options) {
    ////////////////////////////
    // ** Private Variables  ** //
    ////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default Options
    var defaultOptions = {
        
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( DEXUtil.data(element).has('image-input') === true ) {
            the = DEXUtil.data(element).get('image-input');
        } else {
            _init();
        }
    }

    var _init = function() {
        // Variables
        the.options = DEXUtil.deepExtend({}, defaultOptions, options);
        the.uid = DEXUtil.getUniqueId('image-input');

        // Elements
        the.element = element;
        the.inputElement = DEXUtil.find(element, 'input[type="file"]');
        the.wrapperElement = DEXUtil.find(element, '.image-input-wrapper');
        the.cancelElement = DEXUtil.find(element, '[data-dex-image-input-action="cancel"]');
        the.removeElement = DEXUtil.find(element, '[data-dex-image-input-action="remove"]');
        the.hiddenElement = DEXUtil.find(element, 'input[type="hidden"]');
        the.src = DEXUtil.css(the.wrapperElement, 'backgroundImage');

        // Set initialized
        the.element.setAttribute('data-dex-image-input', 'true');

        // Event Handlers
        _handlers();

        // Bind Instance
        DEXUtil.data(the.element).set('image-input', the);
    }

    // Init Event Handlers
    var _handlers = function() {
        DEXUtil.addEvent(the.inputElement, 'change', _change);
        DEXUtil.addEvent(the.cancelElement, 'click', _cancel);
        DEXUtil.addEvent(the.removeElement, 'click', _remove);
    }

    // Event Handlers
    var _change = function(e) {
        e.preventDefault();

        if ( the.inputElement !== null && the.inputElement.files && the.inputElement.files[0] ) {
            // Fire change event
            if ( DEXEventHandler.trigger(the.element, 'kt.imageinput.change', the) === false ) {
                return;
            }

            var reader = new FileReader();

            reader.onload = function(e) {
                DEXUtil.css(the.wrapperElement, 'background-image', 'url('+ e.target.result +')');
            }

            reader.readAsDataURL(the.inputElement.files[0]);

            the.element.classList.add('image-input-changed');
            the.element.classList.remove('image-input-empty');

            // Fire removed event
            DEXEventHandler.trigger(the.element, 'kt.imageinput.changed', the);
        }
    }

    var _cancel = function(e) {
        e.preventDefault();

        // Fire cancel event
        if ( DEXEventHandler.trigger(the.element, 'kt.imageinput.cancel', the) === false ) {
            return;
        }

        the.element.classList.remove('image-input-changed');
        the.element.classList.remove('image-input-empty');

        if (the.src === 'none') {   
            DEXUtil.css(the.wrapperElement, 'background-image', '');
            the.element.classList.add('image-input-empty');
        } else {
            DEXUtil.css(the.wrapperElement, 'background-image', the.src);
        }
        
        the.inputElement.value = "";

        if ( the.hiddenElement !== null ) {
            the.hiddenElement.value = "0";
        }

        // Fire canceled event
        DEXEventHandler.trigger(the.element, 'kt.imageinput.canceled', the);
    }

    var _remove = function(e) {
        e.preventDefault();

        // Fire remove event
        if ( DEXEventHandler.trigger(the.element, 'kt.imageinput.remove', the) === false ) {
            return;
        }

        the.element.classList.remove('image-input-changed');
        the.element.classList.add('image-input-empty');

        DEXUtil.css(the.wrapperElement, 'background-image', "none");
        the.inputElement.value = "";

        if ( the.hiddenElement !== null ) {
            the.hiddenElement.value = "1";
        }

        // Fire removed event
        DEXEventHandler.trigger(the.element, 'kt.imageinput.removed', the);
    }

    var _destroy = function() {
        DEXUtil.data(the.element).remove('image-input');
    }

    // Construct Class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.getInputElement = function() {
        return the.inputElement;
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
DEXImageInput.getInstance = function(element) {
    if ( element !== null && DEXUtil.data(element).has('image-input') ) {
        return DEXUtil.data(element).get('image-input');
    } else {
        return null;
    }
}

// Create instances
DEXImageInput.createInstances = function(selector = '[data-dex-image-input]') {
    // Initialize Menus
    var elements = document.querySelectorAll(selector);

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            new DEXImageInput(elements[i]);
        }
    }
}

// Global initialization
DEXImageInput.init = function() {
    DEXImageInput.createInstances();
};


// Webpack Support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = DEXImageInput;
}
