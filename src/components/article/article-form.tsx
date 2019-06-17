import {
  AcceptIcon,
  AddIcon,
  Block,
  Card,
  ClickOutside,
  Column,
  Ellipsis,
  Flex,
  HoverCard,
  Input,
  PrimaryButton,
  CancelButton,
  styled,
} from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'redux-react-hook';
import { useToggle } from '../../hooks/use-toggle';
import { useArticle } from '../../store';
import {
  Article,
  startAddArticle,
  startDeletingArticle,
} from '../../store/reducers';
import { Scanner } from '../common/scanner';
import { Currency, CurrencyInput } from '../currency';
import { useArticleValidator } from './validator';
import { Trash } from '../ui/icons/trash';

interface ButtonProps {
  isVisible: boolean;
  idArticle?: number;
  onClick(): void;
}

const ToggleArticleButton: React.FC<ButtonProps> = props => {
  if (props.isVisible) {
    return (
      <CancelButton
        Icon={props.idArticle ? Trash : undefined}
        onClick={props.onClick}
      ></CancelButton>
    );
  }

  if (props.idArticle) {
    return <Block width="2rem" />;
  }

  return (
    <PrimaryButton onClick={props.onClick} isRound>
      <AddIcon />
    </PrimaryButton>
  );
};

const ArticleFormGrid = styled(Flex)({
  '@media(max-width: 30em)': {
    display: 'block',
    textAlign: 'left',
    div: {
      width: '100%!important',
    },

    input: {
      margin: '0 0 1rem 0',
    },
  },
  fontSize: '0.8rem',
  input: {
    marginRight: '1rem',
  },
  label: {
    marginRight: '0.5rem',
  },
});

const ArticleGrid = styled('div')({
  cursor: 'pointer',
  display: 'grid',
  gridGap: '1rem',
  '@media screen and (min-width: 500px)': {
    gridTemplateColumns: '1fr 9rem 5rem',
  },
});

const TextRight = styled('div')({
  '@media screen and (min-width: 500px)': {
    textAlign: 'right',
  },
});

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
  const { toggle, updateToggle, setToggle } = useToggle(false);
  const [params, setParams] = React.useState(initialParams);
  const isValidArticle = useArticleValidator(params.amount);

  const dispatch = useDispatch();
  const article = useArticle(props.articleId);

  React.useEffect(() => {
    resetArticle(article, setParams);
  }, [article]);

  const deleteArticle = () => {
    if (article) {
      startDeletingArticle(dispatch, article.id);
    }
  };

  const handleClickOutSide = () => {
    resetArticle(article, setParams);
    setToggle(false);
  };

  const handleToggleClick = () => {
    if (toggle) {
      deleteArticle();
      setToggle(false);
    } else {
      setToggle(true);
    }
  };

  const submit = async (e: React.FormEvent, isValid: boolean) => {
    e.preventDefault();
    if (!isValid) {
      return;
    }

    const maybeArticle = await startAddArticle(dispatch, params);

    if (maybeArticle) {
      updateToggle();
      props.onCreated();
    }
  };

  return (
    <ClickOutside onClick={handleClickOutSide}>
      <Flex alignItems="center" margin="0 0 0.5rem">
        <ToggleArticleButton
          idArticle={props.articleId}
          isVisible={toggle}
          onClick={handleToggleClick}
        />
        <Column margin="0 0 0 1rem" flex="1">
          {toggle && (
            <Card padding="0.5rem" level={'level3'}>
              <ArticleFormGrid
                justifyContent="space-between"
                alignItems="center"
              >
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
                  onChange={e =>
                    setParams({ ...params, barcode: e.target.value })
                  }
                  type="text"
                  required
                />
                <label htmlFor="article_add_amount_label">
                  <FormattedMessage id="ARTICLE_ADD_FORM_AMOUNT_LABEL" />
                </label>
                <form onSubmit={e => submit(e, isValidArticle)}>
                  <CurrencyInput
                    id="article_add_amount_label"
                    noNegative
                    value={params.amount}
                    onChange={amount => setParams({ ...params, amount })}
                  />
                </form>
                <PrimaryButton
                  isRound
                  disabled={!isValidArticle}
                  onClick={(e: React.FormEvent) => submit(e, isValidArticle)}
                >
                  <AcceptIcon />
                </PrimaryButton>
              </ArticleFormGrid>
            </Card>
          )}
          {!toggle && props.articleId && (
            <HoverCard padding="0.5rem" onClick={updateToggle}>
              <ArticleGrid>
                <Column>{params.name}</Column>
                <TextRight>
                  <Ellipsis>{params.barcode}</Ellipsis>
                </TextRight>
                <TextRight>
                  <Currency value={params.amount} />
                </TextRight>
              </ArticleGrid>
            </HoverCard>
          )}
          {!toggle && !props.articleId && props.children}
        </Column>
      </Flex>
    </ClickOutside>
  );
};
