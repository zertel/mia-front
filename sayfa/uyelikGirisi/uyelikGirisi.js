mia.uyelikGirisi={};

// acikDunya page onload function
mia.uyelikGirisi.yuklendiginde = function(){
	cl("uyelikGirisi.yuklendiginde() fonksiyonu çalıştı");

	

}


mia.uyelikGirisi.gonder = function(){
	return ajaxPostGonder('uyelik-girisi-form', function(donenCevap){
		if(donenCevap){
			cl(donenCevap);
			var donenCevapJson=JSON.parse(donenCevap);

			if(mia.oturum.giris(donenCevapJson)){
				mia.sayfaYukle('acikDunya'); 
			}
			else{
				alert('Kullanıcı adı veya parola hatalı');
			}
		}
	});
}
