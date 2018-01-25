import Http from "./http"
import Builder from "./builder"

import Account from "./account"
import Block from "./block"
import Delegate from "./delegate"
import Loader from "./loader"
import Multisignature from "./multisignature"
import Peer from "./peer"
import Signature from "./signature"
import Transaction from "./transaction"
import Transport from "./transport"
import Vote from "./vote"

export default class Jark {
    constructor(ip, port, nethash, version) {
        this.ip = ip
        this.port = port
        this.nethash = nethash
        this.version = version

        this.setConnection(ip, port, nethash, version)
    }

    accounts() {
        return new Account(this.http)
    }

    blocks() {
        return new Block(this.http)
    }

    delegates() {
        return new Delegate(this.http, this.getBuilder())
    }

    loaders() {
        return new Loader(this.http)
    }

    multiSignatures() {
        return new MultiSignature(this.http, this.getBuilder())
    }

    peers() {
        return new Peer(this.http)
    }

    signatures() {
        return new Signature(this.http, this.getBuilder())
    }

    transactions() {
        return new Transaction(this.http, this.getBuilder())
    }

    transports() {
        return new Transport(this.http)
    }

    votes() {
        return new Vote(this.http, this.getBuilder())
    }

    setConnection(ip, port, nethash, version) {
        this.http = new Http(ip, port, nethash, version)
    }

    getBuilder() {
        return new Builder(this.nethash)
    }
}
