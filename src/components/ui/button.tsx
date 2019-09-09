import React from 'react';
import { withTheme, Button, AcceptIcon } from 'bricks-of-sand';

export const AcceptButton = withTheme(
  ({ theme, margin, onClick, disabled, type = 'button' }: any) => (
    <Button
      disabled={disabled}
      type={type}
      onClick={onClick}
      margin={margin}
      color={theme.buttonAcceptFont}
      hasShadow
      background={theme.buttonAcceptBackground}
      fontSize="1rem"
      isRound
    >
      <AcceptIcon />
    </Button>
  )
);
