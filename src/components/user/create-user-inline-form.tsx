import * as React from 'react';

import { useIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useDispatch } from 'redux-react-hook';

import { startCreatingUser } from '../../store/reducers';
import { AddIcon } from '../ui/icons/add';
import { EditIcon } from '../ui/icons/edit';
import { Button, Flex, Input } from '../../bricks';
import { useModal, Modal } from '../../bricks/modal/modal';

interface Props {
  isActive: boolean;
}

export const CreateUserInlineForm = ({
  history,
  isActive,
}: Props & RouteComponentProps) => {
  const modalProps = useModal();
  const [name, setName] = React.useState('');
  const dispatch = useDispatch();
  const intl = useIntl();

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

  return (
    <div title={intl.formatMessage({ id: 'USER_CREATE_NAME_LABEL' })}>
      <Button highlight onClick={modalProps.handleShow} fab>
        <AddIcon />
      </Button>
      <Modal backDropTile="close" {...modalProps}>
        <form onSubmit={submit}>
          <Flex>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={intl.formatMessage({
                id: 'USER_CREATE_NAME_LABEL',
              })}
              type="text"
              required
              minLength={1}
              maxLength={64}
              autoFocus={true}
            />
            <Button type="submit" fab primary>
              <EditIcon />
            </Button>
          </Flex>
        </form>
      </Modal>
    </div>
  );
};

export const CreateUserInlineFormView = withRouter(CreateUserInlineForm);
