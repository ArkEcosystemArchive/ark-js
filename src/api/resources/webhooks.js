import Base from './base'

export default class Webhooks extends Base {
  all() {
    return this.http.get('webhooks')
  }

  create() {
    return this.http.post('webhooks')
  }

  get(id) {
    return this.http.get(`webhooks/${id}`)
  }

  update(id) {
    return this.http.put(`webhooks/${id}`)
  }

  delete(id) {
    return this.http.delete(`webhooks/${id}`)
  }

  events() {
    return this.http.get('webhooks/events')
  }
}
