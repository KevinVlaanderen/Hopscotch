/*global mx, mendix, require, console, define, module, logger */
    
define([

    'dojo/_base/declare', 'dojo/_base/lang', 'mxui/widget/_WidgetBase', 'dijit/_Widget',
    'Hopscotch/widgets/lib/hopscotchsrc'

], function (declare, lang, _WidgetBase, _Widget, _hopscotch) {
	'use strict';

    return declare([ _WidgetBase, _hopscotch, _Widget ], {
        
        _data: {},
        _attribute: null,

        _hop: null,
        _started: false,
        _visible: false,

        constructor: function () {
            //console.log(this.id + '.constructor');
            this._hop = _hopscotch().hopscotchsrc();
		},

        update: function (obj, callback) {
            //console.log(this.id + '.update');
            if (obj === null) {
                console.log(this.id + '.update - We did not get any context object!');
            } else {
                this._data[this.id]._contextObj = obj;
                this._resetSubscriptions();
                this._processData();
            }
            // Execute callback.
            if (typeof callback !== 'undefined') {
                callback();
            }
        },

        startup: function () {
            //console.log(this.id + '.startup');
            var self = this;
            setTimeout(function() {
                self._started = true;
                //self._show();
            }, 1000);
        },

        _refreshPositions: function () {
            //console.log(this.id + '._refreshPositions');
            this._hop.refreshBubblePosition();
        },

        _execmf: function (MF) {
            //console.log(this.id + '._execmf');
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
            //console.log(this.id + '._loadDataCallback');
            // Set the object as background.
            this._data[this.id]._contextObj = objs[0];
            // Load data again.
            this._processData();
        },

        _processData: function () {
            //console.log(this.id + '._loadData');
            this._visible = this._data[this.id]._contextObj.get(this._attribute);

            if (this._visible) {
                this._show();
            } else {
                this._hide();
            }
        },

        _setupContext: function() {
            //console.log(this.id + '.setupContext');
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

        _resetSubscriptions: function () {
            //console.log(this.id + '._resetSubscriptions');
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
            //console.log(this.id + '._cleanupSubscriptions');
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
