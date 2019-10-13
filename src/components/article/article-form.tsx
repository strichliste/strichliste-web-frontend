import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'redux-react-hook';
import { useArticle } from '../../store';
import {
  Article,
  startLoadingArticles,
  AddArticleParams,
  startAddArticle,
  startAddBarcode,
  startDeleteBarcode,
  Barcode,
} from '../../store/reducers';
import { CurrencyInput } from '../currency';
import { useArticleValidator } from './validator';
import {
  Card,
  Input,
  AcceptButton,
  Plus,
  Button,
  CancelButton,
  Flex,
} from '../../bricks';

import styles from './article-form.module.css';
import { useHistory } from 'react-router';
import { FormField } from '../../bricks/input/input';

interface Props {
  articleId?: number;
  onCreated(): void;
}

export const ArticleForm: React.FC<Props> = props => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const article = useArticle(props.articleId);

  React.useEffect(() => {
    if (!article) {
      startLoadingArticles(dispatch, true);
      startLoadingArticles(dispatch, false);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <h2 className={styles.name}>
        {article
          ? article.name
          : intl.formatMessage({ id: 'ARTICLE_ADD_FROM_HEADLINE' })}
      </h2>
      <div className={styles.grid}>
        <ArticleDetails article={article} />

        {article && <ArticleBarCodes article={article} />}
        {article && <ArticleHistory article={article} />}
        {article && <ArticleMetrics article={article} />}
      </div>
    </>
  );
};

const extractParams = (article?: Article): AddArticleParams => {
  if (article) {
    return {
      name: article.name,
      amount: article.amount,
      isActive: article.isActive,
      precursor: article.precursor,
    };
  } else {
    return {
      name: '',
      amount: 0,
      isActive: true,
      precursor: undefined,
    };
  }
};

const ArticleDetails: React.FC<{ article?: Article }> = ({ article }) => {
  const history = useHistory();
  const [params, setParams] = React.useState<AddArticleParams>(
    extractParams(article)
  );
  const dispatch = useDispatch();
  React.useEffect(() => {
    extractParams(article);
  }, [article]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await startAddArticle(dispatch, {
      ...params,
      precursor: article,
    });

    if (result) {
      history.push(`/articles/${result.id}/edit`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <h3 className={styles.name}>
          <FormattedMessage id="ARTICLE_ADD_FORM_DETAILS" />
        </h3>
        <FormField
          label={<FormattedMessage id="ARTICLE_ADD_FORM_NAME_LABEL" />}
          children={(id: string) => (
            <Input
              id={id}
              value={params.name}
              onChange={e => setParams({ ...params, name: e.target.value })}
              type="text"
              required
            />
          )}
        />
        <FormField
          label={<FormattedMessage id="ARTICLE_ADD_FORM_AMOUNT_LABEL" />}
          children={(id: string) => (
            <CurrencyInput
              id={id}
              noNegative
              value={params.amount}
              onChange={amount => setParams({ ...params, amount })}
            />
          )}
        />

        <div>
          <AcceptButton disabled={!useArticleValidator(params.amount)} />
        </div>
      </Card>
    </form>
  );
};

const ArticleBarCodes: React.FC<{ article: Article }> = ({ article }) => {
  const [barcodes, setBarcodes] = React.useState(article.barcodes);
  const dispatch = useDispatch();
  const handleAddBarcode = async (barcode: string) => {
    const response = await startAddBarcode(dispatch, article.id, barcode);
    if (response) {
      setBarcodes(response.barcodes);
    }
  };
  const handleDeleteBarcode = async (barcode: Barcode) => {
    await startDeleteBarcode(dispatch, article.id, barcode.id);
    setBarcodes(barcodes.filter(item => item.id !== barcode.id));
  };
  return (
    <Card>
      <h3 className={styles.name}>
        <FormattedMessage id="ARTICLE_ADD_FORM_BARCODE" />
      </h3>

      {barcodes.map(barcode => (
        <BarCodeInput
          handleRemoveBarcode={() => handleDeleteBarcode(barcode)}
          handleAddBarcode={handleAddBarcode}
          key={barcode.id}
          barcode={barcode.barcode}
        />
      ))}

      <Button
        margin="1rem 0 0 0"
        primary
        onClick={() =>
          setBarcodes([...barcodes, { id: 0, barcode: '', created: '' }])
        }
      >
        <Plus />
        <FormattedMessage id="ARTICLE_FORM_ADD_BARCODE" />
      </Button>
    </Card>
  );
};

const BarCodeInput: React.FC<{
  barcode: string;
  handleRemoveBarcode(barcode: string): void;
  handleAddBarcode(barcode: string): void;
}> = ({ barcode, handleRemoveBarcode, handleAddBarcode }) => {
  const [value, setValue] = React.useState(barcode);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (barcode) {
          handleRemoveBarcode(barcode);
        } else {
          handleAddBarcode(value);
        }
      }}
    >
      <Flex margin="0 0 0.5rem 0">
        <Input
          autoFocus={barcode === ''}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        {barcode ? (
          <CancelButton type="submit" margin="0 0 0 0.5rem" />
        ) : (
          <AcceptButton type="submit" margin="0 0 0 0.5rem" />
        )}
      </Flex>
    </form>
  );
};

const ArticleMetrics: React.FC<{ article: Article }> = () => {
  return <Card>METRICS</Card>;
};

const ArticleHistory: React.FC<{ article: Article }> = ({ article }) => {
  return <Card>HISTORY</Card>;
};
