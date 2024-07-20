// Saves options to chrome.storage.sync.
function save_options() {
  chrome.storage.local.set({
    enableJot: document.getElementById("enableJot").checked
  }, function() {
  });
}


var test;

// Restores select box and text fields
function restore_options() {
		
  chrome.storage.local.get({enableJot: true}, function(items) {
    document.getElementById("enableJot").checked = items.enableJot;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('enableJot').addEventListener('click',
    save_options);
