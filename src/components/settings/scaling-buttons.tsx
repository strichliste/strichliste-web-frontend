import React from 'react';
import { Button, SearchMinus, SearchPlus } from '../../bricks';

const STORAGE_KEY = 'scaling';

export const useScalingState = () => {
  const storeScaling = localStorage.getItem(STORAGE_KEY);
  const initialScaling = storeScaling === null ? 16 : Number(storeScaling);
  const [scaling, setScaling] = React.useState(initialScaling);

  const setScalingToDocument = () => {
    document.documentElement.style.setProperty(
      '--baseFontSize',
      `${scaling}px`
    );
    document.documentElement.style.setProperty(
      '--baseFontSizeLaptop',
      `${scaling + 2}px`
    );
    document.documentElement.style.setProperty(
      '--baseFontSizeDesktop',
      `${scaling + 4}px`
    );
  };

  React.useEffect(() => {
    setScalingToDocument();
  }, [scaling]);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, `${scaling}`);
  }, [scaling]);

  const increment = () => {
    const nextScaling = scaling + 1;
    setScaling(nextScaling);
  };
  const decrement = () => {
    const nextScaling = scaling - 1;

    if (nextScaling > 10) {
      setScaling(nextScaling);
    }
  };

  return {
    scaling,
    increment,
    decrement,
    setScalingToDocument,
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
