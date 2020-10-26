// Ufak Yardımcı Fonksiyonlar
function cl(a){ console.log(a); } // console.log kısaltması


cl("core.js yüklendi");


// AJAX FONKSIYONLARI
function ajaxGet(url,callback){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			callback(this.responseText);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}




function sayfaYukle(sayfaAdi){
	ajaxGet('sayfa/'+sayfaAdi+'/'+sayfaAdi+'.html', function(donenCevap){ 
		document.querySelector('main').innerHTML = donenCevap;
		cl(sayfaAdi + ' isimli sayfa yüklendi');
	});
}


window.onload = function(){
	sayfaYukle('acik-dunya');
};