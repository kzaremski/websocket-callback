/*
    Websocket w/ Callback (websocket-callback.js)
    Konstantin Zaremski
    See LICENSE
*/

class WScallback {
    constructor() {
        this.running = {};
    }

    connect(addr, callback) {
        this.socket = new WebSocket(addr);
        this.socket.onopen = function() {
            if (callback) {
                callback();
            }
        }
        this.socket.onmessage = (e) => {
            var response = JSON.parse(e.data);
            this.running[response.id](response.data, response.error);
            delete this.running[response.id];
        }
    }
    
    request(request, callback) {
        if (this.socket.readyState == 1) {
            var newID = performance.now().toString();
            this.running[newID] = callback;
            this.socket.send(JSON.stringify({
                request:request,
                id:newID
            }));
        }
    }
}
