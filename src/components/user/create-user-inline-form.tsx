import * as React from 'react';

import { useIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from '../../routing';

import { useCreateUser } from '../../queries/users';
import { Button, Flex, Input, AddIcon, EditIcon } from '../../bricks';
import { useModal, Modal } from '../../bricks/modal/modal';

interface Props {
  isActive: boolean;
}

export const CreateUserInlineForm = ({
  history,
}: Props & RouteComponentProps) => {
  const modalProps = useModal();
  const [name, setName] = React.useState('');
  const intl = useIntl();
  const { mutateAsync: createUser, isPending } = useCreateUser();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (name) {
      const user = await createUser(trimmedName);
      if (user && user.id) {
        history.push(`/user/${user.id}`);
      }
    } else {
      setName('');
    }
  };

  return (
    <div title={intl.formatMessage({ id: 'USER_CREATE_NAME_LABEL' })}>
      <Button
        highlight
        onClick={modalProps.handleShow}
        fab
        aria-label={intl.formatMessage({ id: 'USER_CREATE_TRIGGER' })}
      >
        <AddIcon />
      </Button>
      <Modal
        label={intl.formatMessage({ id: 'USER_CREATE_HEADLINE' })}
        {...modalProps}
      >
        <form onSubmit={submit}>
          <Flex>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={intl.formatMessage({
                id: 'USER_CREATE_NAME_LABEL',
              })}
              type="text"
              required
              minLength={1}
              maxLength={64}
              autoFocus={true}
            />
            <Button
              margin="0 0 0 1rem"
              type="submit"
              fab
              highlight
              disabled={isPending}
              aria-label={intl.formatMessage({ id: 'USER_CREATE_TRIGGER' })}
            >
              <EditIcon />
            </Button>
          </Flex>
        </form>
      </Modal>
    </div>
  );
};

export const CreateUserInlineFormView = withRouter(CreateUserInlineForm);
