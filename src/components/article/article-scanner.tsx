import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Article,
  getArticleByBarcode,
  startCreatingTransaction,
} from '../../store/reducers';
import { Scanner } from '../common/scanner';
import { Toast } from '../common/toast';
import { Currency } from '../currency';
import { useDispatch } from 'redux-react-hook';
import { Flex, AcceptIcon } from '../../bricks';

interface Props {
  userId: string;
}

export const ArticleScanner = (props: Props) => {
  const [message, setMessage] = React.useState('');
  const [article, setArticle] = React.useState<Article | undefined>(undefined);
  const dispatch = useDispatch();

  const handleChange = async (barcode: string) => {
    setMessage(barcode);
    try {
      const article = await getArticleByBarcode(dispatch, barcode);
      setMessage('ARTICLE_FETCHED_BY_BARCODE');
      setArticle(article);
      if (article) {
        startCreatingTransaction(dispatch, props.userId, {
          articleId: article.id,
        });
      }
    } catch (error) {
      setMessage(':(');
    }
  };
  const resetState = () => {
    setMessage('');
    setArticle(undefined);
  };

  return (
    <>
      {message && (
        <Toast onFadeOut={resetState} fadeOutSeconds={6}>
          <ToastContent article={article} message={message} />
        </Toast>
      )}
      <Scanner onChange={handleChange} />
    </>
  );
};

interface ToastProps {
  message: string;
  article: Article | undefined;
}

function ToastContent({ article, message }: ToastProps): JSX.Element {
  if (article === undefined) {
    return <>{message}</>;
  }
  return (
    <div>
      <Flex justifyContent="center" alignContent="center">
        <AcceptIcon />
        <FormattedMessage id="ARTICLE_FETCHED_BY_BARCODE" />
        &#8594; {article.name}
        <Currency value={article.amount} />
      </Flex>
    </div>
  );
}
