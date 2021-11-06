mia.intro={};

// intro page onload function
mia.intro.yuklendiginde = function(){

	mia.sesYoneticisi.yukle('intro','sayfa/intro/mp3/intro.mp3');
	mia.sesYoneticisi.oynat('intro');
	
	mia.slaytYoneticisi.tanimla('#intro.slayt-yoneticisi', {
		slaytAyarlari: [
			{
				"belirmeSuresi": 4000,
				"beklemeSuresi": 1000,
				"kaybolmaSuresi": 1000
			},
			{
				"belirmeSuresi": 1000,
				"beklemeSuresi": 4000,
				"kaybolmaSuresi": 2000
			},
			{
				"belirmeSuresi": 1000,
				"beklemeSuresi": 1000,
				"kaybolmaSuresi": 1000
			},
			{
				"belirmeSuresi": 1000,
				"beklemeSuresi": 1000,
				"kaybolmaSuresi": 1000
			},
			{
				"belirmeSuresi": 1000,
				"beklemeSuresi": 1000,
				"kaybolmaSuresi": 1000
			}
		],
		bittigindeCalistir: function(){ 
			mia.sesYoneticisi.durdur('intro');
			mia.sayfaYukle('anasayfa');
		}
	});

	/*/
	// Hızlı tanımlama örneği
	mia.slaytYoneticisi.tanimla('#intro.slayt-yoneticisi', function(){ 
		mia.sesYoneticisi.durdur('intro');
		mia.sayfaYukle('anasayfa');
	});
	/*/

}