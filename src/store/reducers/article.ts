/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, restDelete } from '../../services/api';
import { MaybeResponse, errorHandler } from '../../services/error-handler';
import { Action } from '../action';
import { AppState, Dispatch } from '../store';

export interface ArticleResponse extends MaybeResponse {
  articles: Article[];
}

export type Barcode = {
  id: number;
  barcode: string;
  created: string;
};

export type Tag = {
  id: number;
  tag: string;
  created: string;
};

export interface Article {
  id: number;
  name: string;
  barcodes: Barcode[];
  tags: Tag[];
  amount: number;
  isActive: boolean;
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

export async function startAddBarcode(
  dispatch: Dispatch,
  id: number,
  barcode: string
): Promise<undefined | Article> {
  const promise = post(`article/${id}/barcode`, { barcode });
  const data = await errorHandler<any>(dispatch, {
    promise,
  });
  if (data && data.article) {
    return data.article;
  }

  return undefined;
}

export async function startDeleteBarcode(
  dispatch: Dispatch,
  articleId: number,
  barcodeId: number
) {
  const promise = restDelete(`article/${articleId}/barcode/${barcodeId}`);
  const data = await errorHandler<any>(dispatch, {
    promise,
  });
  if (data && data.article) {
    return data.article;
  }

  return undefined;
}
export async function startAddTag(
  dispatch: Dispatch,
  id: number,
  tag: string
): Promise<undefined | Article> {
  const promise = post(`article/${id}/tag`, { tag });
  const data = await errorHandler<any>(dispatch, {
    promise,
  });
  if (data && data.article) {
    return data.article;
  }

  return undefined;
}

export async function startDeleteTag(
  dispatch: Dispatch,
  articleId: number,
  tagId: number
) {
  const promise = restDelete(`article/${articleId}/tag/${tagId}`);
  const data = await errorHandler<any>(dispatch, {
    promise,
  });
  if (data && data.article) {
    return data.article;
  }

  return undefined;
}

export async function startLoadingArticles(
  dispatch: Dispatch,
  isActive: boolean
): Promise<void> {
  const promise = get(`article?limit=999&active=${isActive}&ancestor=false`);
  const data = await errorHandler<ArticleResponse>(dispatch, {
    promise,
    defaultError: 'ARTICLES_COULD_NOT_BE_LOADED',
  });
  if (data && data.articles && data.articles.length) {
    dispatch(articlesLoaded(data.articles));
  }
}

export async function startDeletingArticle(
  dispatch: Dispatch,
  articleId: number
): Promise<Article | undefined> {
  const promise = restDelete(`article/${articleId}`);
  const data = await errorHandler(dispatch, {
    promise,
    defaultError: 'ARTICLES_COULD_NOT_BE_DELETED',
  });
  if (data && data.article) {
    dispatch(articlesLoaded([data.article]));
    return data.article;
  }
  return undefined;
}

export async function getArticleByBarcode(
  dispatch: Dispatch,
  barcode: string
): Promise<Article | undefined> {
  const promise = get(`article/search?barcode=${barcode}`);
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
}

export interface AddArticleParams {
  name: string;
  amount: number;
  isActive: boolean;
  precursor: Article | undefined;
}
export async function startAddArticle(
  dispatch: Dispatch,
  article: AddArticleParams
): Promise<Article | undefined> {
  const url = article.precursor ? `article/${article.precursor.id}` : 'article';
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
  return Object.values(getArticle(state)).sort((a: Article, b: Article) =>
    a.name.localeCompare(b.name)
  );
}

export function getPopularArticles(state: AppState): Article[] {
  return getArticleList(state)
    .filter(article => article.isActive)
    .sort((a, b) => b.usageCount - a.usageCount);
}

export function getHistory(article: Article): Article[] {
  return [];
}
