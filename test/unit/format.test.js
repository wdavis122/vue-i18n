import { template as format, parse, compile } from '../../src/format'

describe('parse', () => {
  describe('list', () => {
    it('should be parsed', () => {
      const tokens = parse('name: {0}, email: {1}')
      assert(tokens.length === 4)
      assert.equal(tokens[0].type, 'text')
      assert.equal(tokens[0].value, 'name: ')
      assert.equal(tokens[1].type, 'list')
      assert.equal(tokens[1].value, '0')
      assert.equal(tokens[2].type, 'text')
      assert.equal(tokens[2].value, ', email: ')
      assert.equal(tokens[3].type, 'list')
      assert.equal(tokens[3].value, '1')
    })
  })

  describe('named', () => {
    it('should be parsed', () => {
      const tokens = parse('name: {name}, email: {email}')
      assert(tokens.length === 4)
      assert.equal(tokens[0].type, 'text')
      assert.equal(tokens[0].value, 'name: ')
      assert.equal(tokens[1].type, 'named')
      assert.equal(tokens[1].value, 'name')
      assert.equal(tokens[2].type, 'text')
      assert.equal(tokens[2].value, ', email: ')
      assert.equal(tokens[3].type, 'named')
      assert.equal(tokens[3].value, 'email')
    })
  })

  describe('rails i18n format syntax', () => {
    it('should be parsed', () => {
      const tokens = parse('name: %{name}, email: %{email}')
      assert(tokens.length === 4)
      assert.equal(tokens[0].type, 'text')
      assert.equal(tokens[0].value, 'name: ')
      assert.equal(tokens[1].type, 'named')
      assert.equal(tokens[1].value, 'name')
      assert.equal(tokens[2].type, 'text')
      assert.equal(tokens[2].value, ', email: ')
      assert.equal(tokens[3].type, 'named')
      assert.equal(tokens[3].value, 'email')
    })
  })

  describe('not support format', () => {
    it('should be parsed', () => {
      const tokens = parse('name: { name1}, email: {%email}')
      assert(tokens.length === 4)
      assert.equal(tokens[0].type, 'text')
      assert.equal(tokens[0].value, 'name: ')
      assert.equal(tokens[1].type, 'unknown')
      assert.equal(tokens[1].value, ' name1')
      assert.equal(tokens[2].type, 'text')
      assert.equal(tokens[2].value, ', email: ')
      assert.equal(tokens[3].type, 'unknown')
      assert.equal(tokens[3].value, '%email')
    })
  })
})

describe('compile', () => {
  describe('list token', () => {
    it('should be compiled', () => {
      const tokens = parse('name: {0}, age: {1}')
      const compiled = compile(tokens, ['kazupon', '0x20'])
      assert(compiled.length === 4)
      assert.equal(compiled[0], 'name: ')
      assert.equal(compiled[1], 'kazupon')
      assert.equal(compiled[2], ', age: ')
      assert.equal(compiled[3], '0x20')
    })
  })

  describe('named token', () => {
    it('should be compiled', () => {
      const tokens = parse('name: {name}, age: {age}')
      const compiled = compile(tokens, { name: 'kazupon', age: '0x20' })
      assert(compiled.length === 4)
      assert.equal(compiled[0], 'name: ')
      assert.equal(compiled[1], 'kazupon')
      assert.equal(compiled[2], ', age: ')
      assert.equal(compiled[3], '0x20')
    })
  })
})
