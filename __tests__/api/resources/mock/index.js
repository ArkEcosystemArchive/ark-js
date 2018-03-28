import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios)

import Blocks from './blocks'
import Delegates from './delegates'
import Loader from './loader'
import Multisignatures from './multisignatures'
import Peers from './peers'
import Signatures from './signatures'
import Statistics from './statistics'
import Transactions from './transactions'
import Votes from './votes'
import Wallets from './wallets'
import Webhooks from './webhooks'

Blocks(mock)
Delegates(mock)
Loader(mock)
Multisignatures(mock)
Peers(mock)
Signatures(mock)
Statistics(mock)
Transactions(mock)
Votes(mock)
Wallets(mock)
Webhooks(mock)
