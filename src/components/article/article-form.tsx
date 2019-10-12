import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'redux-react-hook';
import { useArticle } from '../../store';
import {
  Article,
  startAddArticle,
  startDeletingArticle,
  startLoadingArticles,
} from '../../store/reducers';
import { Scanner } from '../common/scanner';
import { CurrencyInput } from '../currency';
import { useArticleValidator } from './validator';
import { Trash } from '../ui/icons/trash';
import {
  Card,
  Button,
  AddIcon,
  Flex,
  Ellipsis,
  AcceptIcon,
  Input,
} from '../../bricks';

interface ButtonProps {
  isVisible: boolean;
  idArticle?: number;
  onClick(): void;
}

const ToggleArticleButton: React.FC<ButtonProps> = props => {
  if (props.isVisible) {
    return (
      <Button onClick={props.onClick}>
        {props.idArticle ? Trash : undefined}
      </Button>
    );
  }

  return (
    <Button onClick={props.onClick} fab>
      <AddIcon />
    </Button>
  );
};

interface Props {
  articleId?: number;
  onCreated(): void;
}

const initialParams = {
  name: '',
  barcode: '',
  amount: 0,
  isActive: true,
  precursor: null,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resetArticle = (article: Article | undefined, setParams: any) => {
  if (article) {
    setParams({
      amount: article.amount,
      barcode: article.barcode,
      name: article.name,
      precursor: article,
      isActive: article.isActive,
    });
  } else {
    setParams(initialParams);
  }
};

export const ArticleForm: React.FC<Props> = props => {
  const [params, setParams] = React.useState(initialParams);
  const isValidArticle = useArticleValidator(params.amount);

  const dispatch = useDispatch();
  const article = useArticle(props.articleId);

  React.useEffect(() => {
    if (!article) {
      startLoadingArticles(dispatch, true);
      startLoadingArticles(dispatch, false);
    }
  }, []);

  React.useEffect(() => {
    resetArticle(article, setParams);
  }, [article]);

  const deleteArticle = () => {
    if (article) {
      startDeletingArticle(dispatch, article.id);
    }
  };

  const submit = async (e: React.FormEvent, isValid: boolean) => {
    e.preventDefault();
    if (!isValid) {
      return;
    }

    const maybeArticle = await startAddArticle(dispatch, params);

    if (maybeArticle) {
      props.onCreated();
    }
  };

  return (
    <form onSubmit={e => submit(e, isValidArticle)}>
      <Card padding="0.5rem" level={'level3'}>
        <label htmlFor="article_add_form_label">
          <FormattedMessage id="ARTICLE_ADD_FORM_NAME_LABEL" />
        </label>
        <Input
          id="article_add_form_label"
          value={params.name}
          onChange={e => setParams({ ...params, name: e.target.value })}
          type="text"
          required
        />
        <Scanner
          onChange={barcode =>
            setParams({
              ...params,
              barcode,
            })
          }
        />
        <label htmlFor="article_add_barcode_label">
          <FormattedMessage id="ARTICLE_ADD_FORM_BARCODE_LABEL" />
        </label>
        <Input
          id="article_add_barcode_label"
          value={params.barcode}
          onChange={e => setParams({ ...params, barcode: e.target.value })}
          type="text"
          required
        />
        <label htmlFor="article_add_amount_label">
          <FormattedMessage id="ARTICLE_ADD_FORM_AMOUNT_LABEL" />
        </label>
        <CurrencyInput
          id="article_add_amount_label"
          noNegative
          value={params.amount}
          onChange={amount => setParams({ ...params, amount })}
        />
        <Button
          fab
          disabled={!isValidArticle}
          onClick={(e: React.FormEvent) => submit(e, isValidArticle)}
        >
          <AcceptIcon />
        </Button>
      </Card>
    </form>
  );
};

// const ArticleHistory: React.FC<{ article: Article }> = ({ article }) => {};
