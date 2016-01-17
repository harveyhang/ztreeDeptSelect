; (function ($, window, document, undefined) {
    // Create the defaults once
    var pluginName = 'ztreeDeptSelect',
    defaults = {
        inputWidth: '150px',
        deptButtonEnabled: true,
        deptButtonText: '...'
    };

    // The actual plugin constructor
    function ZTreeDeptSelect(element, options) {
        this.element = $(element);
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    function showDeptTree(ztDeptSelect) {
        var selectedDeptDataArray = window.showModalDialog('/src/deptDialog.html', null, "dialogWidth:350px;dialogHeight:300px;status:no;help:no;resizable:yes;center:yes;");
        
        if (typeof (selectedDeptDataArray) != "undefined") {
            ztDeptSelect.elements.originalInput.val(selectedDeptDataArray[0]);
            ztDeptSelect.elements.txtDeptName.val(selectedDeptDataArray[1]);
        }
        //else{
        //  ztDeptSelect.elements.originalInput.val('');
        //  ztDeptSelect.elements.txtDeptName.val('');
        //}
    }

    function bindEvents(ztDeptSelect) {
        ztDeptSelect.elements.deptButton.on('click', function () {
            showDeptTree(ztDeptSelect);
        });
    }

    ZTreeDeptSelect.prototype = {
        init: function () {
            // Add the custom HTML template
            this.container = $('' +
            '<div class="ztreedeptselect-container">' +
              '<table class="box1">' +
              ' <tr>' +
              '   <td><input class="txtDeptName" type="text" /></td>' +
              '   <td><input class="btnOpenDeptTree" type="button" /></td>' +
              ' </tr>' +
              '</table>' +
            '</div>')
              .insertBefore(this.element);

            // Cache the inner elements
            this.elements = {
                originalInput: this.element,
                box1: $('.box1', this.container),
                txtDeptName: $('.box1 .txtDeptName', this.container),
                deptButton: $('.box1 .btnOpenDeptTree', this.container)
            };

            // Set input IDs
            this.originalSelectName = this.element.attr('name') || '';
            var inputId = 'ztreedeptselect_' + this.originalSelectName;
            this.elements.txtDeptName.attr('id', inputId);

            // Apply all settings
            this.setDeptButtonEnabled(this.settings.deptButtonEnabled);
            this.setInputWidth(this.settings.inputWidth);
            this.setDeptButtonText(this.settings.deptButtonText);

            //updateSelectionStates(this);
            // Hide the original select
            this.element.hide();
            this.elements.txtDeptName.attr('disabled','disabled');
            //this.elements.txtDeptName.attr('readonly', 'readonly');
            this.elements.deptButton.attr('style', 'cursor:pointer');

            bindEvents(this);

            return this.element;
        },
        setDeptButtonEnabled: function (value, refresh) {
            this.settings.deptButtonEnabled = value;
            if (value) {
                this.container.find('.btnOpenDeptTree').removeAttr("disabled");
            } else {
                this.container.find('.btnOpenDeptTree').attr("disabled", "disabled");
            }
            if (refresh) {
                //refreshSelects(this);
            }
            return this.element;
        },
        setInputWidth: function (value, refresh) {
            this.settings.inputWidth = value;
            this.elements.txtDeptName.attr('style', 'width:' + value + '');
            if (refresh) {
                //refreshSelects(this);
            }
            return this.element;
        },
        setDeptButtonText: function (value, refresh) {
            this.settings.deptButtonText = value;
            if (value) {
                this.elements.deptButton.show().val(value);
            } else {
                this.elements.deptButton.hide().val(value);
            }
            if (refresh) {
                //refreshSelects(this);
            }
            return this.element;
        },
        getCustomData: function () {
            return this.element.val();
        },
        setCustomData: function (id, name) {
            this.elements.txtDeptName.val(name);
            this.elements.originalInput.val(id);
            /*
            if (id != null && id.length > 0) {
                var paramData = {
                    'deptId': id
                }
                var result = '';
                $.ajax({
                    url: '/demourl/getDeptById',
                    type: 'get',
                    data: paramData,
                    async: false,
                    success: function (returnData) {
                        result = $.parseJSON(returnData);
                    },
                    error: function () {
                    }
                });
                if (result != null)
                    this.elements.txtDeptName.val(result[0].title);
                this.elements.originalInput.val(id);
            }
            else {
                this.elements.originalInput.val('');
                this.elements.txtDeptName.val('');
            }
            */
        },
        getContainer: function () {
            return this.container;
        },
        destroy: function () {
            this.container.remove();
            this.element.show();
            $.data(this, 'plugin_' + pluginName, null);
            return this.element;
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted, instantiate a new instance of the plugin.
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                // If this is not a select
                if (!$(this).is('input')) {
                    $(this).find('input').each(function (index, item) {
                        // For each nested select, instantiate the dlp custom select
                        $(item).ztreeDeptSelect(options);
                    });
                } else if (!$.data(this, 'plugin_' + pluginName)) {
                    // Only allow the plugin to be instantiated once so we check that the element has no plugin instantiation yet

                    // if it has no instance, create a new one, pass options to our plugin constructor,
                    // and store the plugin instance in the elements jQuery data object.
                    $.data(this, 'plugin_' + pluginName, new ZTreeDeptSelect(this, options));
                }
            });
            // If the first parameter is a string and it doesn't start with an underscore or "contains" the `init`-function,
            // treat this as a call to a public method.
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

            // Cache the method call to make it possible to return a value
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);
                // Tests that there's already a plugin-instance and checks that the requested public method exists
                if (instance instanceof ZTreeDeptSelect && typeof instance[options] === 'function') {
                    // Call the method of our plugin instance, and pass it the supplied arguments.
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
            });

            // If the earlier cached method gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }

    };

})(jQuery, window, document);
