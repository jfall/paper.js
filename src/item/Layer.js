/*
 * Paper.js
 *
 * This file is part of Paper.js, a JavaScript Vector Graphics Library,
 * based on Scriptographer.org and designed to be largely API compatible.
 * http://paperjs.org/
 * http://scriptographer.org/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * Copyright (c) 2011, Juerg Lehni & Jonathan Puckey
 * http://lehni.org/ & http://jonathanpuckey.com/
 *
 * All rights reserved.
 */

var Layer = this.Layer = Group.extend({
	/** @lends Layer# */

	beans: true,
	
	// DOCS: improve constructor code example.
	/**
	 * Creates a new Layer item and places it at the end of the
	 * {@link Project#layers} array.
	 * 
	 * @example
	 * var layer = new Layer();
	 * layer.name = 'the new layer';
	 * 
	 * @param {array} [children] An optional array of items that will be
	 * added to the newly created layer.
	 * 
	 * @class The Layer item represents a layer in a Paper.js project.
	 * 
	 * The layer which is currently active can be accessed through
	 * {@link Project#activeLayer}.
	 * An array of all layers in a project can be accessed through
	 * {@link Project#layers}.
	 * 
	 * @extends Group
	 * @extends Item
	 * @constructs Layer
	 */
	initialize: function(items) {
		this._project = paper.project;
		// Push it onto project.layers and set index:
		this._index = this._project.layers.push(this) - 1;
		this.base.apply(this, arguments);
		this.activate();
	},

	/**
	* Removes the layer from its project's layers list
	* or its parent's children list.
	*/
	_removeFromParent: function() {
		return this._parent ? this.base()
			: !!Base.splice(this._project.layers, null, this._index, 1).length;
	},

	getNextSibling: function() {
		return this._parent ? this.base()
				: this._project.layers[this._index + 1] || null;
	},

	getPreviousSibling: function() {
		return this._parent ? this.base()
				: this._project.layers[this._index - 1] || null;
	},

	/**
	 * Activates the layer.
	 * 
	 * @example
	 * var layer = new Layer();
	 * layer.name = 'new layer';
	 * layer.activate();
	 * console.log(project.activeLayer.name) // 'new layer'
	 */
	activate: function() {
		this._project.activeLayer = this;
	}
}, new function () {
	function move(above) {
		return function(item) {
			// if the item is a layer and contained within Project#layers
			if (item instanceof Layer && !item._parent
						&& this._removeFromParent()) {
				Base.splice(item._project.layers, [this],
						item._index + (above ? 1 : -1), 0);
				this._setProject(item._project);
				return true;
			}
			return this.base(item);
		};
	}

	return {
		moveAbove: move(true),

		moveBelow: move(false)
	};
});
