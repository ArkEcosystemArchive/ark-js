## Import

### JavaScript

```js
const ark = require('arkjs')
```

### ECMA 2015+ and TypeScript

```js
import * as ark from 'arkjs'
```

## Creating transactions

### Creating a normal transaction

```js
const amount = 1000 * Math.pow(10, 8) // 100000000000
const transaction = ark.transaction.createTransaction(
  'ALfoDjpX4PxAUJxZs2Me1LqUaa3j9uoHe9', // recipientId
  amount,
  null, // vendorField
  'passphrase', // secret
  'secondPassphrase' // secondSecret
)
```

`transaction` now equals something like this:

```js
{ type: 0, // Transaction type. 0 = Normal
  amount: 100000000000, // 1000 ARK
  fee: 10000000, // 0.1 ARK
  recipientId: 'ALfoDjpX4PxAUJxZs2Me1LqUaa3j9uoHe9',
  timestamp: 21897474, // UTC time of genesis since epoch.
  asset: {},
  senderPublicKey: '02e012f0a7cac12a74bdc17d844cbc9f637177b470019c32a53cef94c7a56e2ea9',
  signature: '3045022100a1906bf0a1d1cc10f77cb69a5d3237465283f12211c29b0d5c46cb38f0051fca022063148f376a73927a53e2d641f230a3e7c228b05e369ce0ce5018ddbca86127db',
  signSignature: '3045022100f52f5b36aed28eb4f23b5369c3babca33bf4cb67131be90ecd35e94c54766c8e02207a434bc269f6257eb86ebf1e9467739ee260d73c464c5fe9f45292e3443c6241',
  id: 'e2b02074643a99c948f3c0ec59503c64b5b266d7fe0f39f9c0692dedbe221bd6' }
```

### Creating a second-signature transaction

```js
const transaction = ark.signature.createSignature('secret', 'secondSecret')
```

`transaction`:

```js
{ type: 1,
  amount: 0,
  fee: 500000000,
  recipientId: null,
  senderPublicKey: '03a02b9d5fdd1307c2ee4652ba54d492d1fd11a7d1bb3f3a44c4a05e79f19de933',
  timestamp: 21905324,
  asset:
   { signature:
      { publicKey: '0292d580f200d041861d78b3de5ff31c6665b7a092ac3890d9132593beb9aa8513' } },
  signature: '304402200c35668ff51afe986566c7d32d764dc2b9c109c4876573c780a460c8071fb23f02204f0a3ee1647a29ae3f2ffee071e65ac31f3c4ae1e80fd5bfcf7a1dab6dce829f',
  id: '7044418423b4d36f7e8d433a938f4e0fe66ba3bddc2aa530e84d50c2115a5160' }
```

### Creating a delegate transaction

```js
const transaction = ark.delegate.createDelegate('secret', 'username', 'secondSecret')
```

`transaction`:

```js
{ type: 2,
  amount: 0,
  fee: 2500000000,
  recipientId: null,
  senderPublicKey: '03a02b9d5fdd1307c2ee4652ba54d492d1fd11a7d1bb3f3a44c4a05e79f19de933',
  timestamp: 21903794,
  asset:
   { delegate:
      { username: 'username',
        publicKey: '03a02b9d5fdd1307c2ee4652ba54d492d1fd11a7d1bb3f3a44c4a05e79f19de933' } },
  signature: '304402200e25b2522853663567bf07ac3ebb2f1a2fc7aece3081c549e99437b313a0033d02207bb0c0300ad41ee86ca6990a04b9c0db0daa338332ccf4fb00e7d9c8f51bcdd0',
  signSignature: '3044022060263ab39fb5fdfa3766451cbd89f6a6f0011ebb525af250e2898a47ff1ccdf3022070af78f5c04157daf17d25d0fb304b2200477e603ccb731f25293d107a56ae4b',
  id: '42977fa5551aa24114ee836c6028a562a263c5b54271b644018656fc51e4984f' }
```

### Creating a vote transaction

