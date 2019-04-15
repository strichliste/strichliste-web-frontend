import { CancelButton, Flex, Input, styled, Button } from 'bricks-of-sand';
import * as React from 'react';
import { useDispatch } from 'redux-react-hook';

import { usePopularArticles } from '../../store';
import { Article, startLoadingArticles } from '../../store/reducers';
import { Currency } from '../currency';
import { ArticleValidator } from './validator';

const InputSection = styled(Flex)({
  padding: '0 1rem',
  margin: '3rem auto 0 auto',
  maxWidth: '20rem',
  button: {
    marginLeft: '1rem',
  },
});

interface Props {
  userId: string;
  onSelect(article: Article): void;
  onCancel(): void;
}

const ARTICLE_BUBBLE_LIMIT = 10;
export const ArticleSelectionBubbles = (props: Props) => {
  const items = usePopularArticles();
  const dispatch = useDispatch();
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    startLoadingArticles(dispatch);
  }, []);

  return (
    <div>
      <InputSection>
        <Input value={query} onChange={e => setQuery(e.target.value)} />
        <CancelButton onClick={props.onCancel} />
      </InputSection>
      <Flex margin="2rem 0 0 0" flexWrap="wrap" justifyContent="center">
        {items
          .filter(
            item =>
              !query || item.name.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, ARTICLE_BUBBLE_LIMIT)
          .map(item => (
            <ArticleValidator
              key={item.name}
              userId={props.userId}
              value={item.amount}
              render={isValid => (
                <Button
                  disabled={!isValid}
                  onClick={() => {
                    if (isValid) {
                      props.onSelect(item);
                    }
                  }}
                  padding="0.5rem"
                  margin="0.3rem"
                >
                  {item.name} | <Currency hidePlusSign value={item.amount} />
                </Button>
              )}
            />
          ))}
      </Flex>
    </div>
  );
};
