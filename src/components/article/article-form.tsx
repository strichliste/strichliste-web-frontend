import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useArticle } from '../../queries';
import { Article, Barcode, Tag } from '../../types';
import {
  AddArticleParams,
  getArticleHistory,
  useAddArticle,
  useAddBarcode,
  useAddTag,
  useDeleteArticle,
  useDeleteBarcode,
  useDeleteTag,
} from '../../queries/articles';
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
  Ellipsis,
} from '../../bricks';

import styles from './article-form.module.css';
import { useHistory } from '../../routing';
import { FormField } from '../../bricks/input/input';
import { ScrollToTop } from '../common/scroll-to-top';

interface Props {
  articleId?: number;
  onCreated(): void;
}

export const ArticleForm: React.FC<Props> = (props) => {
  const intl = useIntl();
  const article = useArticle(props.articleId);

  return (
    <>
      <ScrollToTop />
      <h2 className={styles.articleName}>
        {article
          ? article.name
          : intl.formatMessage({ id: 'ARTICLE_ADD_FROM_HEADLINE' })}
      </h2>
      <div className={styles.grid}>
        <ArticleDetails article={article} />

        {article && <ArticleTags article={article} />}
        {article && <ArticleBarCodes article={article} />}
        {article && article.precursor && <ArticleHistory article={article} />}
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
  const { mutateAsync: addArticle, isPending: isSaving } = useAddArticle();
  // Re-seed form state when the underlying article identity changes (route
  // change), but NOT when the cached article object is replaced after our own
  // write — keying on `article.id` keeps unsaved edits from being clobbered
  // on cache invalidation.
  const articleId = article?.id;
  React.useEffect(() => {
    setParams(extractParams(article));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);
  const isValid = useArticleValidator(params.amount);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await addArticle({ ...params, precursor: article });
      history.push(`/articles/${result.id}/edit`);
    } catch {
      // mutationCache.onError surfaced a toast.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <h3 className={styles.subHeader}>
          <FormattedMessage id="ARTICLE_ADD_FORM_DETAILS" />
        </h3>
        {article && article.created && (
          <p className={styles.lastEdit}>Last edit: {article.created}</p>
        )}
        <FormField
          inline
          label={<FormattedMessage id="ARTICLE_ADD_FORM_NAME_LABEL" />}
          children={(id: string) => (
            <Input
              id={id}
              value={params.name}
              onChange={(e) => setParams({ ...params, name: e.target.value })}
              type="text"
              required
            />
          )}
        />
        <FormField
          inline
          label={<FormattedMessage id="ARTICLE_ADD_FORM_AMOUNT_LABEL" />}
          children={(id: string) => (
            <CurrencyInput
              id={id}
              noNegative
              value={params.amount}
              onChange={(amount) => setParams({ ...params, amount })}
            />
          )}
        />

        <div className={styles.flexEnd}>
          <AcceptButton
            title={intl.formatMessage({ id: 'ARTICLE_ADD_FROM_ACCEPT' })}
            disabled={!isValid || isSaving}
          />
        </div>
      </Card>
    </form>
  );
};

const ArticleBarCodes: React.FC<{ article: Article }> = ({ article }) => {
  const [barcodes, setBarcodes] = React.useState(article.barcodes || []);
  const { mutateAsync: addBarcode } = useAddBarcode();
  const { mutateAsync: deleteBarcode } = useDeleteBarcode();
  const handleAddBarcode = async (barcode: string) => {
    try {
      const response = await addBarcode({ id: article.id, barcode });
      setBarcodes(response.barcodes);
    } catch {
      // mutationCache.onError surfaced a toast; drop the optimistic empty row.
      setBarcodes(barcodes.filter((item) => item.id !== 0));
    }
  };
  const handleDeleteBarcode = async (barcode: Barcode) => {
    try {
      await deleteBarcode({ articleId: article.id, barcodeId: barcode.id });
      setBarcodes(barcodes.filter((item) => item.id !== barcode.id));
    } catch {
      // toast already shown; keep the row in the list.
    }
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
      getItemValue={(item) => item.barcode}
    />
  );
};

const ArticleTags: React.FC<{ article: Article }> = ({ article }) => {
  const [tags, setTags] = React.useState(article.tags || []);
  const intl = useIntl();
  const { mutateAsync: addTag } = useAddTag();
  const { mutateAsync: deleteTag } = useDeleteTag();
  const handleAddTag = async (tagValue: string) => {
    try {
      const response = await addTag({ id: article.id, tag: tagValue });
      setTags(response.tags);
    } catch {
      setTags(tags.filter((item) => item.id !== 0));
    }
  };
  const handleDeleteTag = async (tag: Tag) => {
    try {
      await deleteTag({ articleId: article.id, tagId: tag.id });
      setTags(tags.filter((item) => item.id !== tag.id));
    } catch {
      // toast already shown; keep the row.
    }
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
      getItemValue={(item) => item.tag}
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
      <h3 className={styles.subHeader}>{headline}</h3>

      {items.map((item) => (
        <ListInput
          placeholder={placeholder}
          handleRemove={() => handleDeleteItem(item)}
          handleAdd={handleSaveItem}
          key={getItemValue(item)}
          item={getItemValue(item)}
        />
      ))}

      <Button primary onClick={handleAddRow}>
        <Plus
          style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}
        />
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
      onSubmit={(e) => {
        e.preventDefault();
        if (!item) {
          handleAdd(value);
        }
      }}
    >
      <Flex margin="0 0 0.5rem 0">
        <Input
          placeholder={placeholder}
          aria-label={placeholder}
          autoFocus={item === ''}
          value={value}
          readOnly={!!item}
          onChange={(e) => setValue(e.target.value)}
        />
        {item ? (
          <CancelButton
            title={intl.formatMessage({ id: 'DELETE_ITEM' })}
            type="button"
            onClick={() => handleRemove(item)}
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
      <h3 className={styles.subHeader}>
        <FormattedMessage id="METRICS_HEADLINE" />
      </h3>
      <FormattedMessage
        id="ARTICLE_USAGE_COUNT_LABEL"
        values={{ value: article.usageCount }}
      />
    </Card>
  );
};

const ArticleHistory: React.FC<{ article: Article }> = ({ article }) => {
  const history = getArticleHistory(article);
  return (
    <Card>
      <h3 className={styles.subHeader}>
        <FormattedMessage id="ARTICLE_ADD_FORM_HISTORY" />
      </h3>
      <ul>
        {history.map((article) => (
          <li className={styles.list} key={article.id}>
            <p>{article.name}</p>
            <p>
              <Currency hidePlusSign value={article.amount} />
            </p>
            <Ellipsis>{article.created}</Ellipsis>
          </li>
        ))}
      </ul>
    </Card>
  );
};

const ToggleActivity: React.FC<{ article: Article }> = ({ article }) => {
  const history = useHistory();
  const { mutateAsync: deleteArticle, isPending } = useDeleteArticle();

  if (!article.isActive) return null;

  const handleDeleteArticle = async () => {
    if (isPending) return;
    try {
      await deleteArticle(article.id);
      history.goBack();
    } catch {
      // toast already shown; stay on the form so the user can retry.
    }
  };

  return (
    <div style={{ margin: '3rem 0' }}>
      <Button
        padding="1rem"
        red
        onClick={handleDeleteArticle}
        disabled={isPending}
      >
        <FormattedMessage id="DELETE_ARTICLE_LABEL" />
      </Button>
    </div>
  );
};
