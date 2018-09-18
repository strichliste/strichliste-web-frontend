// tslint:disable no-any

jest.mock('../../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

import { DeepPartial } from 'redux';
import { get, post } from '../../../services/api';
import { getMockStore } from '../../../spec-configs/mock-store';
import { Action } from '../../action';
import {
  ArticleTypes,
  article,
  getArticle,
  getArticleByBarcode,
  getArticleList,
  startAddArticle,
  startLoadingArticles,
} from '../article';

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

describe('action creators', () => {
  describe('startAddArticle', () => {
    it('', async () => {
      (post as any).mockImplementationOnce(() =>
        Promise.resolve({ article: { id: 1 } })
      );
      const store = getMockStore();
      await store.dispatch(startAddArticle({ id: 1 } as any));
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
      await store.dispatch(getArticleByBarcode('asdf'));
      expect(get).toHaveBeenCalledWith('article?barcode=asdf');
      expect(store.getActions()).toMatchSnapshot();
    });

    it('throws no articles error if the result list is empty', async () => {
      (get as any).mockImplementationOnce(() =>
        Promise.resolve({ articles: [] })
      );
      const store = getMockStore();
      try {
        await store.dispatch(getArticleByBarcode('asdf'));
      } catch (error) {
        expect(error.message).toBe('no articles are matching the barcode');
      }
      expect(get).toHaveBeenCalledWith('article?barcode=asdf');
    });
  });

  describe('startLoadingArticles', async () => {
    (get as any).mockImplementationOnce(() =>
      Promise.resolve({ articles: [{ id: 1 }] })
    );

    const store = getMockStore();
    await store.dispatch(startLoadingArticles());
    expect(get).toHaveBeenCalledWith('article');
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
    it('returns all active articles as array', () => {
      expect(
        getArticleList({
          article: {
            1: { id: 1, isActive: true },
            2: { id: 2, isActive: false },
          },
        } as any)
      ).toEqual([{ id: 1, isActive: true }]);
    });
  });
});
