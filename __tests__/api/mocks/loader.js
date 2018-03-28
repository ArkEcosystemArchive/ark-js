export default function (mock) {
    mock.onGet('loader/status').reply(200, { data: [] })
    mock.onGet('loader/syncing').reply(200, { data: [] })
    mock.onGet('loader/configuration').reply(200, { data: [] })
}
