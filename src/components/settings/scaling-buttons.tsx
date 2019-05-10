import React from 'react';
import { useLocalStorage } from '../../hooks/use-storage';
import { TextButton, SearchMinus, SearchPlus, Icon } from 'bricks-of-sand';

export const useScalingState = () => {
  const [scaling, setScaling] = useLocalStorage('scaling', 0);
  const increment = () => {
    setScaling(scaling + 1);
    window.location.reload();
  };
  const decrement = () => {
    setScaling(scaling - 1);
    window.location.reload();
  };

  return {
    scaling,
    increment,
    decrement,
  };
};

export const ScalingButtons = () => {
  const { increment, decrement } = useScalingState();

  return (
    <>
      <TextButton onClick={decrement}>
        <Icon width="1rem" height="1rem">
          <SearchMinus />
        </Icon>
      </TextButton>

      <TextButton onClick={increment}>
        <Icon width="1rem" height="1rem">
          <SearchPlus />
        </Icon>
      </TextButton>
    </>
  );
};
