export default class Loader {
    constructor(http) {
        this.http = http
    }

    status() {
        return this.http.get('api/loader/status')
    }

    sync() {
        return this.http.get('api/loader/status/sync')
    }

    autoconfigure() {
        return this.http.get('api/loader/autoconfigure')
    }
}
