import React from 'react';
import { Button, Ellipsis } from '../../../../bricks';

// const SearchResultItemButton = styled(Button)({
//   display: 'flex',
//   padding: '1.5rem',
//   width: '100%',
//   alignContent: 'center',
//   justifyContent: 'center',
//   marginBottom: '2px',
// });

export const SearchResultItem: React.FC<{ name: string; onClick(): void }> = ({
  name,
  onClick,
}) => {
  return (
    <Button onClick={onClick}>
      <Ellipsis>{name}</Ellipsis>
    </Button>
  );
};
