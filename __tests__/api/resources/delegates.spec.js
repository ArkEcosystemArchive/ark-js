import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/delegates'

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('delegates')
})

test('delegates resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('delegates resource can call "all" method', () => {
  expect(resource.all()).toBeInstanceOf(Promise)
})

test('delegates resource can call "get" method', () => {
  expect(resource.get('id')).toBeInstanceOf(Promise)
})

test('delegates resource can call "blocks" method', () => {
  expect(resource.blocks('id')).toBeInstanceOf(Promise)
})

test('delegates resource can call "voters" method', () => {
  expect(resource.voters('id')).toBeInstanceOf(Promise)
})
