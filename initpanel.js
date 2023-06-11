
function main(){
	browser.storage.local.get({conected:"not here",homeTab:""}, function(items){
		document.querySelector('#home').innerHTML = items.conected;
	});
}
main();