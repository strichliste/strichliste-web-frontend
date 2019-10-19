/* eslint-disable @typescript-eslint/no-explicit-any */

import { DeepPartial } from 'redux';
import { get, post } from '../../../services/api';
import { getMockStore } from '../../../spec-configs/mock-store';
import { Action } from '../../action';
import {
  article,
  articlesLoaded,
  getArticle,
  getArticleByBarcode,
  getArticleList,
  startAddArticle,
  startLoadingArticles,
} from '../article';

jest.mock('../../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('article reducer', () => {
  let action: DeepPartial<Action>;

  describe('with non matching action', () => {
    it('returns initial state', () => {
      const initialState = {};
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
      action = articlesLoaded(articlesResponse as any);
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

describe('action creators', () => {
  describe('startAddArticle', () => {
    it('', async () => {
      (post as any).mockImplementationOnce(() =>
        Promise.resolve({ article: { id: 1 } })
      );
      const store = getMockStore();
      await startAddArticle(store.dispatch, { id: 1 } as any);
      expect(post).toHaveBeenCalledWith('article', { id: 1 });
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('getArticleByBarcode', () => {
    it('fetches articles by barcode', async () => {
      (get as any).mockImplementationOnce(() =>
        Promise.resolve({ articles: [{ id: 1 }] })
      );
      const store = getMockStore();
      await getArticleByBarcode(store.dispatch, 'asdf');
      expect(get).toHaveBeenCalledWith('article/search?barcode=asdf');
      expect(store.getActions()).toMatchSnapshot();
    });

    it('throws no articles error if the result list is empty', async () => {
      (get as any).mockImplementationOnce(() =>
        Promise.resolve({ articles: [] })
      );
      const store = getMockStore();
      try {
        await getArticleByBarcode(store.dispatch, 'asdf');
      } catch (error) {
        expect(error.message).toBe('no articles are matching the barcode');
      }
      expect(get).toHaveBeenCalledWith('article/search?barcode=asdf');
    });
  });

  it('startLoadingArticles', async () => {
    (get as any).mockImplementationOnce(() =>
      Promise.resolve({ articles: [{ id: 1 }] })
    );

    const store = getMockStore();
    await startLoadingArticles(store.dispatch, true);
    expect(get).toHaveBeenCalledWith(
      'article?limit=999&active=true&ancestor=false'
    );
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('selectors', () => {
  describe('getArticle', () => {
    it('return the article state', () => {
      expect(
        getArticle({
          article: { 1: { id: 1 } },
        } as any)
      ).toEqual({ 1: { id: 1 } });
    });
  });
  describe('getArticleList', () => {
    it('returns all articles as array', () => {
      expect(
        getArticleList({
          article: {
            1: { id: 1, isActive: true, name: 'b' },
            2: { id: 2, isActive: false, name: 'a' },
          },
        } as any)
      ).toEqual([
        { id: 2, isActive: false, name: 'a' },
        { id: 1, isActive: true, name: 'b' },
      ]);
    });
  });
});
