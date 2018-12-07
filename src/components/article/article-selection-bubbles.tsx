import { CancelButton, Card, Flex, Input } from 'bricks-of-sand';
import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  Article,
  getPopularArticles,
  startLoadingArticles,
} from '../../store/reducers';
import { Currency } from '../currency';

const InputSection = styled(Flex)({
  padding: '0 1rem',
  margin: '3rem auto 0 auto',
  maxWidth: '20rem',
  button: {
    marginLeft: '1rem',
  },
});

interface OwnProps {
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
            onChange={e => this.setState({ query: e.target.value })}
            autoFocus={true}
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
            .map(item => (
              <Card
                onClick={() => this.props.onSelect(item)}
                padding="0.5rem"
                margin="0.3rem"
                key={item.name}
              >
                {item.name} | <Currency value={item.amount} />
              </Card>
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
