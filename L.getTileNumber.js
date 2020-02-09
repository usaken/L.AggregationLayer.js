//****************************************************************************************************
//タイル番号を計算する関数を追加
//****************************************************************************************************
L.getTileNumber	= function ( coord_ ) {
	//暫定テスト用
	/*
	const number	= ( Math.pow( 4, coord_.z ) - 1 ) / 3
					+ Math.pow( 2, coord_.z ) * coord_.y
					+ coord_.x;
	return 'tile_' + String( number ); 
	*/
	return 'tile_'
			+ String( coord_.x ) + '_'
			+ String( coord_.y ) + '_'
			+ String( coord_.z );
	
};
