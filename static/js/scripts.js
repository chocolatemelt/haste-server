var app = null;
var handlePop = function(evt) {
  var path = evt.target.location.pathname;
  if (path === '/') { app.newDocument(true); }
  else { app.loadDocument(path.substring(1, path.length)); }
};
setTimeout(function() {
  window.onpopstate = function(evt) {
    try { handlePop(evt); } catch(err) { console.error(err) }
  };
}, 1000);
$(function() {
  app = new haste('nori', { twitter: true });
  handlePop({ target: window });
});
