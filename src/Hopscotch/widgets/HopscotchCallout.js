/*global mx, mendix, require, console, define, module, logger */
(function () {
    'use strict';

    require([

        'dojo/_base/declare', 'Hopscotch/widgets/HopscotchBase',
        'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-geometry', 'dojo/dom-class', 'dojo/dom-style', 'dojo/dom-construct', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/text'

    ], function (declare, _HopscotchBase, dom, DojoDom, domQuery, domProp, domGeom, domClass, domStyle, domConstruct, dojoArray, lang, text) {

        return declare('Hopscotch.widgets.HopscotchCallout', [ _HopscotchBase ], {

            _calloutMgr: null,
            _callout: null,

            _started: false,

            constructor: function () {
                this._calloutMgr = this._hop.getCalloutManager();
    		},

            postCreate: function () {
                this._setupContext();

                this._callout = this.params;

                this._callout.id = this.id;

                this._callout.onCTA = lang.hitch(this, this._execmf, this._callout.onCtaMF);
                this._callout.onShow = lang.hitch(this, this._execmf, this._callout.onShowMF);
                this._callout.onClose = lang.hitch(this, this._execmf, this._callout.onCloseMF);
                this._callout.onError = lang.hitch(this, this._execmf, this._callout.onErrorMF);
            },

            startup: function () {
                var self = this;
                setTimeout(function() {
                    self.started = true;
                    lang.hitch(self, self._showCallout);
                }, 1000);
            },

            uninitialize: function () {
                this._cleanupSubscriptions();
                this._calloutMgr.removeAllCallouts();
            },

            _loadData: function () {
                //console.log(this.id + '._loadData');
                var visible = this._data[this.id]._contextObj.get(this._attribute);

                if (visible) {
                    var callout = this._calloutMgr.getCallout(this._callout.id);
                    if (this.started && !callout) {
                        this._showCallout();
                    }
                } else {
                    var callout = this._calloutMgr.getCallout(this._callout.id);
                    if (callout) {
                        this._hideCallout();
                    }
                }
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