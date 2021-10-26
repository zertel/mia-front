cl("app.js yüklendi");




window.onload = function(){


	//mia.sayfaYukle('uyelikGirisi');
	//mia.sayfaYukle('hesapOlustur');
	//mia.sayfaYukle('canavarlarim');
	//mia.sayfaYukle('intro');

	// Daha önce yapılmış üyelik girişi var mı, kontrol et ve dom'a yükle
	mia.oturum.localStorageMiaOturumKontrol();

	// Üyelik girişinin durumuna göre ilgili sayfaya yönlendir.
	if(mia.oturum.durum == 1){
		mia.sayfaYukle('acikDunya');
	}
	else{
		mia.sayfaYukle('anasayfa');
	}
		

};