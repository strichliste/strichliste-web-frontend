import React from 'react';

import { Block, CancelButton, Flex, Input } from 'bricks-of-sand';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'redux-react-hook';
import { useUser } from '../../store';
import { startUpdateUser } from '../../store/reducers';
import { AcceptButton } from '../../components/ui/button';

interface Props {
  userId: string;
  onSave(): void;
  onCancel(): void;
  onDisabled(): void;
}

export const UserEditForm = (props: Props) => {
  const intl = useIntl();
  const [name, setName] = React.useState(''),
    [email, setEmail] = React.useState(''),
    [isDisabled, setDisabled] = React.useState(false),
    user = useUser(props.userId),
    dispatch = useDispatch(),
    submit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

      const user = await startUpdateUser(dispatch, props.userId, {
        name,
        email,
        isDisabled,
      });

      if (user && user.isDisabled) {
        props.onDisabled();
        return;
      }
      if (user && user.id) {
        props.onSave();
      }
    };

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email || '');
      setDisabled(user.isDisabled || false);
    }
  }, [props.userId]);

  return (
    <>
      <form onSubmit={submit}>
        <Block margin="1rem 0">
          <FormattedMessage
            id="USER_EDIT_NAME_LABEL"
            children={text => (
              <Input
                placeholder={text as string}
                value={name}
                onChange={e => setName(e.target.value)}
                minLength={1}
                maxLength={64}
                required
                type="text"
              />
            )}
          />
        </Block>
        <Block margin="1rem 0">
          <FormattedMessage
            id="USER_EDIT_MAIL_LABEL"
            children={text => (
              <Input
                placeholder={text as string}
                value={email || ''}
                onChange={e => setEmail(e.target.value)}
                type="email"
              />
            )}
          />
        </Block>
        <Block margin="1rem 0">
          <Flex alignContent="center" justifyContent="space-between">
            <label>
              <input
                checked={isDisabled}
                onChange={e => setDisabled(e.target.checked)}
                type="checkbox"
              />
              <FormattedMessage id="USER_EDIT_ACTIVE_LABEL" />
            </label>
            <div>
              <CancelButton margin="0 1rem" onClick={props.onCancel} />

              <AcceptButton
                type="submit"
                title={intl.formatMessage({ id: 'USER_EDIT_TRIGGER' })}
              />
            </div>
          </Flex>
          {isDisabled && <FormattedMessage id="USER_EDIT_ACTIVE_WARNING" />}
        </Block>
      </form>
    </>
  );
};
