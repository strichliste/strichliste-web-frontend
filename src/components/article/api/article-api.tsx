import React from 'react';
import { get, post } from '../../../services/api';
import { Article } from '../../../store/reducers';

const articleCache = {};

export const getArticle = async (id: number) => {
  const article = await get(`article/${id}`);
  articleCache[id] = article;

  return article;
};

export interface AddArticleParams {
  name: string;
  amount: number;
  isActive: boolean;
  precursor: Article | undefined;
}
export const addArticle = async (params: AddArticleParams) => {
  const url = params.precursor ? `article/${params.precursor.id}` : 'article';
  const data = await post(url, params);
  const { article } = data;
  if (article) {
    // dispatch(articlesLoaded([data.article]));
    if (data.article.precursor) {
      //   dispatch(articlesLoaded([data.article.precursor]));
    }
    return data.article;
  }
  return undefined;
};
