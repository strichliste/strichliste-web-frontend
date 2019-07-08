import React from 'react';

import { Ellipsis, Button, styled } from 'bricks-of-sand';

const SearchResultItemButton = styled(Button)({
  display: 'flex',
  padding: '1.5rem',
  width: '100%',
  alignContent: 'center',
  justifyContent: 'center',
  marginBottom: '2px',
});

export const SearchResultItem: React.FC<{ name: string; onClick(): void }> = ({
  name,
  onClick,
}) => {
  return (
    <SearchResultItemButton onClick={onClick}>
      <div style={{ width: '250px' }}>
        <Ellipsis>{name}</Ellipsis>
      </div>
    </SearchResultItemButton>
  );
};