```js
const transaction = ark.vote.createVote('secret', ['+58199578191950019299181920120128129'], 'secondSecret')
```

`transaction`:

```js
{ type: 3,
  amount: 0,
  fee: 100000000,
  recipientId: 'AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff',
  senderPublicKey: '03a02b9d5fdd1307c2ee4652ba54d492d1fd11a7d1bb3f3a44c4a05e79f19de933',
  timestamp: 21905210,
  asset: { votes: [ '+58199578191950019299181920120128129' ] },
  signature: '3045022100ac6d550406bc09fe296c974e72ba1f96cebbaad9a55ff5bcf426c5dc49a4610f02207f2ada1f4c52c2471da4a96df7203dd1a4ee09b9ab5d4167df0800adb6b8b268',
  signSignature: '3045022100de9f9784aa06c1c7ad28855b144b314d0dc894397eaf8540f8fa1b2fe1f5b59002202a39df5f59637c5eddf7443e0690726cb09c1e1f8654f062f57b9bde39e8def1',
  id: '5ad0116a458c00984e1548e7655d9330989151ec04684a94ee3b2a517650445a' }
```

## Getting the nethash

You need the nethash to assure you are broadcasting to the right network (testnet, mainnet, etc.). The nethash is simply the payload hash from the genesisBlock. If no nethash or the wrong nethash is provided in the headers then the request will be rejected and the expected nethash will be returned.

```json
{
  "success": false,
  "message": "Request is made on the wrong network",
  "expected": "e2f8f69ec6ab4b12550a314bd867c46e64e429961bb427514a3a534c602ff467",
  "received": "wrong-nethash"
}
```

### Nethash from API Endpoint

```http
GET /api/blocks/getNetHash
```

Response:

```json
{
    "success": true,
    "nethash": "6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988"
}
```

### Nethash from peer

You can also obtain the nethash from a peer.

#### Client

With [jQuery](https://jquery.com/):

```js
var nethash
$.ajax({
  url: 'https://api.arknode.net/peer/transactions/',
  data: JSON.stringify({}),
  dataType: 'json',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'os': 'linux3.2.0-4-amd64',
    'version': '0.3.0',
    'port': 1,
    'nethash': 'wrong-nethash'
  },
  success: function (data) {
    nethash = data.body.expected
  }
})
```

#### Server

With [Request](https://github.com/request/request):

```js
let nethash
request({
  url: 'https://api.arknode.net/peer/transactions',
  json: {},
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    os: 'linux3.2.0-4-amd64',
    version: '0.3.0',
    port: 1,
    nethash: 'wrong-nethash'
  }
}, (error, response, body) => {
  nethash = body.expected
})
```

#### Response from peer

```json
{
    "success": false,
    "message": "Request is made on the wrong network",
    "expected": "6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988",
    "received": "wrong-nethash"
}
```

## Posting a transaction

```html
POST /peer/transactions
```

### Sending a transaction from the client

With [jQuery](https://jquery.com):

```js
var success = function (data) = {
  console.log(data)
}

$.ajax({
  url: 'https://api.arknode.net/peer/transactions',
  data: JSON.stringify({ transactions: [transaction] }),
  dataType: 'json',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'os': 'linux3.2.0-4-amd64',
    'version': '0.3.0',
    'port': 1,
    'nethash': nethash
  },
  success: success
})
```

### Sending a transaction from the server

With [Request](https://github.com/request/request).

```js
const request = require('request')

const callback = (error, response, body) => {
  console.log(error || body)
}

request({
  url: 'https://api.arknode.net/peer/transactions',
  json: { transactions: [transaction] },
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    os: 'linux3.2.0-4-amd64',
    version: '0.3.0',
    port: 1,
    nethash
  }
}, callback)
```

## Peer response

Upon successfully accepting a transaction, the receiving node will respond with:

```json
{ "success": true, "result": "5318121831703437738" }
```

If the transaction is deemed invalid or an error is encountered the receiving node will respond with:

```json
{ "success": false, "message": "Error message" }
```
