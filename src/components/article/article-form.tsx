import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'redux-react-hook';
import { useArticle } from '../../store';
import { Article, startLoadingArticles } from '../../store/reducers';
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
import { getArticle, AddArticleParams, addArticle } from './api/article-api';

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
  const intl = useIntl();

  const dispatch = useDispatch();
  const article = useArticle(props.articleId);

  React.useEffect(() => {
    if (!article) {
      startLoadingArticles(dispatch, true);
      startLoadingArticles(dispatch, false);
    }
    getArticle(props.articleId || 0);
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

        {article && <ArticleHistory article={article} />}
        {article && <ArticleBarCodes article={article} />}
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
  const [params, setParams] = React.useState<AddArticleParams>(
    extractParams(article)
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await addArticle(params);
    console.log(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      DETAILS
      <Card>
        <h3>
          <FormattedMessage id="ARTICLE_ADD_FORM_DETAILS" />
        </h3>
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

        <label htmlFor="article_add_amount_label">
          <FormattedMessage id="ARTICLE_ADD_FORM_AMOUNT_LABEL" />
        </label>
        <CurrencyInput
          id="article_add_amount_label"
          noNegative
          value={params.amount}
          onChange={amount => setParams({ ...params, amount })}
        />
        <div>
          <AcceptButton disabled={!useArticleValidator(params.amount)} />
        </div>
      </Card>
    </form>
  );
};

const ArticleBarCodes: React.FC<{ article: Article }> = ({ article }) => {
  const [barcodes, setBarcodes] = React.useState([article.barcode]);
  return (
    <Card>
      <h3>
        <FormattedMessage id="ARTICLE_ADD_FORM_BARCODE" />
      </h3>
      <Button onClick={() => setBarcodes([...barcodes, ''])}>
        <Plus />
        <FormattedMessage id="ARTICLE_FORM_ADD_BARCODE" />
      </Button>
      {barcodes.map(barcode => (
        <BarCodeInput
          removeBarCode={() =>
            setBarcodes(
              barcodes.filter(filterBarcode => filterBarcode !== barcode)
            )
          }
          key={barcode}
          barcode={barcode}
        />
      ))}
    </Card>
  );
};

const BarCodeInput: React.FC<{ barcode: string; removeBarCode(): void }> = ({
  barcode,
  removeBarCode,
}) => {
  const [value, setValue] = React.useState(barcode);
  return (
    <Flex margin="0 0 0.5rem 0">
      <CancelButton style={{ marginRight: '1rem' }} onClick={removeBarCode} />
      <Input
        autoFocus={barcode === ''}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </Flex>
  );
};

const ArticleMetrics: React.FC<{ article: Article }> = () => {
  return <Card>METRICS</Card>;
};

const ArticleHistory: React.FC<{ article: Article }> = ({ article }) => {
  return <Card>HISTORY</Card>;
};
