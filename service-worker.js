let homeTab="";

function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'connect',
    title: 'connect',
    contexts: ["all"]
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((data, tab) => {
	console.log("url",tab.url);
	homeTab = tab.id;
	chrome.storage.local.set({'conected': tab.url, 'homeTab':tab.id}, function() {
		console.log("connected var set");
		browser.sidebarAction.getPanel({}).then(setPanel);
		});
  
});
function setPanel(oldPanel) {
	browser.sidebarAction.setPanel({panel: (oldPanel==browser.runtime.getURL("/sidepanel.html"))
		?browser.runtime.getURL("/sidepanelb.html")
		:browser.runtime.getURL("/sidepanel.html")});
}

browser.browserAction.onClicked.addListener(function(){browser.sidebarAction.toggle()});
/*
let thisPanel = browser.runtime.getURL("/this.html");
let thatPanel = browser.runtime.getURL("/that.html");

function toggle(panel) {
  if (panel === thisPanel) {
    browser.sidebarAction.setPanel({panel: thatPanel});
  } else {
    browser.sidebarAction.setPanel({panel: thisPanel});
  }
}

browser.browserAction.onClicked.addListener(() => {
  browser.sidebarAction.getPanel({}).then(toggle);
});
*/
function tabclose(tabId,changeInfo) {if (tabId == homeTab) browser.sidebarAction.setPanel({panel: browser.runtime.getURL("/startsidepanel.html")});}
function tabchange(tabId,changeInfo) {
	if (tabId == homeTab && changeInfo.status)	browser.sidebarAction.setPanel({panel: browser.runtime.getURL("/startsidepanel.html")});
}
chrome.tabs.onRemoved.addListener(tabclose);
chrome.tabs.onUpdated.addListener(tabchange);