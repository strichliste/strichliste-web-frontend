import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppState } from '../../store';
import {
  Article,
  getArticleList,
  startLoadingArticles,
} from '../../store/reducers';
import { Currency } from '../currency';
import { Card, Column, ListItem, Row } from '../ui';

interface OwnProps {}

interface StateProps {
  articles: Article[];
}

interface ActionProps {
  loadArticles(): void;
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
      <>
        <Card>
          <Link to="articles/add">
            <FormattedMessage id="ARTICLE_ADD_LINK" />
          </Link>
        </Card>
        <Card margin="2rem 0 0 0">
          {this.props.articles.map(article => (
            <ListItem key={article.id}>
              <Row>
                <Column width="50%">{article.name}</Column>
                <Column width="25%">{article.barcode}</Column>
                <Column width="25%">
                  <Currency value={article.amount} />
                </Column>
              </Row>
            </ListItem>
          ))}
        </Card>
      </>
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
