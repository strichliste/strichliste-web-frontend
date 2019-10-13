import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'redux-react-hook';
import { useArticle } from '../../store';
import {
  Article,
  startAddArticle,
  startDeletingArticle,
  startLoadingArticles,
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
    <>
      <h2 className={styles.name}>
        {article
          ? article.name
          : intl.formatMessage({ id: 'ARTICLE_ADD_FROM_HEADLINE' })}
      </h2>
      <div className={styles.grid}>
        <Card level={'level3'}>
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
          <AcceptButton disabled={!isValidArticle} />
        </Card>

        {article && <ArticleHistory article={article} />}
        {article && <ArticleBarCodes article={article} />}
        {article && <ArticleMetrics article={article} />}
      </div>
    </>
  );
};

const ArticleDetails: React.FC<{ article: Article }> = () => {
  return <div>DETAILS</div>;
};

const ArticleBarCodes: React.FC<{ article: Article }> = ({ article }) => {
  const [barcodes, setBarcodes] = React.useState([article.barcode]);
  return (
    <Card level={'level3'}>
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
  return <div>METRICS</div>;
};

const ArticleHistory: React.FC<{ article: Article }> = ({ article }) => {
  return <div>HISTORY</div>;
};
