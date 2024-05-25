
var enableJot = false;
chrome.storage.local.get({enableJot:false}, function(items){
enableJot = items.enableJot;
var offset;
function addAutoResize() {
  document.querySelectorAll('[data-autoresize]').forEach(function (element) {
    element.style.boxSizing = 'border-box';
    offset = element.offsetHeight - element.clientHeight;
    element.addEventListener('input', function (event) {
      event.target.style.height = 0;
      event.target.style.height = event.target.scrollHeight + offset + 'px';
      //console.log("trigger")
    });
    element.removeAttribute('data-autoresize');
  });
}
 addAutoResize();

var current= {};
current.pageRef  = null;
var tags;
var taglist = [];
var homeTab = "";


function restorTags() {
	tags = unedittags;
	redoTags();
	removeDropDown();
}

function addDropDown(arr){
	
	var arrobj = {};
	//if (arr.length == 0) return;
	//if(Array.isArray(arr)) for (var i= 0; i < arr.length - 1; i++) arrobj[arr[i]]=null;
	//else 
	arrobj =arr;
	const tagss = document.getElementById("dropdown");
	tagss.style.display = "block";
	const mainDropdown = document.getElementById("main-dropdown");
	const DDContainer = document.getElementById("dropdown");
	(function (item) {
		item.addEventListener("mouseenter", function () {
			mainDropdown.style.display = "block";
		});
	})(DDContainer);
	// Hide submenu when not hovered
	(function (item) {
		item.addEventListener("mouseleave", function () {
			mainDropdown.style.display = "none";
		});
	})(DDContainer);
	createDropdownMenu(arrobj, mainDropdown);
	/*
	var options;
	if (arr.length == 0) return;
	options=`<select id="selectdd"><option value="" disabled hidden selected>add tag</option>`;
	arr.map((op,i)=>{
	 options+=`<option value="${op}" id="${i}" style="border-radius: 5px;"">${op}</option>`
	})
	options+='</select>';
	document.getElementById("dropdown").innerHTML=options;

	document.querySelector('#selectdd').onchange = function(e){
		console.log("val is",e.target.value)
		if (!tags.includes(e.target.value)) {
			tags.push(e.target.value);
			redoTags(true);
		}
		addDropDown(arr);
	}
	*/
}
function removeDropDown(){
  document.getElementById("main-dropdown").innerHTML="";
  	const tagss = document.getElementById("dropdown");
	tagss.style.display = "none";
}


       // Function to handle selecting an option
        function selectOption(option) {console.log("tags ",tags)
			if (!tags.includes(option)) {
				tags.push(option);
				redoTags(true);
			} console.log("val ",option)
        }

        // Function to create the dropdown menu from the array of items
        function createDropdownMenu(items, parent) {
			var itemVal;
            for (var item in items) { console.log(item)
                const listItem = document.createElement("li");
				itemVal = items[item];
                listItem.textContent = item + (itemVal?" \u2794":"");
                //listItem.classList.add("dropdown-item");

                if (itemVal) {
                    const submenu = document.createElement("ul");
                    submenu.classList.add("dropdown-menu");
                    listItem.appendChild(submenu);
                    createDropdownMenu(itemVal, submenu);
                }
				(function (x) {
					listItem.addEventListener("click", function (e) {
						selectOption(x);
						e.stopPropagation();
					});
				})(item);
                // Hide submenu initially
                if (itemVal) {
                    listItem.querySelector("ul").style.display = "none";
                }

                // Show submenu on hover
                (function (listItem,itemVal) {
					listItem.addEventListener("mouseenter", function () {
						if (itemVal) {
							const submenu = listItem.querySelector("ul");
							submenu.style.display = "block";

							// Calculate and set submenu position to align with the parent
							const parentRect = submenu.getBoundingClientRect();
							//submenu.style.left = parentRect.right + "px";
							submenu.style.top = listItem.offsetTop + "px";
							submenu.style.left = 100 +"px";console.log("bb ",listItem )
						}
					});
				})(listItem,itemVal);
                // Hide submenu when not hovered
                (function (listItem,itemVal) {
					listItem.addEventListener("mouseleave", function () {
						if (itemVal) {
							listItem.querySelector("ul").style.display = "none";
						}
					});
				})(listItem,itemVal);

                parent.appendChild(listItem);

            };
        }



function puttags(fields, edit){
	let w = document.querySelector('#tagss');
	let items = JSON.parse(fields);
	
	let html = 'tags: ';
	tags=items.tags||{};
	unedittags = JSON.parse(JSON.stringify(tags));//clone
	for (i in tags) {
		if (edit) html += `<scan  class="tagpillfalse">${tags[i]}<button id="tags${i}" class="reset-button">[x]</button></scan>`;
		else html +=  `<button class="tagpill">${tags[i]}</button>`;
	}
			
	w.innerHTML = html;
	
	if (edit) {
		for (i in tags) {
				(function (j) {document.querySelector('#tags'+i).onclick = function(e){
					let value = tags[j];
					tags = tags.filter(item => item !== value);
					redoTags(true);
				}})(i)
			}
	addDropDown(taglist);
	} else removeDropDown();

}

function redoTags(edit){
	var i;
	let w = document.querySelector('#tagss');

	
	let html = 'tags: ';

	for (i in tags) {
		if (edit) html += `<scan  class="tagpillfalse">${tags[i]}<button id="tags${i}" class="reset-button">[x]</button></scan>`;
		else html +=  `<button class="tagpill">${tags[i]}</button>`;
	}	
	w.innerHTML = html;
	if (edit) {
		for (i in tags) {
				(function (j) {document.querySelector('#tags'+i).onclick = function(e){
					let value = tags[j];
					tags = tags.filter(item => item !== value);
					redoTags(true);
				}})(i)
			}
	}
}

//-------------GET----------------
document.querySelector('#get').addEventListener('click', function() {
	document.querySelector('#get').style.display = "none";
	document.querySelector('#put').style.display = "block";
	document.querySelector('#cancel').style.display = "block";
	document.querySelector('#jotsave').style.display = "none";
	document.querySelector('#jotcancel').style.display = "none";
	document.querySelector('#hidejot').style.display = "none";
	document.querySelector('#jotsave').style.display = "none";
	document.querySelector('#jot').style.display = "none";
	document.querySelector('#makejot').style.display = "none";

	browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  var currUrl = tabs[0].url;
		browser.tabs.sendMessage(homeTab, {action : 'getTid', data:{pageRef:currUrl}, opts:"edit"},function(res){
			let y = document.querySelector('#content');
			let x = document.querySelector('#edit');
			y.style.display = "none";
			taglist = (JSON.parse(res.aux)).taglist||{};
			puttags(res.data,true);
			//console.log("res.data ",res.data);
			x.value=(JSON.parse(res.data)).sideText;
			x.style.display = "block";
			x.dispatchEvent(new Event("input"))

		});
	});
});
	

