export default class Peer {
    constructor(http) {
        this.http = http
    }

    peer(ip, port) {
        return this.http.get('api/peers/get', {
            "ip": ip,
            "port": port
        })
    }

    peers(parameters = {}) {
        return this.http.get('api/peers', parameters)
    }

    version() {
        return this.http.get('api/peers/version')
    }
}
