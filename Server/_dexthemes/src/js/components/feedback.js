"use strict";

// Class definition
var DEXFeedback = function(options) {
    ////////////////////////////
    // ** Private Variables  ** //
    ////////////////////////////
    var the = this;

    // Default options
    var defaultOptions = {
        'width' : 100,
        'placement' : 'top-center',
        'content' : '',
        'type': 'popup'
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        _init();
    }

    var _init = function() {
        // Variables
        the.options = DEXUtil.deepExtend({}, defaultOptions, options);
        the.uid = DEXUtil.getUniqueId('feedback');
        the.element;
        the.shown = false;

        // Event Handlers
        _handlers();

        // Bind Instance
        DEXUtil.data(the.element).set('feedback', the);
    }

    var _handlers = function() {
        DEXUtil.addEvent(the.element, 'click', function(e) {
            e.preventDefault();

            _go();
        });
    }

    var _show = function() {
        if ( DEXEventHandler.trigger(the.element, 'kt.feedback.show', the) === false ) {
            return;
        }

        if ( the.options.type === 'popup') {
            _showPopup();
        }

        DEXEventHandler.trigger(the.element, 'kt.feedback.shown', the);

        return the;
    }

    var _hide = function() {
        if ( DEXEventHandler.trigger(the.element, 'kt.feedback.hide', the) === false ) {
            return;
        }

        if ( the.options.type === 'popup') {
            _hidePopup();
        }

        the.shown = false;

        DEXEventHandler.trigger(the.element, 'kt.feedback.hidden', the);

        return the;
    }

    var _showPopup = function() {
        the.element = document.createElement("DIV");

        DEXUtil.addClass(the.element, 'feedback feedback-popup');
        DEXUtil.setHTML(the.element, the.options.content);

        if (the.options.placement == 'top-center') {
            _setPopupTopCenterPosition();
        }

        document.body.appendChild(the.element);

        DEXUtil.addClass(the.element, 'feedback-shown');

        the.shown = true;
    }

    var _setPopupTopCenterPosition = function() {
        var width = DEXUtil.getResponsiveValue(the.options.width);
        var height = DEXUtil.css(the.element, 'height');

        DEXUtil.addClass(the.element, 'feedback-top-center');

        DEXUtil.css(the.element, 'width', width);
        DEXUtil.css(the.element, 'left', '50%');
        DEXUtil.css(the.element, 'top', '-' + height);
    }

    var _hidePopup = function() {
        the.element.remove();
    }

    var _destroy = function() {
        DEXUtil.data(the.element).remove('feedback');
    }

    // Construct class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.show = function() {
        return _show();
    }

    the.hide = function() {
        return _hide();
    }

    the.isShown = function() {
        return the.shown;
    }

    the.getElement = function() {
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

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = DEXFeedback;
}