//-------------PUT--------------

document.querySelector('#put').addEventListener('click', function() {
	let x = document.querySelector('#edit')
	let y = document.querySelector('#content');
	let but =	document.querySelector('#get');
	but.style.display = "block"
	document.querySelector('#put').style.display = "none";
	document.querySelector('#cancel').style.display = "none";
	document.querySelector('#jotsave').style.display = "none";
	document.querySelector('#jotcancel').style.display = "none";
	document.querySelector('#hidejot').style.display = "none";


if (enableJot) 	document.querySelector('#jot').style.display = "block";

	//console.log("emptybox ");
	//x.value="";
	//y.style.display = "block";
	x.style.display = "none";
							
	browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var currUrl = tabs[0].url;
		browser.tabs.sendMessage(tabs[0].id, {action : 'getMeta'}, function (meta)	{ 
			if (meta){	console.log("meta",meta.description,meta.mediaImage);
				current.mediaImage=meta.mediaImage;
				current.description=meta.description;
				current.favIconUrl=meta.faviconUrl;
			} else {
				console.log ("meta not defined");
				current.mediaImage="";
				current.description="";
				current.favIconUrl="";
			}
			current.pageRef = tabs[0].url;
				//current.favIconUrl=tabs[0].favIconUrl;
			current.pageTitle=tabs[0].title;
			current.sideText = x.value;
			current.tags = JSON.stringify(tags);
			browser.tabs.sendMessage(homeTab, {action : 'putTid', data:current, opts:"put"},function(res){
				//console.log(res);
				browser.tabs.sendMessage(homeTab, {action : 'getTid', data:{pageRef:currUrl},opts:"render"},function(res){
					let data = JSON.parse(res.data); 
					let aux = JSON.parse(res.aux);
					console.log("res.aux ",res.aux);
					taglist = aux.taglist;
					y.innerHTML=data.sideText;
					puttags(res.data);
					if (aux.new=='true') {
						but.style.background='cyan';
						//but.innerHTML="add"
					}
					else {
						but.style.background='red';
						//but.innerHTML="edit"
					}
					y.style.display = "block";
					//console.log("reloaded new");
				});
						
				//console.log("res.data ",res.data);(document.querySelector('#content')).innerHTML=res.data;
			});
		});
	});
});	

//-----------CANCEL--------------

