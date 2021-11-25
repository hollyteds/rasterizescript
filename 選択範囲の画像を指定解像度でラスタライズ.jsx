/*
***********************************************
選択中の画像を指定解像度でラスタライズ.jsx
Copyright (c) 2021 Tetsuo Horiuchi
Released under the MIT license
http://opensource.org/licenses/mit-license.php
ver. 0.1.1
***********************************************
*/


rasterizeImage();

function rasterizeImage(){

	const resolution = prompt('解像度を入力してください（72～2400dpi）',300);
	if(resolution == null ) {
		return
	} else if( resolution < 72 || resolution > 2400 ){
		alert('72～2400dpiの範囲で指定してください');
		return
	}

	//選択オブジェクトを取得
	const selectObject = activeDocument.selection;

	//ラスタライズオプションの設定
	const rasterOption = new RasterizeOptions();

	rasterOption.padding = 0; //オブジェクトの周りに[n]mm追加
	rasterOption.resolution = resolution; //解像度　72ppi～
	rasterOption.transparency = true; //背景を透過するか。falseで不透明に

	//画像オブジェクトを取得
	const targetItems = getTargetItems(selectObject);

	if(targetItems.length == 0 ){
		alert('画像が含まれていません');
		return
	}

	//ラスタライズ処理
	for (i = 0; i < targetItems.length; i++) {
		var x1 = targetItems[i].visibleBounds[0];
		var y1 = targetItems[i].visibleBounds[1];
		var x2 = targetItems[i].visibleBounds[2];
		var y2 = targetItems[i].visibleBounds[3];
		var objectWidth = x2 - x1;
		var objectHeight = y2 - y1;
		try {
		activeDocument.rasterize(targetItems[i], [x1, y1, x1 + objectWidth, y1 + objectHeight], rasterOption);
		}
		catch (e) {
			alert('エラーが発生しました');
		}
	}
}

//ターゲット（選択範囲でラスター画像、リンク画像を配列に格納する）
function getTargetItems(items) {
	var targetItems = [];
	for (var i = 0; i < items.length; i++) {
		if (items[i].typename == 'RasterItem' || items[i].typename == 'PlacedItem') {
			targetItems.push(items[i]);
		} else if(items[i].typename == 'GroupItem') {
			targetItems = targetItems.concat(getTargetItems(items[i].pageItems));
		} else {
			try { items[i].selected = false } catch(e) {};
		}
	}
	return targetItems;
}