import * as React from 'react';

import { User } from '../../store/reducers';
import { Modal, useModal, Ellipsis } from '../../bricks';
import { Button } from '../../bricks/button/button';
import { UserSearchList } from '../common/search-results';

interface Props {
  userId?: string;
  placeholder: string;
  disabled?: boolean;
  getString?(user: User): string;
  onSelect(user: User): void;
}

export function UserSelection({
  placeholder,
  userId,
  onSelect,
}: Props): JSX.Element {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const modalProps = useModal();
  const [selection, setSelection] = React.useState();
  const handleSelection = (user: User) => {
    setSelection(user);
    onSelect(user);
    modalProps.handleHide();
    if (buttonRef && buttonRef.current) {
      buttonRef.current.focus();
    }
  };

  return (
    <>
      <Button
        ref={buttonRef}
        type="button"
        primary
        onClick={modalProps.handleShow}
        style={{ maxWidth: '150px' }}
      >
        <Ellipsis>{selection ? selection.name : placeholder}</Ellipsis>
      </Button>
      <Modal {...modalProps} id="user-selection">
        <UserSearchList
          scrollableTarget="user-selection"
          userId={userId}
          onUserSelect={handleSelection}
        />
      </Modal>
    </>
  );
}