document.querySelector('#cancel').addEventListener('click', function() {
	let x = document.querySelector('#edit');
	let y = document.querySelector('#content');
	document.querySelector('#get').style.display = "block";
	document.querySelector('#put').style.display = "none";
	document.querySelector('#cancel').style.display = "none";
	document.querySelector('#jotsave').style.display = "none";
	document.querySelector('#jotcancel').style.display = "none";
	document.querySelector('#hidejot').style.display = "none";
if (enableJot) 	document.querySelector('#jot').style.display = "block";

	//console.log("emptybox ");
	x.value="";
	x.style.display = "none";
	y.style.display = "block";
	restorTags();
});	
//-----------------------------
function pullNote(tabs) {
	let x = document.querySelector('#edit'),editvalue;
	let y = document.querySelector('#content');
	let but =	document.querySelector('#get');
	document.querySelector('#makejot').style.display = "none";
	document.querySelector('#put').style.display = "none";
	document.querySelector('#cancel').style.display = "none";
	document.querySelector('#jotsave').style.display = "none";
	document.querySelector('#jotcancel').style.display = "none";
	document.querySelector('#hidejot').style.display = "none";
if (enableJot) 	document.querySelector('#jot').style.display = "block";
	but.style.display = "block"
	editvalue = x.value;
	x.value = "";//this stops multiple calls to save 
	x.style.display = "none";
	browser.tabs.sendMessage(tabs[0].id, {action : 'getMeta'}, function (meta)	{ 
			if (meta){	console.log("meta",meta.description,meta.mediaImage);
				current.mediaImage=meta.mediaImage;
				current.description=meta.description;
				current.favIconUrl=meta.faviconUrl;
			} else {
				console.log ("meta not defined");
				current.mediaImage="";
				current.description="";
				current.favIconUrl="";
			}
			current.pageRef = tabs[0].url;
			//current.favIconUrl=tabs[0].favIconUrl;
			current.pageTitle=tabs[0].title;
			current.sideText = "";//edited text
			current.tags = [];//edited values
			browser.tabs.sendMessage(homeTab, {action : 'getTid',data:{pageRef:current.pageRef} ,opts:"render"},function(res){
				let data = JSON.parse(res.data); 
				let aux = JSON.parse(res.aux);
				console.log("res.aux ",res.aux);
				taglist = aux.taglist;
				y.innerHTML=data.sideText;
				puttags(res.data);
				if (aux.new=='true') {
					but.style.background='cyan';
					//but.innerHTML="add"
				}
				else {
					but.style.background='red';
					//but.innerHTML="edit"
				}
				y.style.display = "block";
				
			});
	  });

  //console.log(tabs[0].url);
}

function tagsChanged(tags) {
  if (tags.length !== unedittags.length) {
    return true;
  }

  for (let i = 0; i < tags.length; i++) {
    if (tags[i] !== unedittags[i]) {
      return true;
    }
  }

  return false;
}

function getNote(tabs) {
	let x = document.querySelector('#edit'),editvalue;
	let y = document.querySelector('#content');
	let but =	document.querySelector('#get');
	document.querySelector('#makejot').style.display = "none";
	document.querySelector('#put').style.display = "none";
	document.querySelector('#cancel').style.display = "none";
	document.querySelector('#jotsave').style.display = "none";
	document.querySelector('#jotcancel').style.display = "none";
	document.querySelector('#hidejot').style.display = "none";
if (enableJot) 	document.querySelector('#jot').style.display = "block";
	but.style.display = "block"
	editvalue = x.value;
	x.value = "";//this stops multiple calls to save 
	x.style.display = "none";
	//first save note
 

		browser.storage.local.get({homeTab:""}, function(items){  
		//first put old values
		  current.sideText = editvalue;
		  current.tags = JSON.stringify(tags);
			if (current.pageRef && (editvalue || tagsChanged(tags))) browser.tabs.sendMessage(homeTab, {action : 'putTid', opts:"puts",data:current},function(res){
				//console.log(res);
			});
			//get new url/tab data
			browser.tabs.sendMessage(tabs[0].id, {action : 'getMeta'}, function (meta)	{ 
				if (meta){	console.log("meta",meta.description,meta.mediaImage);
					current.mediaImage=meta.mediaImage;
					current.description=meta.description;
					current.favIconUrl=meta.faviconUrl;
				} else {
					console.log ("meta not defined");
					current.mediaImage="";
					current.description="";
					current.favIconUrl="";
				}
				current.pageRef = tabs[0].url;
				//current.favIconUrl=tabs[0].favIconUrl;
				current.pageTitle=tabs[0].title;
				current.sideText = "";
				current.tags = [];
				browser.tabs.sendMessage(items.homeTab, {action : 'getTid',data:{pageRef:current.pageRef} ,opts:"render"},function(res){
				let data = JSON.parse(res.data); 
				let aux = JSON.parse(res.aux);
				console.log("res.aux ",res.aux);
				taglist = aux.taglist;
				y.innerHTML=data.sideText;
				puttags(res.data);
				if (aux.new=='true') {
					but.style.background='cyan';
					//but.innerHTML="add"
				}
				else {
					but.style.background='red';
					//but.innerHTML="edit"
				}
				y.style.display = "block";
					
				});
		  });
  });
  //console.log(tabs[0].url);
}


