import React from 'react';
import { useLocalStorage } from '../../hooks/use-storage';
import { Flex, Button, styled } from 'bricks-of-sand';

const Wrapper = styled(Flex)({
  fontSize: '0.7rem',
});
export const useScalingState = () => {
  const [scaling, setScaling] = useLocalStorage('scaling', 0);
  const increment = () => {
    setScaling(scaling + 1);
    location.reload();
  };
  const decrement = () => {
    setScaling(scaling - 1);
    location.reload();
  };

  return {
    scaling,
    increment,
    decrement,
  };
};

export const ScalingButtons = () => {
  const { increment, decrement, scaling } = useScalingState();
  return (
    <Wrapper
      padding="0.5rem"
      alignContent="center"
      alignItems="center"
      justifyContent="flex-end"
    >
      <Button margin="0 1rem" onClick={decrement}>
        -
      </Button>
      {scaling}
      <Button margin="0 1rem" onClick={increment}>
        +
      </Button>
    </Wrapper>
  );
};
