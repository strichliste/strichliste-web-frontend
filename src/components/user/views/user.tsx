/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AutoGrid,
  HideByBreakPoint,
  breakPoints,
  styled,
} from 'bricks-of-sand';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, RouteComponentProps } from 'react-router-dom';

import { useFilteredUsers } from '../../../store';
import { startLoadingUsers } from '../../../store/reducers';
import { NavTabMenus } from '../../common/nav-tab-menu';
import { CreateUserInlineFormView } from '../create-user-inline-form';
import { UserCard } from '../user-card';
import { useDispatch } from 'redux-react-hook';

interface OwnProps {
  isActive: boolean;
  showCreateUserForm?: boolean;
}

type UserProps = OwnProps & RouteComponentProps;

const GridWrapper = styled('div')({
  marginLeft: '0rem',
  [breakPoints.tablet]: {
    marginLeft: '8rem',
  },
});

const CreateUserPosition = styled('div')({
  zIndex: 10,
  position: 'absolute',
  marginLeft: '-2rem',
});

const CreateUserGridPosition = styled('div')({
  position: 'relative',
  '>div': {
    zIndex: 10,
    position: 'absolute',
    minWidth: '100%',
  },
});

export const User = (props: UserProps) => {
  const userIds = useFilteredUsers(props.isActive);
  const dispatch = useDispatch();

  useEffect(() => {
    startLoadingUsers(dispatch);
  }, [props.isActive]);

  return (
    <>
      <GridWrapper>
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
        <HideByBreakPoint min={768} max={Infinity}>
          <CreateUserPosition>
            <CreateUserInlineFormView
              isActive={props.showCreateUserForm || false}
            />
          </CreateUserPosition>
        </HideByBreakPoint>
        <AutoGrid rows="5rem" columns="8rem">
          <HideByBreakPoint min={0} max={767}>
            <CreateUserGridPosition>
              <CreateUserInlineFormView
                isActive={props.showCreateUserForm || false}
              />
            </CreateUserGridPosition>
          </HideByBreakPoint>
          {userIds.map(id => (
            <Link key={id} to={`/user/${id}`}>
              <UserCard id={id} />
            </Link>
          ))}
        </AutoGrid>
      </GridWrapper>
    </>
  );
};
