mia.uyelikGirisi={};

// acikDunya page onload function
mia.uyelikGirisi.yuklendiginde = function(){
	cl("uyelikGirisi.yuklendiginde() fonksiyonu çalıştı");

	

}


mia.uyelikGirisi.gonder = function(){
	return ajaxPostGonder('uyelik-girisi-form', function(donenCevap){
		if(donenCevap){
			var donenCevapJson=JSON.parse(donenCevap);

			if(donenCevapJson.sonuc == 1){
				mia.sayfaYukle('acikDunya'); 
			}
			else{
				alert('Kullanıcı adı veya parola hatalı');
			}
		}
	});
}
