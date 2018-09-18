import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, CenterSection } from '../ui';

export interface PagerProps {
  currentPage: number;
  itemCount: number;
  limit: number;
  onChange(nextPage: number): void;
}

export function Pager(props: PagerProps): JSX.Element {
  return (
    <CenterSection>
      <Button onClick={() => pageDown(props)} disabled={isPrevDisabled(props)}>
        <FormattedMessage id="PAGER_PREV" />
      </Button>
      <Button onClick={() => pageUp(props)} disabled={isNextDisabled(props)}>
        <FormattedMessage id="PAGER_NEXT" />
      </Button>
    </CenterSection>
  );
}

function isPrevDisabled(props: PagerProps): boolean {
  return props.currentPage === 0;
}

function isNextDisabled(props: PagerProps): boolean {
  const pageCount = getPageCount(props);
  return pageCount - props.currentPage < 1;
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
