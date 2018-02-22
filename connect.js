function Popup(url, origin, name, width, height) {
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    const opts =
        'width=' + width +
        ',height=' + height +
        ',left=' + left +
        ',top=' + top +
        ',menubar=no' +
        ',toolbar=no' +
        ',location=no' +
        ',personalbar=no' +
        ',status=no';
    var w = window.open(url, name, opts);

    var intervalId;
    var blocked = w.closed;
    const checkPopup = function () {
        if (w.closed) {
            clearInterval(intervalId);
            if (this.onclose) {
                this.onclose(blocked);
            }
        }
    }.bind(this);
    intervalId = setInterval(checkPopup, 100);

    this.window = w;
    this.origin = origin;
    this.onclose = null;
}

const URL = 'https://lionello.github.io/TestBrowserComm/popup.html'

const LedgerConnect = {

    _send: function(value, callback) {

        var popup = new Popup(URL, "http://www.lunesu.com", "ledgerconnect", 600, 500);
        popup.onclose = function() {
            window.removeEventListener('message');
            // TODO: callback with error (if not already called)
        }

        var onHandShake = function() {
            var enc = new TextEncoder("utf-8");
            var array = enc.encode(JSON.stringify(value))
            popup.window.postMessage(value, popup.origin);
        }

        window.addEventListener('message', function(event) {

            // TODO: ensure the event is from the popup
            if (onHandShake) {
                // TODO: clear the handshake timeout
                onHandShake();
                onHandShake = null;
            }
            else {
                callback(event.data);
            }
        });
        // TODO: set a timeout for the handshake
    }
}
