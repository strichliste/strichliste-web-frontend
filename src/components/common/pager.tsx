import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Flex, Button, Arrow } from '../../bricks';

function isPrevDisabled(props: PagerProps): boolean {
  return props.currentPage === 0;
}

function getPageCount(props: PagerProps): number {
  return props.itemCount / props.limit;
}

function pageUp(props: PagerProps): void {
  const nextPage = props.currentPage + 1;
  props.onChange(nextPage);
}
function pageDown(props: PagerProps): void {
  const nextPage = props.currentPage - 1;
  props.onChange(nextPage);
}

function isNextDisabled(props: PagerProps): boolean {
  const pageCount = getPageCount(props);
  return pageCount - props.currentPage < 1;
}

export interface PagerProps {
  currentPage: number;
  itemCount: number;
  limit: number;
  onChange(nextPage: number): void;
}

export function Pager(props: PagerProps): JSX.Element {
  return (
    <Flex margin="1rem 0" alignContent="center" justifyContent="space-between">
      <Button
        primary
        onClick={() => pageDown(props)}
        disabled={isPrevDisabled(props)}
      >
        <Arrow
          style={{
            width: '0.8rem',
            height: '0.8rem',
            marginRight: '0.5rem',
            transform: 'rotate(-180deg)',
          }}
        />
        <FormattedMessage id="PAGER_PREV" />
      </Button>
      <Button
        primary
        onClick={() => pageUp(props)}
        disabled={isNextDisabled(props)}
      >
        <FormattedMessage id="PAGER_NEXT" />
        <Arrow
          style={{
            width: '0.8rem',
            height: '0.8rem',
            marginLeft: '0.5rem',
          }}
        />
      </Button>
    </Flex>
  );
}
