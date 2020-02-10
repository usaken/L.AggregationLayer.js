//****************************************************************************************************
/*
	L.AggregationLayer
	Leaflet layer class is extension of L.GridLayer for aggregated processing of tiles. 
*/
//****************************************************************************************************
L.AggregationLayer	= L.GridLayer.extend({
	//********************************************************************************
	//create identifier of tile for using key of object, id or class value of dom element.  
	'getTileIdentifier'	: function ( coord_ ) {
		return 'tile_'
				+ String( coord_.x ) + '_'
				+ String( coord_.y ) + '_'
				+ String( coord_.z );
	},
	
	//********************************************************************************
	//createTile returns empty canvas element
	'createTile'	: function ( coord_ ) {
		const tileId	= this.getTileIdentifier( coord_ );
		const canvas	= L.DomUtil.create( 'canvas', tileId );
		const dimension	= this.getTileSize();
		canvas.width	= dimension.x;
		canvas.height	= dimension.y;
		return canvas;
	},//function
	
	//********************************************************************************
	//initializer
	//Override for hidden property of layer
	'initialize'	: function ( options_ ) {
		this._private	= {
			'parameters'	: {},
			'timestamp'		: 0
		};
		
		//----------------------------------------
		//Inheritance from parent
		//L.setOptions( this, options_ );
		L.GridLayer.prototype.initialize.call( this, options_ );
		//----------------------------------------
	},
	
	//********************************************************************************
	'onAdd'	: function ( map_ ) {
		//----------------------------------------
		//Inheritance from parent
		L.GridLayer.prototype.onAdd.call( this, map_ );
		//----------------------------------------
		
		//save 'this' variable
		const that = this;
		
		//run tile processing function 
		this.handler();
		
		//When 'moveend' or 'resize' or 'orientationchange' event triggers tile processing function
		map_.on( 'moveend resize orientationchange', function () {
			that.handler();
		});
	},//function
	
	//********************************************************************************
	'redraw'	: function () {
		//Inheritance from parent
		L.GridLayer.prototype.redraw.call( this );
		
		//run tile processing function
		this.handler();
		
		return this;
	},//function
	
	//********************************************************************************
	//setter for parameter
	'setParameter'	: function ( _, __ ) {
		if ( typeof _ === 'object' ) {
			for ( var i in _ ) {
				this._private.parameters[i]	= _[i];
			}
		} else if ( typeof _ === 'string' ) {
			this._private.parameters[_]	= __;
		}
		
		return this;
	},//function
	
	//********************************************************************************
	//getter for parameter
	'getParameter'	: function ( name_ ) {
		return this._private.parameters[name_];
	},//function
	
	//********************************************************************************
	//function for getting timestamp of this layer drawn at last time
	'getTimestamp'	: function () {
		return this._private.timestamp;
	},//function
	
	//********************************************************************************
	//function of tile processing
	'handler'	: function () {
		//Get timestamp of this layer drawn at last time
		const timestamp	= ( new Date() ).getTime();
		//Set timestamp to layer
		this._private.timestamp	= timestamp;
		
		//run 'prepare'
		this.prepare( timestamp );
		
		//run each tile handling function 'handleTile'
		const results = [];
		for ( let i in this._tiles ) {
			results.push( this.handleTile(this._tiles[i].coords, timestamp) );
		}
		
		//run aggregation
		this.aggregation( results, timestamp );
		
		return this;
	},//function
	
	'prepare'	: function ( timestamp_ ) {
		console.log( "Override 'prepare' for processing if necessory." );
	},
	'handleTile'	: function ( coords_, timestamp_ ) {
		console.log( "Override 'handleTile' for tile processing." );
		return null;
	},
	'aggregation'	: function ( results_, timestamp_ ) {
		console.log( "Override 'aggregation' for processed tiles." );
	}
});
