const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const mock = new MockAdapter(axios)

mock.onGet('blocks').reply(200, { data: [] })
mock.onGet('blocks/123').reply(200, { data: [] })
mock.onGet('blocks/123/transactions').reply(200, { data: [] })
mock.onPost('blocks/search').reply(200, { data: [] })

mock.onGet('delegates').reply(200, { data: [] })
mock.onGet('delegates/123').reply(200, { data: [] })
mock.onGet('delegates/123/blocks').reply(200, { data: [] })
mock.onGet('delegates/123/voters').reply(200, { data: [] })

mock.onGet('loader/status').reply(200, { data: [] })
mock.onGet('loader/syncing').reply(200, { data: [] })
mock.onGet('loader/configuration').reply(200, { data: [] })

mock.onGet('multisignatures').reply(200, { data: [] })
mock.onGet('multisignatures/pending').reply(200, { data: [] })
mock.onGet('multisignatures/wallets').reply(200, { data: [] })

mock.onGet('peers').reply(200, { data: [] })
mock.onGet('peers/123').reply(200, { data: [] })

mock.onGet('signatures').reply(200, { data: [] })

mock.onGet('statistics/blockchain').reply(200, { data: [] })
mock.onGet('statistics/transactions').reply(200, { data: [] })
mock.onGet('statistics/blocks').reply(200, { data: [] })
mock.onGet('statistics/votes').reply(200, { data: [] })
mock.onGet('statistics/unvotes').reply(200, { data: [] })

mock.onGet('transactions').reply(200, { data: [] })
mock.onPost('transactions').reply(200, { data: [] })
mock.onGet('transactions/123').reply(200, { data: [] })
mock.onGet('transactions/unconfirmed').reply(200, { data: [] })
mock.onGet('transactions/unconfirmed/123').reply(200, { data: [] })
mock.onPost('transactions/search').reply(200, { data: [] })
mock.onGet('transactions/types').reply(200, { data: [] })

mock.onGet('votes').reply(200, { data: [] })
mock.onGet('votes/123').reply(200, { data: [] })

mock.onGet('wallets').reply(200, { data: [] })
mock.onGet('wallets/top').reply(200, { data: [] })
mock.onGet('wallets/123').reply(200, { data: [] })
mock.onGet('wallets/123/transactions').reply(200, { data: [] })
mock.onGet('wallets/123/transactions/sent').reply(200, { data: [] })
mock.onGet('wallets/123/transactions/received').reply(200, { data: [] })
mock.onGet('wallets/123/votes').reply(200, { data: [] })
mock.onPost('wallets/search').reply(200, { data: [] })

mock.onGet('webhooks').reply(200, { data: [] })
mock.onPost('webhooks').reply(200, { data: [] })
mock.onGet('webhooks/123').reply(200, { data: [] })
mock.onPut('webhooks/123').reply(200, { data: [] })
mock.onDelete('webhooks/123').reply(200, { data: [] })
mock.onGet('webhooks/events').reply(200, { data: [] })
