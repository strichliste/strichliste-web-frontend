import { Block } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  Article,
  getArticleList,
  startLoadingArticles,
} from '../../store/reducers';
import { NavTabMenus } from '../common/nav-tab-menu';
import { ConnectedArticleForm } from './article-form';

interface OwnProps {}

interface StateProps {
  articles: Article[];
}

interface ActionProps {
  // tslint:disable-next-line:no-any
  loadArticles: any;
}

type Props = ActionProps & StateProps & OwnProps;

interface State {}

export class ArticleList extends React.Component<Props, State> {
  public state = {};

  public componentDidMount(): void {
    this.props.loadArticles();
  }

  public render(): JSX.Element {
    return (
      <Block margin="1rem">
        <ConnectedArticleForm onCreated={() => ''}>
          <NavTabMenus
            margin="0.5rem 0"
            breakpoint={0}
            label={<FormattedMessage id="ARTICLE_HEADLINE" />}
            tabs={[
              {
                to: '/articles',
                message: <FormattedMessage id="ARTICLE_HEADLINE" />,
              },
            ]}
          />
        </ConnectedArticleForm>
        {this.props.articles.map(article => (
          <ConnectedArticleForm
            articleId={article.id}
            key={article.id}
            onCreated={() => ''}
          />
        ))}
      </Block>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  articles: getArticleList(state),
});

const mapDispatchToProps = {
  loadArticles: startLoadingArticles,
};

export const ConnectedArticleList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleList);
