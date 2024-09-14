let homeTab="";

function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'connect',
    title: 'connect',
    contexts: ["all"]
  });
}

//chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
//});

chrome.contextMenus.onClicked.addListener((data, tab) => {
	console.log("url",tab.url);
	homeTab = tab.id;
	//browser.sidebarAction.setPanel({panel: browser.runtime.getURL("/startsidepanel.html")});
	chrome.tabs.sendMessage(homeTab, {action : 'getTid', data:{pageRef:tab.url},opts:"render"},function(res){
		if (res) chrome.storage.session.set({'conected': tab.title, 'homeTab':tab.id}, function() {
			console.log("connected var set");
			//browser.sidebarAction.setPanel({panel: browser.runtime.getURL("/sidepanel.html")})
			});
	  });
});


browser.browserAction.onClicked.addListener(function(){browser.sidebarAction.toggle()});

function tabclose(tabId,changeInfo) {if (tabId == homeTab)  chrome.session.local.set({'conected': "No Tiddlywiki Selecte", 'homeTab':""}, function() {
			console.log("connected var reset");
			//browser.sidebarAction.setPanel({panel: browser.runtime.getURL("/sidepanel.html")})
			});}
function tabchange(tabId,changeInfo) {
	if (tabId == homeTab && changeInfo.status)	 chrome.session.local.set({'conected': "No Tiddlywiki Selecte", 'homeTab':""}, function() {
			console.log("connected var reset");
			//browser.sidebarAction.setPanel({panel: browser.runtime.getURL("/sidepanel.html")})
			});
}
//chrome.tabs.onRemoved.addListener(tabclose);
//chrome.tabs.onUpdated.addListener(tabchange);