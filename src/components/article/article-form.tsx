import { Button, theme } from 'bricks-of-sand';
import * as React from 'react';
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
import { CurrencyInput } from '../currency';
import { FormField } from '../ui';

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

type Props = OwnProps & ActionProps & ReduxStateProps;

export class ArticleForm extends React.Component<Props, AddArticleParams> {
  public state = {
    name: '',
    barcode: '',
    amount: 0,
    active: true,
    precursor: null,
  };

  public componentDidMount(): void {
    if (this.props.article) {
      this.setState({
        name: this.props.article.name,
        barcode: this.props.article.barcode,
        amount: this.props.article.amount,
        active: this.props.article.active,
        precursor: this.props.article,
      });
    }
  }

  public submit = async () => {
    const maybeArticle = await this.props.addArticle(this.state);
    if (maybeArticle) {
      this.props.onCreated();
    }
  };

  public render(): JSX.Element {
    return (
      <>
        <div>
          <FormField>
            <FormattedMessage
              id="ARTICLE_ADD_FORM_NAME_LABEL"
              children={text => (
                <input
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                  placeholder={text as string}
                  autoFocus={true}
                  type="text"
                  required
                />
              )}
            />
          </FormField>
          <FormField>
            <Scanner onChange={barcode => this.setState({ barcode })} />
            <FormattedMessage
              id="ARTICLE_ADD_FORM_BARCODE_LABEL"
              children={text => (
                <input
                  value={this.state.barcode}
                  onChange={e => this.setState({ barcode: e.target.value })}
                  placeholder={text as string}
                  type="text"
                  required
                />
              )}
            />
          </FormField>
          <FormField>
            <FormattedMessage
              id="ARTICLE_ADD_FORM_AMOUNT_LABEL"
              children={text => (
                <CurrencyInput
                  value={this.state.amount}
                  placeholder={text as string}
                  onChange={amount => this.setState({ amount })}
                />
              )}
            />
          </FormField>
          <FormField>
            <Button onClick={this.submit} color={theme.green} type="submit">
              <FormattedMessage id="ARTICLE_ADD_FORM_SUBMIT" />
            </Button>
          </FormField>
        </div>
      </>
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
