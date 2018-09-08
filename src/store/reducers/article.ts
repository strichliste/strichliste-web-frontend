import { get, post } from '../../services/api';
import { Action, DefaultThunkAction } from '../action';
import { AppState, Dispatch, ThunkAction } from '../store';

export interface ArticleResponse {
  articles: Article[];
}

export interface Article {
  id: number;
  name: string;
  barcode: string;
  amount: number;
  active: boolean;
  usageCount: number;
  precursor?: Article;
  created: string;
}

export enum ArticleTypes {
  articlesLoaded = 'articlesLoaded',
}

export interface ArticlesLoadedAction {
  type: ArticleTypes.articlesLoaded;
  payload: Article[];
}

export function articlesLoaded(payload: Article[]): ArticlesLoadedAction {
  return {
    type: ArticleTypes.articlesLoaded,
    payload,
  };
}

export function startLoadingArticles(): DefaultThunkAction {
  return async (dispatch: Dispatch) => {
    const data: ArticleResponse = await get(`article`);
    if (data.articles.length) {
      dispatch(articlesLoaded(data.articles));
    }
  };
}

export function getArticleByBarcode(
  barcode: string
): ThunkAction<Promise<Article>> {
  return async (dispatch: Dispatch) => {
    const data: ArticleResponse = await get(`article?barcode=${barcode}`);
    if (data.articles.length) {
      dispatch(articlesLoaded(data.articles));
      return data.articles[0];
    } else {
      throw Error('no articles are matching the barcode');
    }
  };
}

export interface AddArticleParams {
  name: string;
  barcode: string;
  amount: number;
  active: boolean;
  precursor: string | null;
}
export function startAddArticle(article: AddArticleParams): DefaultThunkAction {
  return async (dispatch: Dispatch) => {
    const data: { article: Article } = await post(`article`, article);
    if (data.article) {
      dispatch(articlesLoaded([data.article]));
    }
  };
}

export type ArticleActions = ArticlesLoadedAction;

interface ArticleState {
  [key: number]: Article;
}

const initialState: ArticleState = {};

export function article(
  state: ArticleState = initialState,
  action: Action
): ArticleState {
  switch (action.type) {
    case ArticleTypes.articlesLoaded:
      return action.payload.reduce((nextState, article) => {
        return { ...nextState, [article.id]: article };
      }, state);
    default:
      return state;
  }
}

export function getArticle(state: AppState): ArticleState {
  return state.article;
}

export function getArticleList(state: AppState): Article[] {
  return Object.values(getArticle(state));
}

export function getPopularArticles(state: AppState): Article[] {
  return getArticleList(state).sort((a, b) => b.usageCount - a.usageCount);
}
