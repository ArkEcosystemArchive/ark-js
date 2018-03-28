import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/webhooks'
import mockAxios from 'jest-mock-axios'

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('webhooks')
})

afterEach(() => mockAxios.reset())

test('webhooks resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('webhooks resource can call "all" method', () => {
  expect(resource.all()).toBeInstanceOf(Promise)
})

test('webhooks resource can call "create" method', () => {
  expect(resource.create()).toBeInstanceOf(Promise)
})

test('webhooks resource can call "get" method', () => {
  expect(resource.get('id')).toBeInstanceOf(Promise)
})

test('webhooks resource can call "update" method', () => {
  expect(resource.update('id')).toBeInstanceOf(Promise)
})

test('webhooks resource can call "delete" method', () => {
  expect(resource.delete('id')).toBeInstanceOf(Promise)
})

test('webhooks resource can call "events" method', () => {
  expect(resource.events()).toBeInstanceOf(Promise)
})
