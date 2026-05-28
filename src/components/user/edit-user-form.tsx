import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import { useUser } from '../../queries';
import { useUpdateUser } from '../../queries/users';
import { Input, Flex, CancelButton, AcceptButton } from '../../bricks';

interface Props {
  userId: string;
  onSave(): void;
  onCancel(): void;
  onDisabled(): void;
}

const formStyle = {
  marginBottom: '1rem',
};

export const UserEditForm = (props: Props) => {
  const intl = useIntl();
  const { mutateAsync: updateUser, isPending } = useUpdateUser();
  const [name, setName] = React.useState(''),
    [email, setEmail] = React.useState(''),
    [isDisabled, setDisabled] = React.useState(false),
    user = useUser(props.userId),
    submit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      try {
        const user = await updateUser({
          userId: props.userId,
          params: { name, email, isDisabled },
        });
        if (user.isDisabled) {
          props.onDisabled();
          return;
        }
        props.onSave();
      } catch {
        // mutationCache.onError surfaced a toast.
      }
    };

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email || '');
      setDisabled(user.isDisabled || false);
    }
    // eslint-disable-next-line
  }, [props.userId]);

  return (
    <form onSubmit={submit}>
      <div style={formStyle}>
        <FormattedMessage
          id="USER_EDIT_NAME_LABEL"
          children={(text) => (
            <Input
              placeholder={text as unknown as string}
              aria-label={text as unknown as string}
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={1}
              maxLength={64}
              required
              type="text"
            />
          )}
        />
      </div>
      <div style={formStyle}>
        <FormattedMessage
          id="USER_EDIT_MAIL_LABEL"
          children={(text) => (
            <Input
              placeholder={text as unknown as string}
              aria-label={text as unknown as string}
              value={email || ''}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          )}
        />
      </div>
      <div style={formStyle}>
        <Flex alignContent="center" justifyContent="space-between">
          <label>
            <input
              checked={isDisabled}
              onChange={(e) => setDisabled(e.target.checked)}
              type="checkbox"
            />
            <FormattedMessage id="USER_EDIT_ACTIVE_LABEL" />
          </label>
          <div>
            <CancelButton margin="0 1rem" onClick={props.onCancel} />

            <AcceptButton
              type="submit"
              disabled={isPending}
              title={intl.formatMessage({ id: 'USER_EDIT_TRIGGER' })}
            />
          </div>
        </Flex>
        {isDisabled && <FormattedMessage id="USER_EDIT_ACTIVE_WARNING" />}
      </div>
    </form>
  );
};
