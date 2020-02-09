//****************************************************************************************************
//タイル統合レイヤークラス
//****************************************************************************************************
L.AggregationLayer	= L.GridLayer.extend({
	//********************************************************************************
	//createTileは空のcanvasを生成（フラット化した座標番号をクラスとして付与）するだけ
	'createTile'	: function ( coord_ ) {
		const number	= String( L.getTileNumber(coord_) );
		const canvas	= L.DomUtil.create( 'canvas', number );
		const dimension	= this.getTileSize();
		canvas.width	= dimension.x;
		canvas.height	= dimension.y;
		return canvas;
	},//function
	
	//********************************************************************************
	//初期化関数
	//オリジナルの関数を継承
	//optionsに隠しパラメータを持たせるために再定義
	'initialize'	: function ( options_ ) {
		//この拡張レイヤーにプライベート領域（private）を用意する
		this._private	= {
			'parameters'	: {},
			'timestamp'		: 0
		};
		
		//----------------------------------------
		//元のメソッドからの継承
		L.setOptions( this, options_ );
		//----------------------------------------
	},
	
	//********************************************************************************
	//レイヤー追加時の実行関数
	//オリジナルの関数を継承
	//処理関数呼び出しとイベントの登録
	'onAdd'	: function ( map_ ) {
		//----------------------------------------
		//元のメソッドからの継承
		L.GridLayer.prototype.onAdd.call( this, map_ );
		//----------------------------------------
		
		//変数の保存
		const that = this;
		
		//レイヤー追加時にタイル処理実行
		this.handler();
		//地図の状態変更終了時にタイル処理
		map_.on( 'moveend', function () {
			that.handler();
		});
		map_.on( 'resize', function () {
			that.handler();
		});
	},//function
	
	//********************************************************************************
	//再描画関数
	//オリジナルの関数を継承
	//処理関数を呼び出す
	'redraw'	: function () {
		/*
		this.handler();
		
		//----------------------------------------
		//元のメソッドからの継承
		return L.GridLayer.prototype.redraw.call( this );
		*/
		L.GridLayer.prototype.redraw.call( this );
		this.handler();
		return this;
	},//function
	
	//********************************************************************************
	//パラメータ設定関数
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
	//パラメータ取得関数
	'getParameter'	: function ( name_ ) {
		return this._private.parameters[name_];
	},//function
	
	//********************************************************************************
	//タイムスタンプ取得関数
	'getTimestamp'	: function () {
		return this._private.timestamp;
	},//function
	
	//********************************************************************************
	//地図状態変更時に実行する処理関数
	'handler'	: function () {
		//最終処理時刻を決める
		const timestamp	= ( new Date() ).getTime();
		//レイヤーオプションに最終処理時刻を登録する
		this._private.timestamp	= timestamp;
		
		//準備関数
		this.prepare( timestamp );
		
		//タイル別処理を配列に登録する
		const results = [];
		for ( let i in this._tiles ) {
			results.push( this.handleTile(this._tiles[i].coords, timestamp) );
		}
		
		//全てのタイル別プロミスの結果を処理する関数を実行する
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
