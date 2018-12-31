import {
  AcceptIcon,
  AddIcon,
  Block,
  CancelButton,
  Card,
  Column,
  Flex,
  HoverCard,
  Input,
  PrimaryButton,
} from 'bricks-of-sand';
import * as React from 'react';
import styled from 'react-emotion';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  AddArticleParams,
  Article,
  getArticleById,
  startAddArticle,
} from '../../store/reducers';
import { Scanner } from '../common/scanner';
import { Currency, CurrencyInput } from '../currency';
import { ConnectedTransactionValidator } from '../transaction/validator';
import { Ellipsis } from '../ui';

interface ButtonProps {
  isVisible: boolean;
  idArticle?: number;
  onClick(): void;
}
const ToggleArticleButton: React.SFC<ButtonProps> = props => {
  if (props.isVisible) {
    return <CancelButton onClick={props.onClick} />;
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

interface OwnProps {
  articleId?: number;
  onCreated(): void;
}

interface ActionProps {
  // tslint:disable-next-line:no-any
  addArticle(article: AddArticleParams): any;
}

interface ReduxStateProps {
  article?: Article;
}

interface State {
  params: AddArticleParams;
  isVisible: boolean;
}

type Props = OwnProps & ActionProps & ReduxStateProps;

export class ArticleForm extends React.Component<Props, State> {
  public state = {
    isVisible: false,
    params: { name: '', barcode: '', amount: 0, active: true, precursor: null },
  };

  public componentDidMount(): void {
    if (this.props.article) {
      this.updateParams(this.props.article);
      this.resetState();
    }
  }

  public resetState = () => {
    if (this.props.article) {
      this.setState({
        params: {
          name: this.props.article.name,
          barcode: this.props.article.barcode,
          amount: this.props.article.amount,
          active: this.props.article.active,
          precursor: this.props.article,
        },
      });
    } else {
      this.setState({
        params: {
          name: '',
          barcode: '',
          amount: 0,
          active: true,
          precursor: null,
        },
      });
    }
  };

  public submit = async (e: React.FormEvent, isValid: boolean) => {
    e.preventDefault();
    if (!isValid) {
      return;
    }
    const maybeArticle = await this.props.addArticle(this.state.params);
    if (maybeArticle) {
      this.setState({ isVisible: false });
      this.props.onCreated();
    }
  };

  public updateParams = (params: Partial<AddArticleParams>) => {
    this.setState(state => ({
      params: {
        ...state.params,
        ...params,
      },
    }));
  };

  public toggleIsVisible = () => {
    this.setState(state => ({ isVisible: !state.isVisible }));
    this.resetState();
  };

  public render(): JSX.Element {
    return (
      <Flex alignItems="center" margin="0 0 0.5rem">
        <ToggleArticleButton
          idArticle={this.props.articleId}
          isVisible={this.state.isVisible}
          onClick={this.toggleIsVisible}
        />
        <Column margin="0 0 0 1rem" flex="1">
          {this.state.isVisible && (
            <Card padding="0.5rem" level={'level3'}>
              <ArticleFormGrid
                justifyContent="space-between"
                alignItems="center"
              >
                <label>
                  <FormattedMessage id="ARTICLE_ADD_FORM_NAME_LABEL" />
                </label>
                <Input
                  value={this.state.params.name}
                  onChange={e => this.updateParams({ name: e.target.value })}
                  type="text"
                  required
                />
                <Scanner
                  onChange={barcode =>
                    this.updateParams({
                      barcode,
                    })
                  }
                />
                <label>
                  <FormattedMessage id="ARTICLE_ADD_FORM_BARCODE_LABEL" />
                </label>
                <Input
                  value={this.state.params.barcode}
                  onChange={e => this.updateParams({ barcode: e.target.value })}
                  type="text"
                  required
                />
                <label>
                  <FormattedMessage id="ARTICLE_ADD_FORM_AMOUNT_LABEL" />
                </label>
                <ConnectedTransactionValidator
                  isDeposit={false}
                  value={this.state.params.amount}
                  render={isValid => (
                    <>
                      <form onSubmit={e => this.submit(e, isValid)}>
                        <CurrencyInput
                          noNegative
                          value={this.state.params.amount}
                          onChange={amount => this.updateParams({ amount })}
                        />
                      </form>
                      <PrimaryButton
                        isRound
                        disabled={!isValid}
                        onClick={(e: React.FormEvent) =>
                          this.submit(e, isValid)
                        }
                      >
                        <AcceptIcon />
                      </PrimaryButton>
                    </>
                  )}
                />
              </ArticleFormGrid>
            </Card>
          )}
          {!this.state.isVisible && this.props.articleId && (
            <HoverCard padding="0.5rem" onClick={this.toggleIsVisible}>
              <ArticleGrid>
                <Column>{this.state.params.name}</Column>
                <TextRight>
                  <Ellipsis>{this.state.params.barcode}</Ellipsis>
                </TextRight>
                <TextRight>
                  <Currency value={this.state.params.amount} />
                </TextRight>
              </ArticleGrid>
            </HoverCard>
          )}
          {!this.state.isVisible &&
            !this.props.articleId &&
            this.props.children}
        </Column>
      </Flex>
    );
  }
}

const mapsStateToProps = (state: AppState, { articleId }: OwnProps) => {
  if (!articleId) {
    return { article: undefined };
  }

  return { article: getArticleById(state, articleId) };
};

const mapDispatchToProps: ActionProps = {
  addArticle: startAddArticle,
};

export const ConnectedArticleForm = connect(
  mapsStateToProps,
  mapDispatchToProps
)(ArticleForm);
