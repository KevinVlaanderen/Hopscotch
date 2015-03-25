/*global mx, mendix, require, console, define, module, logger */
    
define([

    'dojo/_base/declare', 'dojo/_base/lang', 'mxui/widget/_WidgetBase',
    'Hopscotch/widgets/lib/hopscotchsrc'

], function (declare, lang, _WidgetBase, _hopscotch) {
	'use strict';

    return declare([ _WidgetBase, _hopscotch ], {
        
        _data: {},
        _attribute: null,

        _hop: null,

        constructor: function () {
            console.log('HopsotchBase.constructor');
            this._hop = _hopscotch().hopscotchsrc();
		},

        update: function (obj, callback) {
            console.log(this.id + '.update');
            if (obj === null) {
                console.log(this.id + '.update - We did not get any context object!');
                if (!domClass.contains(this.domNode, 'hidden')) {
                    domClass.add(this.domNode, 'hidden');
                }
            } else {
                if (domClass.contains(this.domNode, 'hidden')) {
                    domClass.remove(this.domNode, 'hidden');
                }
                this._data[this.id]._contextObj = obj;
                this._resetSubscriptions();
                this._loadData();
            }
            // Execute callback.
            if (typeof callback !== 'undefined') {
                callback();
            }
        },

        refreshPositions: function () {
            this._hop.refreshBubblePosition();
        },

        _execmf: function (MF) {
        	if (MF) {
        		mx.ui.action(MF, {
			        context: new mendix.lib.MxContext(),
		        
			        callback: lang.hitch(this, function (result) {
			        }),
			        error: function () {
			        	console.error("Could not execute MF:"+MF);
			        }
		        });
        	}
        },

        _loadDataCallback: function (objs) {
            // Set the object as background.
            this._data[this.id]._contextObj = objs[0];
            // Load data again.
            this._loadData();
        },

        _setupEvents: function () {
            this.connect(this.domNode, 'click', function () {
                this._saveData();
                this._execMF(this._data[this.id]._contextObj, this.onChangeMF);
                //this._resetSubscriptions();
            });
        },

        _resetSubscriptions: function () {
            console.log(this.id + '._resetSubscriptions');
            // Release handle on previous object, if any.
            this._cleanupSubscriptions();
            // Subscribe to object updates.
            if (this._data[this.id]._contextObj) {
                this._data[this.id]._handleObj = mx.data.subscribe({
                    guid: this._data[this.id]._contextObj.getGuid(),
                    callback: lang.hitch(this, function (obj) {
                        mx.data.get({
                            guids: [obj],
                            callback: lang.hitch(this, this._loadDataCallback)
                        });
                    })
                });
                this._data[this.id]._handleAttr = mx.data.subscribe({
                    guid: this._data[this.id]._contextObj.getGuid(),
                    attr: this._attribute,
                    callback: lang.hitch(this, function (obj) {
                        mx.data.get({
                            guids: [obj],
                            callback: lang.hitch(this, this._loadDataCallback)
                        });
                    })
                });
            }
        },

        _cleanupSubscriptions: function () {
            if (this._data[this.id]._handleObj) {
                mx.data.unsubscribe(this._data[this.id]._handleObj);
                this._data[this.id]._handleObj = null;
            }
            if (this._data[this.id]._handleAttr) {
                mx.data.unsubscribe(this._data[this.id]._handleAttr);
                this._data[this.id]._handleAttr = null;
            }
        }
    });
});
