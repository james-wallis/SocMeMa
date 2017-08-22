//Redirect While Article Hunter is the only active product
socket.on('redirect', function(destination) {
  window.location.href = destination;
});
