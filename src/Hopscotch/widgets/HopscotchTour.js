/*global mx, mendix, require, console, define, module, logger */
(function() {
    'use strict';

    require([

        'dojo/_base/declare', 'Hopscotch/widgets/HopscotchBase',
        'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-geometry', 'dojo/dom-class', 'dojo/dom-style', 'dojo/dom-construct', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/text'

    ], function (declare, _HopscotchBase, dom, DojoDom, domQuery, domProp, domGeom, domClass, domStyle, domConstruct, dojoArray, lang, text) {

        return declare('Hopscotch.widgets.HopscotchTour', [ _HopscotchBase ], {

    		_tour: null,

            constructor: function () {
                //console.log(this.id + '.constructor');
    		},

            postCreate: function () {
                //console.log(this.id + '.postCreate');
                this._setupContext();

    			this._tour = this.params;

                //this._tour.id = this.multipageid ? this.multipageid : this.id;
                this._tour.id = this.id;
                this._tour.steps = this._buildSteps();

                this._tour.onStart = lang.hitch(this, this._execmf, this._tour.onStartMF);
    			this._tour.onEnd = lang.hitch(this, this._execmf, this._tour.onEndMF);
    			this._tour.onPrev = lang.hitch(this, this._execmf, this._tour.onPrevMF);
    			this._tour.onNext = lang.hitch(this, this._execmf, this._tour.onNextMF);
    			this._tour.onClose = lang.hitch(this, this._execmf, this._tour.onCloseMF);
    			this._tour.onError = lang.hitch(this, this._execmf, this._tour.onErrorMF);
            },

            uninitialize: function () {
                //console.log(this.id + '.uninitialize');
                this._cleanupSubscriptions();
                this._stopTour(false);
            },

            _buildSteps: function() {
                //console.log(this.id + '._buildSteps');
            	this.steps.forEach(function(step) {
                    if (step.onNextMF) {
                        step.onNext = lang.hitch(this, this._execmf, step.onNextMF);
                    }
                    if (step.onPrevMF) {
                        step.onPrev = lang.hitch(this, this._execmf, step.onPrevMF);
                    }
                    if (step.onShowMF) {
                        step.onShow = lang.hitch(this, this._execmf, step.onShowMF);
                    }
                    if (step.onCtaMF) {
	    			    step.onCTA = lang.hitch(this, this._execmf, step.onCtaMF);
                    }
                    if (step.onCloseMF) {
                        step.onClose = lang.hitch(this, this._execmf, step.onCloseMF);
                    }
                    if (step.onErrorMF) {
                        step.onError = lang.hitch(this, this._execmf, step.onErrorMF);
                    }
            	}, this);

                return this.steps;
            },

            _show: function () {
                //console.log(this.id + '._show');
                var tour = this._hop.getCurrTour();
                if (tour != this._tour) {
                    if (tour) {
                        this._hop.endTour(tour);
                    }
                    this._hop.startTour(this._tour);
                }    
                this._visible = true;            
            },

            _hide: function () {
                //console.log(this.id + '._hide');
                var tour = this._hop.getCurrTour();
                if (tour) {
                    this._hop.endTour(false);
                }
                this._visible = false;
            }
        });
    });
})();