//	browser.tabs.sendMessage(tab.id, {action : 'getMeta'}, function (meta)	{ 
//			 console.log("meta",meta.description,meta.mediaImage);
			 
//	})
function onError(error) {
  console.error(`Error: ${error}`);
}

//-------------PUTJOT--------------

document.querySelector('#jotsave').addEventListener('click', function() {
	let x = document.querySelector('#makejot')
	let y = document.querySelector('#content');
	let but =	document.querySelector('#get');
	but.style.display = "block"
	document.querySelector('#put').style.display = "none";
	document.querySelector('#cancel').style.display = "none";
	document.querySelector('#jotsave').style.display = "none";
	document.querySelector('#jotcancel').style.display = "none";
	document.querySelector('#hidejot').style.display = "none";
if (enableJot) 	document.querySelector('#jot').style.display = "block";

	//console.log("emptybox ");
	//x.value="";
	//y.style.display = "block";
	x.style.display = "none";
							
		browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  var currUrl = tabs[0].url;
				current.sideText = x.value;
				x.value="";
				current.category ="jot";
				browser.tabs.sendMessage(homeTab, {action : 'paste', data:current, opts:"put"},function(res){

					console.log("jot returned");


		});
	});	
});

//-------------MAKEJOT----------------
document.querySelector('#jot').addEventListener('click', makeJot);
function makeJot() {
	document.querySelector('#get').style.display = "block";
	document.querySelector('#put').style.display = "none";
	document.querySelector('#cancel').style.display = "none";
	document.querySelector('#jotsave').style.display = "none";
	document.querySelector('#jotcancel').style.display = "block";
	document.querySelector('#hidejot').style.display = "block";
	document.querySelector('#jotsave').style.display = "block";
	document.querySelector('#jot').style.display = "none";
	let x = document.querySelector('#makejot');
	x.style.display = "block";
};

//-------------HIDEJOT----------------
document.querySelector('#hidejot').addEventListener('click', hideJot);
function hideJot() {
	document.querySelector('#makejot').style.display = "none";
    document.querySelector('#get').style.display = "block"
	document.querySelector('#put').style.display = "none";
	document.querySelector('#cancel').style.display = "none";
	document.querySelector('#hidejot').style.display = "none";
	document.querySelector('#jotsave').style.display = "none";
	document.querySelector('#jotcancel').style.display = "none";
if (enableJot) 	document.querySelector('#jot').style.display = "block";
else 	document.querySelector('#jot').style.display = "none";
};	

//-------------CLEARJOT----------------
document.querySelector('#jotcancel').addEventListener('click', function() {
	let x = document.querySelector('#makejot');

	x.value="";
});	
//-----------------------------

browser.runtime.onMessage.addListener(({ name, data }) => {
  if (name === 'doit') {
	browser.storage.local.get({conected:"not here again"}, function(items){
				document.querySelector('#home').innerHTML = items.conected;
		} 
	);
  }
});

	
browser.tabs.onActivated.addListener((actTabInfo) => {console.log("onActivated1");
	if (actTabInfo.windowId == WindowId) browser.tabs.query({active: true, currentWindow: true, status:'complete'}, function(tabs) {
			console.log("onActivated");
			if (tabs.length > 0) getNote(tabs);

  });
});
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {console.log("onUpdated1");
  if (tab.active && ( changeInfo.status == "complete")) {
 
		if (tab.windowId == WindowId) {
			console.log("onUpdated",tab.windowId,"==",WindowId,"::",changeInfo.status,":url",changeInfo.url);
			getNote([tab]);
		}

  }
});


window.addEventListener('unload', function() {
	let x = document.querySelector('#edit')
				current.sideText = x.value;
				current.tags = JSON.stringify(tags);
				if (current.pageRef && x.value) browser.tabs.sendMessage(homeTab, {action : 'putTid', data:current, opts:"put"},function(res){
					//console.log(res)	

	});
});	

var WindowId =null;


function main(){
	browser.windows.getCurrent({} ,function(Window) {console.log("window is",Window.id);
		WindowId = Window.id;
	});

	browser.storage.local.get({conected:"not here",homeTab:""}, function(items){
		document.querySelector('#home').innerHTML = items.conected;
		homeTab = items.homeTab;
		browser.tabs
		  .query({ currentWindow: true, active: true })
		  .then(pullNote, onError);

	});
}
main();

browser.storage.local.onChanged.addListener(function (changes){
	if (changes.enableJot) {
		 enableJot = changes.enableJot.newValue;
		 if (enableJot) hideJot();
		 else hideJot();
	 }
	
	});



});