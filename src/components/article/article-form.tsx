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
  startAddTag,
  startDeleteTag,
  Tag,
  startDeletingArticle,
} from '../../store/reducers';
import { CurrencyInput, Currency } from '../currency';
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
import { ScrollToTop } from '../common/scroll-to-top';

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
      <ScrollToTop />
      <h2 className={styles.name}>
        {article
          ? article.name
          : intl.formatMessage({ id: 'ARTICLE_ADD_FROM_HEADLINE' })}
      </h2>
      <div className={styles.grid}>
        <ArticleDetails article={article} />

        {article && <ArticleTags article={article} />}
        {article && <ArticleBarCodes article={article} />}
        {article && article.precursor && (
          <ArticleHistory precursor={article.precursor} />
        )}
        {article && <ArticleMetrics article={article} />}
      </div>
      {article && <ToggleActivity article={article} />}
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
  const intl = useIntl();
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
          <AcceptButton
            title={intl.formatMessage({ id: 'ARTICLE_ADD_FROM_ACCEPT' })}
            disabled={!useArticleValidator(params.amount)}
          />
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
    <ItemList<Barcode>
      headline={<FormattedMessage id="ARTICLE_ADD_FORM_BARCODE" />}
      placeholder={'add barcode'}
      addRowLabel={<FormattedMessage id="ARTICLE_FORM_ADD_BARCODE" />}
      items={barcodes}
      handleAddRow={() =>
        setBarcodes([...barcodes, { id: 0, barcode: '', created: '' }])
      }
      handleSaveItem={handleAddBarcode}
      handleDeleteItem={handleDeleteBarcode}
      getItemValue={item => item.barcode}
    />
  );
};

const ArticleTags: React.FC<{ article: Article }> = ({ article }) => {
  const [tags, setTags] = React.useState(article.tags);
  const dispatch = useDispatch();
  const intl = useIntl();
  const handleAddTag = async (tag: string) => {
    const response = await startAddTag(dispatch, article.id, tag);
    if (response) {
      setTags(response.tags);
    }
  };
  const handleDeleteTag = async (tag: Tag) => {
    await startDeleteTag(dispatch, article.id, tag.id);
    setTags(tags.filter(item => item.id !== tag.id));
  };
  return (
    <ItemList<Tag>
      headline={<FormattedMessage id="ARTICLE_ADD_FORM_TAG" />}
      placeholder={intl.formatMessage({ id: 'ADD_TAG_PLACEHOLDER' })}
      addRowLabel={<FormattedMessage id="ARTICLE_FORM_ADD_TAG" />}
      items={tags}
      handleAddRow={() => setTags([...tags, { id: 0, tag: '', created: '' }])}
      handleSaveItem={handleAddTag}
      handleDeleteItem={handleDeleteTag}
      getItemValue={item => item.tag}
    />
  );
};

type ItemListProps<Item = Barcode> = {
  items: Item[];
  addRowLabel: React.ReactNode;
  headline: React.ReactNode;
  placeholder: string;
  handleAddRow(): void;
  handleDeleteItem(item: Item): void;
  handleSaveItem(value: string): void;
  getItemValue(item: Item): string;
};

function ItemList<Item>({
  items,
  handleSaveItem,
  handleDeleteItem,
  handleAddRow,
  headline,
  placeholder,
  addRowLabel,
  getItemValue,
}: ItemListProps<Item>) {
  return (
    <Card>
      <h3 className={styles.name}>{headline}</h3>

      {items.map(item => (
        <ListInput
          placeholder={placeholder}
          handleRemove={() => handleDeleteItem(item)}
          handleAdd={handleSaveItem}
          key={getItemValue(item)}
          item={getItemValue(item)}
        />
      ))}

      <Button margin="1rem 0 0 0" primary onClick={handleAddRow}>
        <Plus />
        {addRowLabel}
      </Button>
    </Card>
  );
}

const ListInput: React.FC<{
  placeholder: string;
  item: string;
  handleRemove(item: string): void;
  handleAdd(item: string): void;
}> = ({ item, handleRemove, handleAdd, placeholder }) => {
  const intl = useIntl();
  const [value, setValue] = React.useState(item);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (item) {
          handleRemove(item);
        } else {
          handleAdd(value);
        }
      }}
    >
      <Flex margin="0 0 0.5rem 0">
        <Input
          placeholder={placeholder}
          autoFocus={item === ''}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        {item ? (
          <CancelButton
            title={intl.formatMessage({ id: 'DELETE_ITEM' })}
            type="submit"
            margin="0 0 0 0.5rem"
          />
        ) : (
          <AcceptButton
            title={intl.formatMessage({ id: 'ADD_ITEM' })}
            type="submit"
            margin="0 0 0 0.5rem"
          />
        )}
      </Flex>
    </form>
  );
};

const ArticleMetrics: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <Card>
      <h3>
        <FormattedMessage id="METRICS_HEADLINE" />
      </h3>
      <FormattedMessage
        id="ARTICLE_USAGE_COUNT_LABEL"
        values={{ value: article.usageCount }}
      />
    </Card>
  );
};

const ArticleHistory: React.FC<{ precursor: Article }> = ({ precursor }) => {
  console.log(precursor.precursor);
  return (
    <Card>
      <h3>
        <FormattedMessage id="ARTICLE_ADD_FORM_HISTORY" />
      </h3>
      <p>{precursor.name}</p>
      <p>
        <Currency value={precursor.amount} />
      </p>
    </Card>
  );
};

const ToggleActivity: React.FC<{ article: Article }> = ({ article }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  if (!article.isActive) return null;

  const handleDeleteArticle = async () => {
    const res = await startDeletingArticle(dispatch, article.id);
    if (res) {
      history.goBack();
    }
  };

  return (
    <div style={{ margin: '3rem 0' }}>
      <Button padding="1rem" red onClick={handleDeleteArticle}>
        <FormattedMessage id="DELETE_ARTICLE_LABEL" />
      </Button>
    </div>
  );
};
