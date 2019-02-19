import { get, post } from '../../services/api';
import { MaybeResponse, errorHandler } from '../../services/error-handler';
import { Action } from '../action';
import { AppState, Dispatch, ThunkAction } from '../store';

export interface ArticleResponse extends MaybeResponse {
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

export async function startLoadingArticles(dispatch: Dispatch): Promise<void> {
  const promise = get(`article?limit=999`);
  const data = await errorHandler<ArticleResponse>(dispatch, {
    promise,
    defaultError: 'ARTICLES_COULD_NOT_BE_LOADED',
  });
  if (data && data.articles && data.articles.length) {
    dispatch(articlesLoaded(data.articles));
  }
}

export function getArticleByBarcode(
  barcode: string
): ThunkAction<Promise<Article | undefined>> {
  return async (dispatch: Dispatch) => {
    const promise = get(`article?barcode=${barcode}`);
    const data = await errorHandler<ArticleResponse>(dispatch, {
      promise,
      defaultError: 'ARTICLE_COULD_NOT_BE_LOADED_BY_BARCODE',
    });
    if (data && data.articles && data.articles.length) {
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
  precursor: Article | null;
}
export function startAddArticle(
  article: AddArticleParams
): ThunkAction<Promise<Article | undefined>> {
  return async (dispatch: Dispatch) => {
    const url = article.precursor
      ? `article/${article.precursor.id}`
      : 'article';
    const promise = post(url, article);
    const data = await errorHandler(dispatch, {
      promise,
      defaultError: 'ARTICLE_COULD_NOT_BE_CREATED',
    });
    if (data && data.article) {
      dispatch(articlesLoaded([data.article]));
      if (data.article.precursor) {
        dispatch(articlesLoaded([data.article.precursor]));
      }
      return data.article;
    }
    return undefined;
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

export function getArticleById(
  state: AppState,
  id: number
): Article | undefined {
  return getArticle(state)[id];
}

export function getArticleList(state: AppState): Article[] {
  return Object.values(getArticle(state))
    .filter(article => article.isActive)
    .sort((a: Article, b: Article) => a.name.localeCompare(b.name));
}

export function getPopularArticles(state: AppState): Article[] {
  return getArticleList(state).sort((a, b) => b.usageCount - a.usageCount);
}
