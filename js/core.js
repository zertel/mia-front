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


var parcalar=[];
function parcaYukle(parcaAdi,hedefAdresi,data){
	if(parcalar[parcaAdi]){
		document.querySelector(hedefAdresi).innerHTML += parcalar[parcaAdi].replace(/{{monster_id}}/g,data);
		cl(parcaAdi + ' isimli parça sadece yerleştirildi');
	}
	else{
		ajaxGet('parca/'+parcaAdi+'/'+parcaAdi+'.html', function(donenCevap){ 
			parcalar[parcaAdi]=donenCevap;
			document.querySelector(hedefAdresi).innerHTML += parcalar[parcaAdi].replace(/{{monster_id}}/g,data);
			cl(parcaAdi + ' isimli parça yüklendi ve yerleştirildi');
		});
	}
}


/*/
function parcaYerlestir(parcaAdi,hedefAdresi){
	if(parcalar[parcaAdi]){
		document.querySelector(hedefAdresi).innerHTML = parcalar[parcaAdi];
	}
}
/*/


window.onload = function(){
	//sayfaYukle('acik-dunya');
	sayfaYukle('canavarlarim');
};