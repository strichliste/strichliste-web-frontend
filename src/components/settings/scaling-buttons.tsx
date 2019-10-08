import React from 'react';
import { useLocalStorage } from '../../hooks/use-storage';
import { Button, SearchMinus, SearchPlus } from '../../bricks';

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
      <Button onClick={decrement}>
        <SearchMinus />
      </Button>

      <Button onClick={increment}>
        <SearchPlus />
      </Button>
    </>
  );
};
