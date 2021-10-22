mia.hesapOlustur={};

// acikDunya page onload function
mia.hesapOlustur.yuklendiginde = function(){
	cl("hesapOlustur.yuklendiginde() fonksiyonu çalıştı");

	

}


mia.hesapOlustur.kaydet = function(){
	return ajaxPostGonder('hesap-olustur-form', function(donenCevap){
		if(donenCevap){
			var donenCevapJson=JSON.parse(donenCevap);

			if(donenCevapJson.sonuc == 1){
				mia.sayfaYukle('acikDunya'); 
			}
			else{
				alert('Üyelik kaydı gerçekleştirilemedi, lütfen tüm alanları kontrol ediniz.');
			}
		}
	});
}


