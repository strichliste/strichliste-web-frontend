import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Article } from '../../types';
import { fetchArticleByBarcode } from '../../queries/articles';
import { useCreateTransaction } from '../../queries/transactions';
import { Scanner } from '../common/scanner';
import { Toast } from '../common/toast';
import { Currency } from '../currency';
import { Flex, AcceptIcon } from '../../bricks';

interface Props {
  userId: string;
}

export const ArticleScanner = (props: Props) => {
  const [message, setMessage] = React.useState('');
  const [article, setArticle] = React.useState<Article | undefined>(undefined);
  const { mutate: createTransaction, isPending } = useCreateTransaction();
  // Abort an in-flight barcode lookup when a new scan comes in (or on
  // unmount) — otherwise a slow earlier response can overwrite the state
  // for a newer scan.
  const lookupController = React.useRef<AbortController | null>(null);
  React.useEffect(
    () => () => lookupController.current?.abort(),
    []
  );

  const handleChange = async (barcode: string) => {
    // Ignore rapid re-scans while a previous buy is still in flight.
    if (isPending) return;
    lookupController.current?.abort();
    const controller = new AbortController();
    lookupController.current = controller;
    setMessage(barcode);
    try {
      const article = await fetchArticleByBarcode(barcode, controller.signal);
      if (controller.signal.aborted) return;
      setMessage('ARTICLE_FETCHED_BY_BARCODE');
      setArticle(article);
      createTransaction({
        userId: props.userId,
        params: { articleId: article.id },
      });
    } catch (e) {
      if ((e as DOMException)?.name === 'AbortError') return;
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

function ToastContent({ article, message }: ToastProps): React.JSX.Element {
  if (article === undefined) {
    return <>{message}</>;
  }
  return (
    <Flex justifyContent="center" alignItems="center" alignContent="center">
      <AcceptIcon style={{ marginRight: '1rem' }} />
      <FormattedMessage id="ARTICLE_FETCHED_BY_BARCODE" />
      &#8594; {article.name}
      <Currency value={article.amount} />
    </Flex>
  );
}
