import { DeepPartial } from 'redux';
import { Action } from '../../action';
import { ArticleTypes, article } from '../article';

describe('article reducer', () => {
  let action: DeepPartial<Action>;

  describe('with non matching action', () => {
    it('returns initial state', () => {
      const initialState = {};
      // tslint:disable-next-line no-any
      expect(article(undefined, {} as any)).toEqual(initialState);
    });
  });

  describe('with a articlesLoaded action', () => {
    const articlesResponse = [
      {
        id: 2,
        name: 'Club Mate',
        barcode: '13373243',
        amount: 100,
        active: true,
        usageCount: 0,
        precursor: null,
        created: '2018-08-17 14:21:25',
      },
    ];

    beforeEach(() => {
      action = {
        type: ArticleTypes.articlesLoaded,
        payload: articlesResponse,
      };
    });

    it('creates a new article entry in the store', () => {
      const expectedResult = {
        2: {
          id: 2,
          name: 'Club Mate',
          barcode: '13373243',
          amount: 100,
          active: true,
          usageCount: 0,
          precursor: null,
          created: '2018-08-17 14:21:25',
        },
      };
      const result = article(undefined, action as Action);
      expect(result).toEqual(expectedResult);
    });
  });
});
