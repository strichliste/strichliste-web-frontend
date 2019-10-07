import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';

import { useFilteredUsers } from '../../../../store';
import { startLoadingUsers } from '../../../../store/reducers';
import { NavTabMenus } from '../../../common/nav-tab-menu';
import { CreateUserInlineFormView } from '../../create-user-inline-form';
import { useDispatch } from 'redux-react-hook';
import { ScrollToTop } from '../../../common/scroll-to-top';
import { UserList } from '../../user-list';

import styles from './user.module.css';

interface OwnProps {
  isActive: boolean;
  showCreateUserForm?: boolean;
}

type UserProps = OwnProps & RouteComponentProps;

export const User = (props: UserProps) => {
  const userIds = useFilteredUsers(props.isActive);
  const dispatch = useDispatch();

  useEffect(() => {
    startLoadingUsers(dispatch);
  }, [props.isActive, dispatch]);

  return (
    <>
      <ScrollToTop />
      <div className={styles.wrapper}>
        <div className={styles.addUserButton}>
          <CreateUserInlineFormView
            isActive={props.showCreateUserForm || false}
          />
        </div>
        <NavTabMenus
          margin="2rem 1rem"
          breakpoint={320}
          label={<FormattedMessage id="USER_ACTIVE_LINK" />}
          tabs={[
            {
              to: '/user/active',
              message: <FormattedMessage id="USER_ACTIVE_LINK" />,
            },
            {
              to: '/user/inactive',
              message: <FormattedMessage id="USER_INACTIVE_LINK" />,
            },
          ]}
        />
        <UserList userIds={userIds} />
      </div>
    </>
  );
};
