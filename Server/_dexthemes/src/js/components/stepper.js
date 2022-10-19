"use strict";

// Class definition
var DEXStepper = function(element, options) {
    //////////////////////////////
    // ** Private variables  ** //
    //////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default Options
    var defaultOptions = {
        startIndex: 1,
        animation: false,
        animationSpeed: '0.3s',
        animationNextClass: 'animate__animated animate__slideInRight animate__fast',
        animationPreviousClass: 'animate__animated animate__slideInLeft animate__fast'
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( DEXUtil.data(element).has('stepper') === true ) {
            the = DEXUtil.data(element).get('stepper');
        } else {
            _init();
        }
    }

    var _init = function() {
        the.options = DEXUtil.deepExtend({}, defaultOptions, options);
        the.uid = DEXUtil.getUniqueId('stepper');

        the.element = element;

        // Set initialized
        the.element.setAttribute('data-dex-stepper', 'true');

        // Elements
        the.steps = DEXUtil.findAll(the.element, '[data-dex-stepper-element="nav"]');
        the.btnNext = DEXUtil.find(the.element, '[data-dex-stepper-action="next"]');
        the.btnPrevious = DEXUtil.find(the.element, '[data-dex-stepper-action="previous"]');
        the.btnSubmit = DEXUtil.find(the.element, '[data-dex-stepper-action="submit"]');

        // Variables
        the.totalStepsNumber = the.steps.length;
        the.passedStepIndex = 0;
        the.currentStepIndex = 1;
        the.clickedStepIndex = 0;

        // Set Current Step
        if ( the.options.startIndex > 1 ) {
            _goTo(the.options.startIndex);
        }

        // Event Handlers
        DEXUtil.addEvent(the.btnNext, 'click', function(e) {
            e.preventDefault();

            DEXEventHandler.trigger(the.element, 'kt.stepper.next', the);
        });

        DEXUtil.addEvent(the.btnPrevious, 'click', function(e) {
            e.preventDefault();

            DEXEventHandler.trigger(the.element, 'kt.stepper.previous', the);
        });

        DEXUtil.on(the.element, '[data-dex-stepper-action="step"]', 'click', function(e) {
            e.preventDefault();

            if ( the.steps && the.steps.length > 0 ) {
                for (var i = 0, len = the.steps.length; i < len; i++) {
                    if ( the.steps[i] === this ) {
                        the.clickedStepIndex = i + 1;

                        DEXEventHandler.trigger(the.element, 'kt.stepper.click', the);

                        return;
                    }
                }
            }
        });

        // Bind Instance
        DEXUtil.data(the.element).set('stepper', the);
    }

    var _goTo = function(index) {
        // Trigger "change" event
        DEXEventHandler.trigger(the.element, 'kt.stepper.change', the);

        // Skip if this step is already shown
        if ( index === the.currentStepIndex || index > the.totalStepsNumber || index < 0 ) {
            return;
        }

        // Validate step number
        index = parseInt(index);

        // Set current step
        the.passedStepIndex = the.currentStepIndex;
        the.currentStepIndex = index;

        // Refresh elements
        _refreshUI();

        // Trigger "changed" event
        DEXEventHandler.trigger(the.element, 'kt.stepper.changed', the);

        return the;
    }

    var _goNext = function() {
        return _goTo( _getNextStepIndex() );
    }

    var _goPrevious = function() {
        return _goTo( _getPreviousStepIndex() );
    }

    var _goLast = function() {
        return _goTo( _getLastStepIndex() );
    }

    var _goFirst = function() {
        return _goTo( _getFirstStepIndex() );
    }

    var _refreshUI = function() {
        var state = '';

        if ( _isLastStep() ) {
            state = 'last';
        } else if ( _isFirstStep() ) {
            state = 'first';
        } else {
            state = 'between';
        }

        // Set state class
        DEXUtil.removeClass(the.element, 'last');
        DEXUtil.removeClass(the.element, 'first');
        DEXUtil.removeClass(the.element, 'between');

        DEXUtil.addClass(the.element, state);

        // Step Items
        var elements = DEXUtil.findAll(the.element, '[data-dex-stepper-element="nav"], [data-dex-stepper-element="content"], [data-dex-stepper-element="info"]');

        if ( elements && elements.length > 0 ) {
            for (var i = 0, len = elements.length; i < len; i++) {
                var element = elements[i];
                var index = DEXUtil.index(element) + 1;

                DEXUtil.removeClass(element, 'current');
                DEXUtil.removeClass(element, 'completed');
                DEXUtil.removeClass(element, 'pending');

                if ( index == the.currentStepIndex ) {
                    DEXUtil.addClass(element, 'current');

                    if ( the.options.animation !== false && element.getAttribute('data-dex-stepper-element') == 'content' ) {
                        DEXUtil.css(element, 'animationDuration', the.options.animationSpeed);

                        var animation = _getStepDirection(the.passedStepIndex) === 'previous' ?  the.options.animationPreviousClass : the.options.animationNextClass;
                        DEXUtil.animateClass(element, animation);
                    }
                } else {
                    if ( index < the.currentStepIndex ) {
                        DEXUtil.addClass(element, 'completed');
                    } else {
                        DEXUtil.addClass(element, 'pending');
                    }
                }
            }
        }
    }

    var _isLastStep = function() {
        return the.currentStepIndex === the.totalStepsNumber;
    }

    var _isFirstStep = function() {
        return the.currentStepIndex === 1;
    }

    var _isBetweenStep = function() {
        return _isLastStep() === false && _isFirstStep() === false;
    }

    var _getNextStepIndex = function() {
        if ( the.totalStepsNumber >= ( the.currentStepIndex + 1 ) ) {
            return the.currentStepIndex + 1;
        } else {
            return the.totalStepsNumber;
        }
    }

    var _getPreviousStepIndex = function() {
        if ( ( the.currentStepIndex - 1 ) > 1 ) {
            return the.currentStepIndex - 1;
        } else {
            return 1;
        }
    }

    var _getFirstStepIndex = function(){
        return 1;
    }

    var _getLastStepIndex = function() {
        return the.totalStepsNumber;
    }

    var _getTotalStepsNumber = function() {
        return the.totalStepsNumber;
    }

    var _getStepDirection = function(index) {
        if ( index > the.currentStepIndex ) {
            return 'next';
        } else {
            return 'previous';
        }
    }

    var _getStepContent = function(index) {
        var content = DEXUtil.findAll(the.element, '[data-dex-stepper-element="content"]');

        if ( content[index-1] ) {
            return content[index-1];
        } else {
            return false;
        }
    }

    var _destroy = function() {
        DEXUtil.data(the.element).remove('stepper');
    }

    // Construct Class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.getElement = function(index) {
        return the.element;
    }

    the.goTo = function(index) {
        return _goTo(index);
    }

    the.goPrevious = function() {
        return _goPrevious();
    }

    the.goNext = function() {
        return _goNext();
    }

    the.goFirst = function() {
        return _goFirst();
    }

    the.goLast = function() {
        return _goLast();
    }

    the.getCurrentStepIndex = function() {
        return the.currentStepIndex;
    }

    the.getNextStepIndex = function() {
        return the.nextStepIndex;
    }

    the.getPassedStepIndex = function() {
        return the.passedStepIndex;
    }

    the.getClickedStepIndex = function() {
        return the.clickedStepIndex;
    }

    the.getPreviousStepIndex = function() {
        return the.PreviousStepIndex;
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
DEXStepper.getInstance = function(element) {
    if ( element !== null && DEXUtil.data(element).has('stepper') ) {
        return DEXUtil.data(element).get('stepper');
    } else {
        return null;
    }
}

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = DEXStepper;
}
