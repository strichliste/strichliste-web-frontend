import { useQuery } from '@tanstack/react-query';

import { get, post, restDelete } from '../services/api';
import { errorHandler, MaybeResponse } from '../services/error-handler';
import { queryClient } from '../services/query-client';
import { Article, Tag } from '../types/article';
import { queryKeys } from './keys';

export type { Article, Barcode, Tag } from '../types/article';

type ArticleResult = MaybeResponse & { article: Article };
type ArticlesResult = MaybeResponse & { articles: Article[] };

export interface AddArticleParams {
  name: string;
  amount: number;
  isActive: boolean;
  precursor: Article | undefined;
}

const byName = (a: Article, b: Article) => a.name.localeCompare(b.name);

// --- Queries -------------------------------------------------------------

export function useArticles(isActive: boolean): Article[] {
  const { data } = useQuery({
    queryKey: queryKeys.articles(isActive),
    queryFn: async ({ signal }): Promise<Article[]> => {
      const params = new URLSearchParams({
        limit: '999',
        active: String(isActive),
        ancestor: 'false',
      });
      const data = await errorHandler({
        promise: get<ArticlesResult>(`article?${params.toString()}`, { signal }),
        defaultError: 'ARTICLES_COULD_NOT_BE_LOADED',
      });
      return (data?.articles ?? []).slice().sort(byName);
    },
  });
  return data ?? [];
}

/** Active articles sorted by usage. */
export function usePopularArticles(): Article[] {
  return useArticles(true)
    .filter((article) => article.isActive)
    .slice()
    .sort((a, b) => b.usageCount - a.usageCount);
}

export function useTags(): Tag[] {
  const { data } = useQuery({
    queryKey: queryKeys.tags,
    queryFn: ({ signal }): Promise<Tag[]> =>
      get<{ tags: Tag[] }>('tag', { signal }).then((res) => res.tags),
  });
  return data ?? [];
}

export function useArticle(id: number | undefined): Article | undefined {
  const { data } = useQuery({
    queryKey: queryKeys.article(id ?? 0),
    queryFn: ({ signal }): Promise<Article> =>
      get<{ article: Article }>(`article/${id}?depth=10`, { signal }).then(
        (res) => res.article
      ),
    enabled: Boolean(id),
  });
  return data;
}

// --- Mutations -----------------------------------------------------------

function invalidateArticles() {
  queryClient.invalidateQueries({ queryKey: ['articles'] });
  queryClient.invalidateQueries({ queryKey: ['article'] });
}

export async function addArticle(
  article: AddArticleParams
): Promise<Article | undefined> {
  const url = article.precursor ? `article/${article.precursor.id}` : 'article';
  const data = await errorHandler({
    promise: post<ArticleResult>(url, article),
    defaultError: 'ARTICLE_COULD_NOT_BE_CREATED',
  });
  if (data?.article) {
    invalidateArticles();
    return data.article;
  }
  return undefined;
}

export async function deleteArticle(
  articleId: number
): Promise<Article | undefined> {
  const data = await errorHandler({
    promise: restDelete<ArticleResult>(`article/${articleId}`),
    defaultError: 'ARTICLES_COULD_NOT_BE_DELETED',
  });
  if (data?.article) {
    invalidateArticles();
    return data.article;
  }
  return undefined;
}

export async function addBarcode(
  id: number,
  barcode: string
): Promise<Article | undefined> {
  const data = await errorHandler({
    promise: post<ArticleResult>(`article/${id}/barcode`, { barcode }),
    defaultError: 'ARTICLE_BARCODE_COULD_NOT_BE_ADDED',
    errors: {
      ArticleBarcodeAlreadyExistsException: 'ARTICLE_BARCODE_ALREADY_EXISTS',
    },
  });
  if (data?.article) {
    invalidateArticles();
    return data.article;
  }
  return undefined;
}

export async function deleteBarcode(
  articleId: number,
  barcodeId: number
): Promise<Article | undefined> {
  const data = await errorHandler({
    promise: restDelete<ArticleResult>(
      `article/${articleId}/barcode/${barcodeId}`
    ),
  });
  if (data?.article) {
    invalidateArticles();
    return data.article;
  }
  return undefined;
}

export async function addTag(
  id: number,
  tag: string
): Promise<Article | undefined> {
  const data = await errorHandler({
    promise: post<ArticleResult>(`article/${id}/tag`, { tag }),
    defaultError: 'ARTICLE_TAG_COULD_NOT_BE_ADDED',
    errors: {
      ArticleTagAlreadyExistsException: 'ARTICLE_TAG_ALREADY_EXISTS',
    },
  });
  if (data?.article) {
    invalidateArticles();
    return data.article;
  }
  return undefined;
}

export async function deleteTag(
  articleId: number,
  tagId: number
): Promise<Article | undefined> {
  const data = await errorHandler({
    promise: restDelete<ArticleResult>(`article/${articleId}/tag/${tagId}`),
  });
  if (data?.article) {
    invalidateArticles();
    return data.article;
  }
  return undefined;
}

export async function fetchArticleByBarcode(barcode: string): Promise<Article> {
  const params = new URLSearchParams({ barcode });
  const data = await errorHandler({
    promise: get<ArticlesResult>(`article/search?${params.toString()}`),
    defaultError: 'ARTICLE_COULD_NOT_BE_LOADED_BY_BARCODE',
  });
  if (data?.articles?.length) {
    return data.articles[0];
  }
  throw new Error('no articles are matching the barcode');
}

// --- Pure helpers --------------------------------------------------------

export const getArticleHistory = (article: Article): Article[] => {
  const next = article.precursor;
  if (!next) {
    return [];
  }
  return [next, ...getArticleHistory(next)];
};
