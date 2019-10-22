import * as React from 'react';
import { Ellipsis } from '../../bricks';
import classnames from 'classnames';

import styles from './user-name.module.css';

export interface UserNameProps {
  name: string;
  width?: string;
  center?: boolean;
}

export function UserName({ name, width, center }: UserNameProps): JSX.Element {
  return (
    <div
      className={classnames(styles.wrapper, { [styles.center]: center })}
      style={{ maxWidth: width }}
    >
      <Ellipsis>{name}</Ellipsis>
    </div>
  );
}
