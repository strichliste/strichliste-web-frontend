import * as React from 'react';

import {
  Button,
  Card,
  Flex,
  Input,
  PrimaryButton,
  styled,
  withTheme,
} from 'bricks-of-sand';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useDispatch } from 'redux-react-hook';

import { startCreatingUser } from '../../store/reducers';
import { AddIcon } from '../ui/icons/add';
import { EditIcon } from '../ui/icons/edit';

interface Props {
  isActive: boolean;
}

const TRANSITION = 'all 0.5s ease-out';
const Trigger = styled('div')<Props>(
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '6rem',
    form: {
      overflow: 'hidden',
      transition: TRANSITION,
      input: {
        border: 'none',
        minWidth: '7rem',
        marginRight: '1rem',
      },
    },
  },
  props => ({
    borderRadius: props.isActive ? '4px' : '100%',
    svg: {
      fill: props.theme.white,
      transform: props.isActive ? 'rotate(45deg)' : 'rotate(0deg)',
    },
    form: {
      width: props.isActive ? 'auto' : '0rem',
    },
  })
);

const RedBlackButton = withTheme(
  styled(Button)<Props>(
    {
      backgroundColor: 'none',
    },
    props => ({
      '&:hover': {
        background: props.isActive ? props.theme.red : props.theme.primary,
      },
      svg: {
        fill: props.theme.themedWhite,
      },
      background: props.isActive ? props.theme.red : props.theme.primary,
    })
  )
);

export const CreateUserInlineForm = ({
  history,
  isActive,
}: Props & RouteComponentProps) => {
  const [name, setName] = React.useState('');
  const dispatch = useDispatch();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (name) {
      const user = await startCreatingUser(dispatch, trimmedName);
      if (user && user.id) {
        history.push(`/user/${user.id}`);
      }
    } else {
      setName('');
    }
  };
  const toggle = () => {
    if (isActive) {
      history.goBack();
      setName('');
    } else {
      history.push(history.location.pathname + '/add');
    }
  };

  return (
    <Trigger isActive={isActive}>
      <RedBlackButton isActive={isActive} onClick={toggle} isRound>
        <AddIcon />
      </RedBlackButton>
      {isActive && (
        <Card
          flex
          height="6rem"
          alignItems="center"
          margin="0 0 0 1rem"
          level="level3"
        >
          <form onSubmit={submit}>
            <FormattedMessage
              id="USER_CREATE_NAME_LABEL"
              children={text => (
                <Flex>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={text as string}
                    type="text"
                    required
                    minLength={1}
                    maxLength={64}
                    autoFocus={true}
                  />
                  <PrimaryButton type="submit" isRound>
                    <EditIcon />
                  </PrimaryButton>
                </Flex>
              )}
            />
          </form>
        </Card>
      )}
    </Trigger>
  );
};

export const CreateUserInlineFormView = withRouter(CreateUserInlineForm);
