"use strict";

// Class definition
var DEXLayoutSearch = function() {
    // Private variables
    var element;
    var formElement;
    var mainElement;
    var resultsElement;
    var wrapperElement;
    var emptyElement;

    var preferencesElement;
    var preferencesShowElement;
    var preferencesDismissElement;
    
    var advancedOptionsFormElement;
    var advancedOptionsFormShowElement;
    var advancedOptionsFormCancelElement;
    var advancedOptionsFormSearchElement;
    
    var searchObject;

    // Private functions
    var processs = function(search) {
        var timeout = setTimeout(function() {
            var number = DEXUtil.getRandomInt(1, 3);

            // Hide recently viewed
            mainElement.classList.add('d-none');

            if (number === 3) {
                // Hide results
                resultsElement.classList.add('d-none');
                // Show empty message 
                emptyElement.classList.remove('d-none');
            } else {
                // Show results
                resultsElement.classList.remove('d-none');
                // Hide empty message 
                emptyElement.classList.add('d-none');
            }                  

            // Complete search
            search.complete();
        }, 1500);
    }

    var clear = function(search) {
        // Show recently viewed
        mainElement.classList.remove('d-none');
        // Hide results
        resultsElement.classList.add('d-none');
        // Hide empty message 
        emptyElement.classList.add('d-none');
    }    

    var handlePreferences = function() {
        // Preference show handler
        preferencesShowElement.addEventListener('click', function() {
            wrapperElement.classList.add('d-none');
            preferencesElement.classList.remove('d-none');
        });

        // Preference dismiss handler
        preferencesDismissElement.addEventListener('click', function() {
            wrapperElement.classList.remove('d-none');
            preferencesElement.classList.add('d-none');
        });
    }

    var handleAdvancedOptionsForm = function() {
        // Show
        advancedOptionsFormShowElement.addEventListener('click', function() {
            wrapperElement.classList.add('d-none');
            advancedOptionsFormElement.classList.remove('d-none');
        });

        // Cancel
        advancedOptionsFormCancelElement.addEventListener('click', function() {
            wrapperElement.classList.remove('d-none');
            advancedOptionsFormElement.classList.add('d-none');
        });

        // Search
        advancedOptionsFormSearchElement.addEventListener('click', function() {
            
        });
    }

    // Public methods
	return {
		init: function() {
            // Elements
            element = document.querySelector('#dex_header_search');

            if (!element) {
                return;
            }

            wrapperElement = element.querySelector('[data-dex-search-element="wrapper"]');
            formElement = element.querySelector('[data-dex-search-element="form"]');
            mainElement = element.querySelector('[data-dex-search-element="main"]');
            resultsElement = element.querySelector('[data-dex-search-element="results"]');
            emptyElement = element.querySelector('[data-dex-search-element="empty"]');

            preferencesElement = element.querySelector('[data-dex-search-element="preferences"]');
            preferencesShowElement = element.querySelector('[data-dex-search-element="preferences-show"]');
            preferencesDismissElement = element.querySelector('[data-dex-search-element="preferences-dismiss"]');

            advancedOptionsFormElement = element.querySelector('[data-dex-search-element="advanced-options-form"]');
            advancedOptionsFormShowElement = element.querySelector('[data-dex-search-element="advanced-options-form-show"]');
            advancedOptionsFormCancelElement = element.querySelector('[data-dex-search-element="advanced-options-form-cancel"]');
            advancedOptionsFormSearchElement = element.querySelector('[data-dex-search-element="advanced-options-form-search"]');
            
            // Initialize search handler
            searchObject = new DEXSearch(element);

            // Search handler
            searchObject.on('kt.search.process', processs);

            // Clear handler
            searchObject.on('kt.search.clear', clear);

            // Custom handlers
            handlePreferences();
            handleAdvancedOptionsForm();            
		}
	};
}();
