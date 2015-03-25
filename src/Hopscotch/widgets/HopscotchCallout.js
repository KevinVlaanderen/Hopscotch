/*global mx, mendix, require, console, define, module, logger */
(function () {
    'use strict';

    require([

        'dojo/_base/declare', 'Hopscotch/widgets/HopscotchBase',
        'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-geometry', 'dojo/dom-class', 'dojo/dom-style', 'dojo/dom-construct', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/text'

    ], function (declare, _HopscotchBase, dom, DojoDom, domQuery, domProp, domGeom, domClass, domStyle, domConstruct, dojoArray, lang, text) {

        return declare('Hopscotch.widgets._hopscotchCallout', [ _HopscotchBase ], {

            _calloutMgr: null,
            _callout: null,

            constructor: function () {
    		},

            postCreate: function () {
                this._calloutMgr = this._hop.getCalloutManager();

                this._callout = this.params;

                this._callout.id = this.id;

                this._callout.onCTA = lang.hitch(this, this._execmf, this._callout.onCtaMF);
                this._callout.onShow = lang.hitch(this, this._execmf, this._callout.onShowMF);
                this._callout.onClose = lang.hitch(this, this._execmf, this._callout.onCloseMF);
                this._callout.onError = lang.hitch(this, this._execmf, this._callout.onErrorMF);

                // To be able to use this widget with multiple instances of itself we need to add a data variable.
                this._data[this.id] = {
                    contextGuid: null,
                    contextObj: null,
                    handleObj: null,
                    handleAttr: null
                };
                
                var path = this.toggle.split("/");
                this._attribute = path[path.length - 1];
            },

            startup: function () {
                setTimeout(lang.hitch(this, "showCallout"), 1000);
            },

            _loadData: function () {
                //console.log(this.id + '._loadData');
                var visible = this._data[this.id]._contextObj.get(this._attribute);

                if (visible) {
                    var callout = this._calloutMgr.getCallout(this._callout.id);
                    if (!callout) {
                        this._showCallout();
                    }
                } else {
                    var callout = this._calloutMgr.getCallout(this._callout.id);
                    if (callout) {
                        this._hideCallout();
                    }
                }

            },

            uninitialize: function () {
                this._cleanupSubscriptions();
                this._calloutMgr.removeAllCallouts();
            },

            _showCallout: function () {
                this._calloutMgr.createCallout(this._callout);
            },

            _hideCallout: function () {
                this._calloutMgr.removeCallout(this._callout.id);
            }
        });
    });
})();