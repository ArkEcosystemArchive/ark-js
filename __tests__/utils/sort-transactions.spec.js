import sortTransactions from '@/utils/sort-transactions'

describe('Utils - sortTransactions', () => {
  it('returns the transactions ordered by type and id', () => {
    const ordered = [
      { type: 1, id: 2 }, { type: 1, id: 8 },
      { type: 2, id: 5 }, { type: 2, id: 9 }
    ]
    const unordered = [ordered[3], ordered[2], ordered[1], ordered[0]]

    expect(sortTransactions(unordered)).toEqual(ordered)
  })
})
