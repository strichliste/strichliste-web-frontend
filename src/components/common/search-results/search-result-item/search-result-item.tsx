import React from 'react';
import { Button, Ellipsis } from '../../../../bricks';

import styles from './search-result-item.module.css';

export const SearchResultItem: React.FC<{ name: string; onClick(): void }> = ({
  name,
  onClick,
}) => {
  return (
    <Button primary className={styles.item} onClick={onClick}>
      <Ellipsis>{name}</Ellipsis>
    </Button>
  );
};
