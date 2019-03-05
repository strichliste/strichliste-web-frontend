import React, { useEffect } from 'react';
import { useLocalStorage } from '../../hooks/use-storage';
import { TextButton, SearchMinus, SearchPlus, Icon } from 'bricks-of-sand';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let id: any = 0;
export const ScalingButtons = () => {
  const { increment, decrement, scaling } = useScalingState();
  const [isVisible, setIsVisible] = React.useState(true);

  useEffect(() => {
    id = setTimeout(() => {
      setIsVisible(false);
    }, 4000);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <TextButton onClick={decrement}>
        <Icon width="1rem" height="1rem">
          <SearchMinus />
        </Icon>
      </TextButton>

      {isVisible && <TextButton>{scaling}</TextButton>}

      <TextButton onClick={increment}>
        <Icon width="1rem" height="1rem">
          <SearchPlus />
        </Icon>
      </TextButton>
    </>
  );
};
