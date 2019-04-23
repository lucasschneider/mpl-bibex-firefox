(function(){
  'use strict';
  console.log('sundayDropbox');
  var t = setInterval(function() {
    if (/\/app\/staff\/circ\/checkin\//.test(window.location)) {
      browser.storage.sync.get("sundayDropboxPaused").then(res => {
        var dropbox = Array.from(document.getElementsByTagName('button'))
                           .filter(elt => elt.title === "Dropbox mode");

        if (dropbox && dropbox.length > 0) {
          dropbox = dropbox[0];
          if (!res.sundayDropboxPaused && !dropbox.classList.contains("dropbox-active")) {
            dropbox.click();
          }

          if (!dropbox.getAttribute('onclick')) {
            dropbox.onclick = function() {
              if (this.classList.contains("dropbox-active")) {
                browser.runtime.sendMessage({"key": "pauseSundayDropbox"});
              } else {
                browser.runtime.sendMessage({"key": "resumeSundayDropbox"});
              }
            };

            clearInterval(t);
          }
        }
      });
    }
  }, 250);
})();
