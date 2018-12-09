import {
  AcceptButton,
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

const ArticleGrid = styled(Flex)({
  fontSize: '0.8rem',
  input: {
    marginRight: '1rem',
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
      this.setState({
        params: {
          name: this.props.article.name,
          barcode: this.props.article.barcode,
          amount: this.props.article.amount,
          active: this.props.article.active,
          precursor: this.props.article,
        },
      });
    }
  }

  public submit = async () => {
    const maybeArticle = await this.props.addArticle(this.state.params);
    if (maybeArticle) {
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
  };

  public render(): JSX.Element {
    return (
      <Flex alignItems="center" padding="0.3rem">
        <ToggleArticleButton
          idArticle={this.props.articleId}
          isVisible={this.state.isVisible}
          onClick={this.toggleIsVisible}
        />
        <Column margin="0 0 0 1rem" flex="1">
          {this.state.isVisible && (
            <Card padding="0.5rem" level={'level3'}>
              <ArticleGrid justifyContent="space-between" alignItems="center">
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
                <CurrencyInput
                  value={this.state.params.amount}
                  onChange={amount => this.updateParams({ amount })}
                />
                <AcceptButton onClick={this.submit} />
              </ArticleGrid>
            </Card>
          )}
          {!this.state.isVisible && this.props.articleId && (
            <HoverCard padding="0.5rem">
              <ArticleGrid
                onClick={this.toggleIsVisible}
                justifyContent="space-between"
                alignItems="center"
              >
                <Column flex="1 0 0">{this.state.params.name}</Column>
                <Column width="8rem">{this.state.params.barcode}</Column>
                <Currency value={this.state.params.amount} />
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
