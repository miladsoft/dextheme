"use strict";

// Class definition
var DEXMenu = function(element, options) {
    ////////////////////////////
    // ** Private Variables  ** //
    ////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default Options
    var defaultOptions = {
        dropdown: {
            hoverTimeout: 200,
            zindex: 105
        },

        accordion: {
            slideSpeed: 250,
            expand: false
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( DEXUtil.data(element).has('menu') === true ) {
            the = DEXUtil.data(element).get('menu');
        } else {
            _init();
        }
    }

    var _init = function() {
        the.options = DEXUtil.deepExtend({}, defaultOptions, options);
        the.uid = DEXUtil.getUniqueId('menu');
        the.element = element;
        the.triggerElement;
        the.disabled = false;

        // Set initialized
        the.element.setAttribute('data-dex-menu', 'true');

        _setTriggerElement();
        _update();

        DEXUtil.data(the.element).set('menu', the);
    }

    var _destroy = function() {  // todo

    }

    // Event Handlers
    // Toggle handler
    var _click = function(element, e) {
        e.preventDefault();

        if (the.disabled === true) {
            return;
        }

        var item = _getItemElement(element);

        if ( _getOptionFromElementAttribute(item, 'trigger') !== 'click' ) {
            return;
        }

        if ( _getOptionFromElementAttribute(item, 'toggle') === false ) {
            _show(item);
        } else {
            _toggle(item);
        }
    }

    // Link handler
    var _link = function(element, e) {
        if (the.disabled === true) {
            return;
        }
        
        if ( DEXEventHandler.trigger(the.element, 'kt.menu.link.click', element) === false )  {
            return;
        }

        // Dismiss all shown dropdowns
        DEXMenu.hideDropdowns();

        DEXEventHandler.trigger(the.element, 'kt.menu.link.clicked', element);
    }

    // Dismiss handler
    var _dismiss = function(element, e) {
        var item = _getItemElement(element);
        var items = _getItemChildElements(item);

        if ( item !== null && _getItemSubType(item) === 'dropdown') {
            _hide(item); // hide items dropdown
            // Hide all child elements as well
            
            if ( items.length > 0 ) {
                for (var i = 0, len = items.length; i < len; i++) {
                    if ( items[i] !== null &&  _getItemSubType(items[i]) === 'dropdown') {
                        _hide(tems[i]);
                    }
                }
            }
        }
    }

    // Mouseover handle
    var _mouseover = function(element, e) {
        var item = _getItemElement(element);

        if (the.disabled === true) {
            return;
        }

        if ( item === null ) {
            return;
        }

        if ( _getOptionFromElementAttribute(item, 'trigger') !== 'hover' ) {
            return;
        }

        if ( DEXUtil.data(item).get('hover') === '1' ) {
            clearTimeout(DEXUtil.data(item).get('timeout'));
            DEXUtil.data(item).remove('hover');
            DEXUtil.data(item).remove('timeout');
        }

        _show(item);
    }

    // Mouseout handle
    var _mouseout = function(element, e) {
        var item = _getItemElement(element);

        if (the.disabled === true) {
            return;
        }

        if ( item === null ) {
            return;
        }

        if ( _getOptionFromElementAttribute(item, 'trigger') !== 'hover' ) {
            return;
        }

        var timeout = setTimeout(function() {
            if ( DEXUtil.data(item).get('hover') === '1' ) {
                _hide(item);
            }
        }, the.options.dropdown.hoverTimeout);

        DEXUtil.data(item).set('hover', '1');
        DEXUtil.data(item).set('timeout', timeout);
    }

    // Toggle item sub
    var _toggle = function(item) {
        if ( !item ) {
            item = the.triggerElement;
        }

        if ( _isItemSubShown(item) === true ) {
            _hide(item);
        } else {
            _show(item);
        }
    }

    // Show item sub
    var _show = function(item) {
        if ( !item ) {
            item = the.triggerElement;
        }

        if ( _isItemSubShown(item) === true ) {
            return;
        }

        if ( _getItemSubType(item) === 'dropdown' ) {
            _showDropdown(item); // // show current dropdown
        } else if ( _getItemSubType(item) === 'accordion' ) {
            _showAccordion(item);
        }

        // Remember last submenu type
        DEXUtil.data(item).set('type', _getItemSubType(item));  // updated
    }

    // Hide item sub
    var _hide = function(item) {
        if ( !item ) {
            item = the.triggerElement;
        }

        if ( _isItemSubShown(item) === false ) {
            return;
        }
        
        if ( _getItemSubType(item) === 'dropdown' ) {
            _hideDropdown(item);
        } else if ( _getItemSubType(item) === 'accordion' ) {
            _hideAccordion(item);
        }
    }

    // Reset item state classes if item sub type changed
    var _reset = function(item) {        
        if ( _hasItemSub(item) === false ) {
            return;
        }

        var sub = _getItemSubElement(item);

        // Reset sub state if sub type is changed during the window resize
        if ( DEXUtil.data(item).has('type') && DEXUtil.data(item).get('type') !== _getItemSubType(item) ) {  // updated
            DEXUtil.removeClass(item, 'hover'); 
            DEXUtil.removeClass(item, 'show'); 
            DEXUtil.removeClass(sub, 'show'); 
        }  // updated
    }

    // Update all item state classes if item sub type changed
    var _update = function() {
        var items = the.element.querySelectorAll('.menu-item[data-dex-menu-trigger]');

        if ( items && items.length > 0 ) {
            for (var i = 0, len = items.length; i < len; i++) {
                _reset(items[i]);
            }
        }
    }

    // Set external trigger element
    var _setTriggerElement = function() {
        var target = document.querySelector('[data-dex-menu-target="# ' + the.element.getAttribute('id')  + '"]');

        if ( target !== null ) {
            the.triggerElement = target;
        } else if ( the.element.closest('[data-dex-menu-trigger]') ) {
            the.triggerElement = the.element.closest('[data-dex-menu-trigger]');
        } else if ( the.element.parentNode && DEXUtil.child(the.element.parentNode, '[data-dex-menu-trigger]')) {
            the.triggerElement = DEXUtil.child(the.element.parentNode, '[data-dex-menu-trigger]');
        }

        if ( the.triggerElement ) {
            DEXUtil.data(the.triggerElement).set('menu', the);
        }
    }

    // Test if menu has external trigger element
    var _isTriggerElement = function(item) {
        return ( the.triggerElement === item ) ? true : false;
    }

    // Test if item's sub is shown
    var _isItemSubShown = function(item) {
        var sub = _getItemSubElement(item);

        if ( sub !== null ) {
            if ( _getItemSubType(item) === 'dropdown' ) {
                if ( DEXUtil.hasClass(sub, 'show') === true && sub.hasAttribute('data-popper-placement') === true ) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return DEXUtil.hasClass(item, 'show');
            }
        } else {
            return false;
        }
    }

    // Test if item dropdown is permanent
    var _isItemDropdownPermanent = function(item) {
        return _getOptionFromElementAttribute(item, 'permanent') === true ? true : false;
    }

    // Test if item's parent is shown
    var _isItemParentShown = function(item) {
        return DEXUtil.parents(item, '.menu-item.show').length > 0;
    }

    // Test of it is item sub element
    var _isItemSubElement = function(item) {
        return DEXUtil.hasClass(item, 'menu-sub');
    }

    // Test if item has sub
    var _hasItemSub = function(item) {
        return (DEXUtil.hasClass(item, 'menu-item') && item.hasAttribute('data-dex-menu-trigger'));
    }

    // Get link element
    var _getItemLinkElement = function(item) {
        return DEXUtil.child(item, '.menu-link');
    }

    // Get toggle element
    var _getItemToggleElement = function(item) {
        if ( the.triggerElement ) {
            return the.triggerElement;
        } else {
            return _getItemLinkElement(item);
        }
    }

    // Get item sub element
    var _getItemSubElement = function(item) {
        if ( _isTriggerElement(item) === true ) {
            return the.element;
        } if ( item.classList.contains('menu-sub') === true ) {
            return item;
        } else if ( DEXUtil.data(item).has('sub') ) {
            return DEXUtil.data(item).get('sub');
        } else {
            return DEXUtil.child(item, '.menu-sub');
        }
    }

    // Get item sub type
    var _getItemSubType = function(element) {
        var sub = _getItemSubElement(element);

        if ( sub && parseInt(DEXUtil.css(sub, 'z-index')) > 0 ) {
            return "dropdown";
        } else {
            return "accordion";
        }
    }

    // Get item element
    var _getItemElement = function(element) {
        var item, sub;

        // Element is the external trigger element
        if (_isTriggerElement(element) ) {
            return element;
        }   

        // Element has item toggler attribute
        if ( element.hasAttribute('data-dex-menu-trigger') ) {
            return element;
        }

        // Element has item DOM reference in it's data storage
        if ( DEXUtil.data(element).has('item') ) {
            return DEXUtil.data(element).get('item');
        }

        // Item is parent of element
        if ( (item = element.closest('.menu-item[data-dex-menu-trigger]')) ) {
            return item;
        }

        // Element's parent has item DOM reference in it's data storage
        if ( (sub = element.closest('.menu-sub')) ) {
            if ( DEXUtil.data(sub).has('item') === true ) {
                return DEXUtil.data(sub).get('item')
            } 
        }
    }

    // Get item parent element
    var _getItemParentElement = function(item) {  
        var sub = item.closest('.menu-sub');
        var parentItem;

        if ( DEXUtil.data(sub).has('item') ) {
            return DEXUtil.data(sub).get('item');
        }

        if ( sub && (parentItem = sub.closest('.menu-item[data-dex-menu-trigger]')) ) {
            return parentItem;
        }

        return null;
    }

    // Get item parent elements
    var _getItemParentElements = function(item) {
        var parents = [];
        var parent;
        var i = 0;

        do {
            parent = _getItemParentElement(item);
            
            if ( parent ) {
                parents.push(parent);
                item = parent;
            }           

            i++;
        } while (parent !== null && i < 20);

        if ( the.triggerElement ) {
            parents.unshift(the.triggerElement);
        }

        return parents;
    }

    // Get item child element
    var _getItemChildElement = function(item) {
        var selector = item;
        var element;

        if ( DEXUtil.data(item).get('sub') ) {
            selector = DEXUtil.data(item).get('sub');
        }

        if ( selector !== null ) {
            //element = selector.querySelector('.show.menu-item[data-dex-menu-trigger]');
            element = selector.querySelector('.menu-item[data-dex-menu-trigger]');

            if ( element ) {
                return element;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }   
    
    // Get item child elements
    var _getItemChildElements = function(item) {
        var children = [];
        var child;
        var i = 0;

        do {
            child = _getItemChildElement(item);
            
            if ( child ) {
                children.push(child);
                item = child;
            }           

            i++;
        } while (child !== null && i < 20);

        return children;
    }

    // Show item dropdown
    var _showDropdown = function(item) {
        // Handle dropdown show event
        if ( DEXEventHandler.trigger(the.element, 'kt.menu.dropdown.show', item) === false )  {
            return;
        }

        // Hide all currently shown dropdowns except current one
        DEXMenu.hideDropdowns(item); 

        var toggle = _isTriggerElement(item) ? item : _getItemLinkElement(item);
        var sub = _getItemSubElement(item);

        var width = _getOptionFromElementAttribute(item, 'width');
        var height = _getOptionFromElementAttribute(item, 'height');

        var zindex = the.options.dropdown.zindex; // update
        var parentZindex = DEXUtil.getHighestZindex(item); // update

        // Apply a new z-index if dropdown's toggle element or it's parent has greater z-index // update
        if ( parentZindex !== null && parentZindex >= zindex ) {
            zindex = parentZindex + 1;
        }

        if ( zindex > 0 ) {
            DEXUtil.css(sub, 'z-index', zindex);
        }

        if ( width !== null ) {
            DEXUtil.css(sub, 'width', width);
        }

        if ( height !== null ) {
            DEXUtil.css(sub, 'height', height);
        }

        DEXUtil.css(sub, 'display', '');
        DEXUtil.css(sub, 'overflow', '');

        // Init popper(new)
        _initDropdownPopper(item, sub); 

        DEXUtil.addClass(item, 'show');
        DEXUtil.addClass(item, 'menu-dropdown');
        DEXUtil.addClass(sub, 'show');

        // Append the sub the the root of the menu
        if ( _getOptionFromElementAttribute(item, 'overflow') === true ) {
            document.body.appendChild(sub);
            DEXUtil.data(item).set('sub', sub);
            DEXUtil.data(sub).set('item', item);
            DEXUtil.data(sub).set('menu', the);
        } else {
            DEXUtil.data(sub).set('item', item);
        }

        // Handle dropdown shown event
        DEXEventHandler.trigger(the.element, 'kt.menu.dropdown.shown', item);
    }

    // Hide item dropdown
    var _hideDropdown = function(item) {
        // Handle dropdown hide event
        if ( DEXEventHandler.trigger(the.element, 'kt.menu.dropdown.hide', item) === false )  {
            return;
        }

        var sub = _getItemSubElement(item);

        DEXUtil.css(sub, 'z-index', '');
        DEXUtil.css(sub, 'width', '');
        DEXUtil.css(sub, 'height', '');

        DEXUtil.removeClass(item, 'show');
        DEXUtil.removeClass(item, 'menu-dropdown');
        DEXUtil.removeClass(sub, 'show');

        // Append the sub back to it's parent
        if ( _getOptionFromElementAttribute(item, 'overflow') === true ) {
            if (item.classList.contains('menu-item')) {
                item.appendChild(sub);
            } else {
                DEXUtil.insertAfter(the.element, item);
            }
            
            DEXUtil.data(item).remove('sub');
            DEXUtil.data(sub).remove('item');
            DEXUtil.data(sub).remove('menu');
        } 

        // Destroy popper(new)
        _destroyDropdownPopper(item);
        
        // Handle dropdown hidden event 
        DEXEventHandler.trigger(the.element, 'kt.menu.dropdown.hidden', item);
    }

    // Init dropdown popper(new)
    var _initDropdownPopper = function(item, sub) {
        // Setup popper instance
        var reference;
        var attach = _getOptionFromElementAttribute(item, 'attach');

        if ( attach ) {
            if ( attach === 'parent') {
                reference = item.parentNode;
            } else {
                reference = document.querySelector(attach);
            }
        } else {
            reference = item;
        }

        var popper = Popper.createPopper(reference, sub, _getDropdownPopperConfig(item)); 
        DEXUtil.data(item).set('popper', popper);
    }

    // Destroy dropdown popper(new)
    var _destroyDropdownPopper = function(item) {
        if ( DEXUtil.data(item).has('popper') === true ) {
            DEXUtil.data(item).get('popper').destroy();
            DEXUtil.data(item).remove('popper');
        }
    }

    // Prepare popper config for dropdown(see: https://popper.js.org/docs/v2/)
    var _getDropdownPopperConfig = function(item) {
        // Placement
        var placement = _getOptionFromElementAttribute(item, 'placement');
        if (!placement) {
            placement = 'right';
        }

        // Offset
        var offsetValue = _getOptionFromElementAttribute(item, 'offset');
        var offset = offsetValue ? offsetValue.split(",") : [];
        
        if (offset.length === 2) {
            offset[0] = parseInt(offset[0]);
            offset[1] = parseInt(offset[1]);
        }

        // Strategy
        var strategy = _getOptionFromElementAttribute(item, 'overflow') === true ? 'absolute' : 'fixed';

        var altAxis = _getOptionFromElementAttribute(item, 'flip') !== false ? true : false;

        var popperConfig = {
            placement: placement,
            strategy: strategy,
            modifiers: [{
                name: 'offset',
                options: {
                    offset: offset
                }
            }, {
                name: 'preventOverflow',
                options: {
                    altAxis: altAxis
                }
            }, {
                name: 'flip', 
                options: {
                    flipVariations: false
                }
            }]
        };

        return popperConfig;
    }

    // Show item accordion
    var _showAccordion = function(item) {
        if ( DEXEventHandler.trigger(the.element, 'kt.menu.accordion.show', item) === false )  {
            return;
        }

        var sub = _getItemSubElement(item);
        var expand = the.options.accordion.expand;
        
        if (_getOptionFromElementAttribute(item, 'expand') === true) {
            expand = true;
        } else if (_getOptionFromElementAttribute(item, 'expand') === false) {
            expand = false;
        } else if (_getOptionFromElementAttribute(the.element, 'expand') === true) {
            expand = true;
        }

        if ( expand === false ) {
            _hideAccordions(item);
        }

        if ( DEXUtil.data(item).has('popper') === true ) {
            _hideDropdown(item);
        }

        DEXUtil.addClass(item, 'hover');

        DEXUtil.addClass(item, 'showing');

        DEXUtil.slideDown(sub, the.options.accordion.slideSpeed, function() {
            DEXUtil.removeClass(item, 'showing');
            DEXUtil.addClass(item, 'show');
            DEXUtil.addClass(sub, 'show');

            DEXEventHandler.trigger(the.element, 'kt.menu.accordion.shown', item);
        });        
    }

    // Hide item accordion
    var _hideAccordion = function(item) {
        if ( DEXEventHandler.trigger(the.element, 'kt.menu.accordion.hide', item) === false )  {
            return;
        }
        
        var sub = _getItemSubElement(item);

        DEXUtil.addClass(item, 'hiding');

        DEXUtil.slideUp(sub, the.options.accordion.slideSpeed, function() {
            DEXUtil.removeClass(item, 'hiding');
            DEXUtil.removeClass(item, 'show');
            DEXUtil.removeClass(sub, 'show');

            DEXUtil.removeClass(item, 'hover'); // update

            DEXEventHandler.trigger(the.element, 'kt.menu.accordion.hidden', item);
        });
    }

    var _setActiveLink = function(link) {
        var item = _getItemElement(link);
        var parentItems = _getItemParentElements(item);
        var parentTabPane = link.closest('.tab-pane');

        var activeLinks = [].slice.call(the.element.querySelectorAll('.menu-link.active'));
        var activeParentItems = [].slice.call(the.element.querySelectorAll('.menu-item.here, .menu-item.show'));
        
        if (_getItemSubType(item) === "accordion") {
            _showAccordion(item);
        } else {
            item.classList.add("here");
        }

        if ( parentItems && parentItems.length > 0 ) {
            for (var i = 0, len = parentItems.length; i < len; i++) {
                var parentItem = parentItems[i];

                if (_getItemSubType(parentItem) === "accordion") {
                    _showAccordion(parentItem);
                } else {
                    parentItem.classList.add("here");
                }
            }
        }       
        
        activeLinks.map(function (activeLink) {
            activeLink.classList.remove("active");
        });

        activeParentItems.map(function (activeParentItem) {
            if (activeParentItem.contains(item) === false) {
                activeParentItem.classList.remove("here");
                activeParentItem.classList.remove("show");
            }
        });

        // Handle tab
        if (parentTabPane && bootstrap.Tab) {
            var tabEl = the.element.querySelector('[data-bs-target="#' + parentTabPane.getAttribute("id") + '"]');
            var tab = new bootstrap.Tab(tabEl);

            if (tab) {
                tab.show();
            }
        }

        link.classList.add("active");
    }

    var _getLinkByAttribute = function(value, name = "href") {
        var link = the.element.querySelector('a[' + name + '="' + value + '"]');

        if (link) {
            return link;
        } else {
            null;
        }
    }

    // Hide all shown accordions of item
    var _hideAccordions = function(item) {
        var itemsToHide = DEXUtil.findAll(the.element, '.show[data-dex-menu-trigger]');
        var itemToHide;

        if (itemsToHide && itemsToHide.length > 0) {
            for (var i = 0, len = itemsToHide.length; i < len; i++) {
                itemToHide = itemsToHide[i];

                if ( _getItemSubType(itemToHide) === 'accordion' && itemToHide !== item && item.contains(itemToHide) === false && itemToHide.contains(item) === false ) {
                    _hideAccordion(itemToHide);
                }
            }
        }
    }

    // Get item option(through html attributes)
    var _getOptionFromElementAttribute = function(item, name) {
        var attr;
        var value = null;

        if ( item && item.hasAttribute('data-dex-menu-' + name) ) {
            attr = item.getAttribute('data-dex-menu-' + name);
            value = DEXUtil.getResponsiveValue(attr);

            if ( value !== null && String(value) === 'true' ) {
                value = true;
            } else if ( value !== null && String(value) === 'false' ) {
                value = false;
            }
        }

        return value;
    }

    var _destroy = function() {
        DEXUtil.data(the.element).remove('menu');
    }

    // Construct Class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Event Handlers
    the.click = function(element, e) {
        return _click(element, e);
    }

    the.link = function(element, e) {
        return _link(element, e);
    }

    the.dismiss = function(element, e) {
        return _dismiss(element, e);
    }

    the.mouseover = function(element, e) {
        return _mouseover(element, e);
    }

    the.mouseout = function(element, e) {
        return _mouseout(element, e);
    }

    // General Methods
    the.getItemTriggerType = function(item) {
        return _getOptionFromElementAttribute(item, 'trigger');
    }

    the.getItemSubType = function(element) {
       return _getItemSubType(element);
    }

    the.show = function(item) {
        return _show(item);
    }

    the.hide = function(item) {
        return _hide(item);
    }

    the.reset = function(item) {
        return _reset(item);
    }

    the.update = function() {
        return _update();
    }

    the.getElement = function() {
        return the.element;
    }

    the.setActiveLink = function(link) {
        return _setActiveLink(link);
    }   

    the.getLinkByAttribute = function(value, name = "href") {
        return _getLinkByAttribute(value, name);
    }

    the.getItemLinkElement = function(item) {
        return _getItemLinkElement(item);
    }

    the.getItemToggleElement = function(item) {
        return _getItemToggleElement(item);
    }

    the.getItemSubElement = function(item) {
        return _getItemSubElement(item);
    }

    the.getItemParentElements = function(item) {
        return _getItemParentElements(item);
    }

    the.isItemSubShown = function(item) {
        return _isItemSubShown(item);
    }

    the.isItemParentShown = function(item) {
        return _isItemParentShown(item);
    }

    the.getTriggerElement = function() {
        return the.triggerElement;
    }

    the.isItemDropdownPermanent = function(item) {
        return _isItemDropdownPermanent(item);
    }

    the.destroy = function() {
        return _destroy();
    }

    the.disable = function() {
        the.disabled = true;
    }

    the.enable = function() {
        the.disabled = false;
    }

    // Accordion Mode Methods
    the.hideAccordions = function(item) {
        return _hideAccordions(item);
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
};

// Get DEXMenu instance by element
DEXMenu.getInstance = function(element) {
    var menu;
    var item;

    // Element has menu DOM reference in it's DATA storage
    if ( DEXUtil.data(element).has('menu') ) {
        return DEXUtil.data(element).get('menu');
    }

    // Element has .menu parent 
    if ( menu = element.closest('.menu') ) {
        if ( DEXUtil.data(menu).has('menu') ) {
            return DEXUtil.data(menu).get('menu');
        }
    }
    
    // Element has a parent with DOM reference to .menu in it's DATA storage
    if ( DEXUtil.hasClass(element, 'menu-link') ) {
        var sub = element.closest('.menu-sub');

        if ( DEXUtil.data(sub).has('menu') ) {
            return DEXUtil.data(sub).get('menu');
        }
    } 

    return null;
}

// Hide all dropdowns and skip one if provided
DEXMenu.hideDropdowns = function(skip) {
    var items = document.querySelectorAll('.show.menu-dropdown[data-dex-menu-trigger]');

    if (items && items.length > 0) {
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var menu = DEXMenu.getInstance(item);

            if ( menu && menu.getItemSubType(item) === 'dropdown' ) {
                if ( skip ) {
                    if ( menu.getItemSubElement(item).contains(skip) === false && item.contains(skip) === false &&  item !== skip ) {
                        menu.hide(item);
                    }
                } else {
                    menu.hide(item);
                }
            }
        }
    }
}

// Update all dropdowns popover instances
DEXMenu.updateDropdowns = function() {
    var items = document.querySelectorAll('.show.menu-dropdown[data-dex-menu-trigger]');

    if (items && items.length > 0) {
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];

            if ( DEXUtil.data(item).has('popper') ) {
                DEXUtil.data(item).get('popper').forceUpdate();
            }
        }
    }
}

// Global handlers
DEXMenu.initHandlers = function() {
    // Dropdown handler
    document.addEventListener("click", function(e) {
        var items = document.querySelectorAll('.show.menu-dropdown[data-dex-menu-trigger]');
        var menu;
        var item;
        var sub;
        var menuObj;

        if ( items && items.length > 0 ) {
            for ( var i = 0, len = items.length; i < len; i++ ) {
                item = items[i];
                menuObj = DEXMenu.getInstance(item);

                if (menuObj && menuObj.getItemSubType(item) === 'dropdown') {
                    menu = menuObj.getElement();
                    sub = menuObj.getItemSubElement(item);

                    if ( item === e.target || item.contains(e.target) ) {
                        continue;
                    }
                    
                    if ( sub === e.target || sub.contains(e.target) ) {
                        continue;
                    }
                        
                    menuObj.hide(item);
                }
            }
        }
    });

    // Sub toggle handler(updated)
    DEXUtil.on(document.body,  '.menu-item[data-dex-menu-trigger] > .menu-link, [data-dex-menu-trigger]:not(.menu-item):not([data-dex-menu-trigger="auto"])', 'click', function(e) {
        var menu = DEXMenu.getInstance(this);

        if ( menu !== null ) {
            return menu.click(this, e);
        }
    });

    // Link handler
    DEXUtil.on(document.body,  '.menu-item:not([data-dex-menu-trigger]) > .menu-link', 'click', function(e) {
        var menu = DEXMenu.getInstance(this);

        if ( menu !== null ) {
            return menu.link(this, e);
        }
    });

    // Dismiss handler
    DEXUtil.on(document.body,  '[data-dex-menu-dismiss="true"]', 'click', function(e) {
        var menu = DEXMenu.getInstance(this);

        if ( menu !== null ) {
            return menu.dismiss(this, e);
        }
    });

    // Mouseover handler
    DEXUtil.on(document.body,  '[data-dex-menu-trigger], .menu-sub', 'mouseover', function(e) {
        var menu = DEXMenu.getInstance(this);

        if ( menu !== null && menu.getItemSubType(this) === 'dropdown' ) {
            return menu.mouseover(this, e);
        }
    });

    // Mouseout handler
    DEXUtil.on(document.body,  '[data-dex-menu-trigger], .menu-sub', 'mouseout', function(e) {
        var menu = DEXMenu.getInstance(this);

        if ( menu !== null && menu.getItemSubType(this) === 'dropdown' ) {
            return menu.mouseout(this, e);
        }
    });

    // Resize handler
    window.addEventListener('resize', function() {
        var menu;
        var timer;

        DEXUtil.throttle(timer, function() {
            // Locate and update Offcanvas instances on window resize
            var elements = document.querySelectorAll('[data-dex-menu="true"]');

            if ( elements && elements.length > 0 ) {
                for (var i = 0, len = elements.length; i < len; i++) {
                    menu = DEXMenu.getInstance(elements[i]);
                    if (menu) {
                        menu.update();
                    }
                }
            }
        }, 200);
    });
}

// Render menus by url
DEXMenu.updateByLinkAttribute = function(value, name = "href") {
    // Locate and update Offcanvas instances on window resize
    var elements = document.querySelectorAll('[data-dex-menu="true"]');

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            var menu = DEXMenu.getInstance(elements[i]);

            if (menu) {
                var link = menu.getLinkByAttribute(value, name);
                if (link) {
                    menu.setActiveLink(link);
                }
            }
        }
    }
}

// Global instances
DEXMenu.createInstances = function(selector = '[data-dex-menu="true"]') {
    // Initialize menus
    var elements = document.querySelectorAll(selector);
    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            new DEXMenu(elements[i]);
        }
    }
}

// Global initialization
DEXMenu.init = function() {
    // Event handlers
    DEXMenu.initHandlers();

    // Initialization
    DEXMenu.createInstances();
};


// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = DEXMenu;
}
