import Downshift from 'downshift';
import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  Article,
  getPopularArticles,
  startLoadingArticles,
} from '../../store/reducers';
import { Currency } from '../currency';
import { Card, Column, MaterialInput, Row } from '../ui';

interface OwnProps {
  onSelect(article: Article): void;
}

interface StateProps {
  articles: Article[];
}

interface ActionProps {
  loadArticles(): void;
}

type Props = ActionProps & StateProps & OwnProps;

interface State {}

export class ArticleSearchList extends React.Component<Props, State> {
  public state = {};

  public componentDidMount(): void {
    this.props.loadArticles();
  }

  public render(): JSX.Element {
    const items = this.props.articles;

    return (
      <>
        <Downshift
          onChange={selection => this.props.onSelect(selection)}
          itemToString={item => (item ? item.value : '')}
        >
          {({ getInputProps, getItemProps, getMenuProps, inputValue }) => (
            <div>
              <MaterialInput>
                <input {...getInputProps()} autoFocus={true} />
              </MaterialInput>
              <div {...getMenuProps()}>
                {items
                  .filter(
                    item =>
                      !inputValue ||
                      item.name.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((item, index) => (
                    <Card
                      margin="0.3rem 1rem"
                      {...getItemProps({
                        key: item.name,
                        index,
                        item,
                      })}
                    >
                      <Row>
                        <Column width="75%">{item.name}</Column>
                        <Column width="25%">
                          <Currency value={item.amount} />
                        </Column>
                      </Row>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </Downshift>
      </>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  articles: getPopularArticles(state),
});

const mapDispatchToProps = {
  loadArticles: startLoadingArticles,
};

export const ConnectedArticleSearchList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleSearchList);
