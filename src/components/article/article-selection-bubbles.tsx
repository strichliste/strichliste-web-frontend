import { CancelButton, Card, Flex, Input, styled } from 'bricks-of-sand';
import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  Article,
  getPopularArticles,
  startLoadingArticles,
} from '../../store/reducers';
import { Currency } from '../currency';
import { ConnectedArticleValidator } from './validator';

const InputSection = styled(Flex)({
  padding: '0 1rem',
  margin: '3rem auto 0 auto',
  maxWidth: '20rem',
  button: {
    marginLeft: '1rem',
  },
});

interface OwnProps {
  userId: number;
  onSelect(article: Article): void;
  onCancel(): void;
}

interface StateProps {
  articles: Article[];
}

interface ActionProps {
  // tslint:disable-next-line:no-any
  loadArticles: any;
}

type Props = ActionProps & StateProps & OwnProps;

interface State {
  query: string;
}

const ARTICLE_BUBBLE_LIMIT = 10;
export class ArticleSelectionBubbles extends React.Component<Props, State> {
  public state = {
    query: '',
  };

  public componentDidMount(): void {
    this.props.loadArticles();
  }

  public render(): JSX.Element {
    const items = this.props.articles;

    return (
      <div>
        <InputSection>
          <Input
            value={this.state.query}
            // tslint:disable-next-line:no-any
            onChange={(e: any) => this.setState({ query: e.target.value })}
          />
          <CancelButton onClick={this.props.onCancel} />
        </InputSection>
        <Flex margin="2rem 0 0 0" flexWrap="wrap" justifyContent="center">
          {items
            .filter(
              item =>
                !this.state.query ||
                item.name.toLowerCase().includes(this.state.query.toLowerCase())
            )
            .slice(0, ARTICLE_BUBBLE_LIMIT)
            .map(item => (
              <ConnectedArticleValidator
                key={item.name}
                userId={this.props.userId}
                value={item.amount}
                render={isValid => (
                  <Card
                    style={{
                      opacity: isValid ? 1 : 0.5,
                    }}
                    onClick={() => {
                      if (isValid) {
                        this.props.onSelect(item);
                      }
                    }}
                    padding="0.5rem"
                    margin="0.3rem"
                  >
                    {item.name} | <Currency value={item.amount} />
                  </Card>
                )}
              />
            ))}
        </Flex>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  articles: getPopularArticles(state),
});

const mapDispatchToProps = {
  loadArticles: startLoadingArticles,
};

export const ConnectedArticleSelectionBubbles = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleSelectionBubbles);
