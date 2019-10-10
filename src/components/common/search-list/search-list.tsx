/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Input } from '../../../bricks';

export const useInfiniteScrolling = (
  items: any[],
  PAGE_SIZE: number,
  scrollableTarget: string = '',
  noScrollBarPageOffset = 2
) => {
  const [page, setPage] = useState(1);
  const nextPage = () => {
    setPage(page + 1);
  };
  const pageItems = items.slice(0, PAGE_SIZE * page);

  useEffect(() => {
    const elem = scrollableTarget
      ? document.getElementById(scrollableTarget) || document.body
      : document.body;
    const hasVScroll = elem.scrollHeight > elem.clientHeight;
    const shouldLoadMoreItemsOnStart =
      page === 1 && !hasVScroll && pageItems.length < items.length;

    if (shouldLoadMoreItemsOnStart) {
      setPage(page + noScrollBarPageOffset);
    }
  }, [items]);

  return {
    items: pageItems,
    dataLength: pageItems.length,
    next: nextPage,
    hasMore: true,
    loader: null,
    page,
  };
};

type SearchListComponent = React.FC<{
  items: any[];
  pageSize: number;
  renderItem: any;
  scrollableTarget?: string;
}>;

export const SearchList: SearchListComponent = ({
  items,
  pageSize,
  renderItem,
  scrollableTarget,
}) => {
  const [filter, updateFilter] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(
      filter
        ? items.filter(item =>
            item.name.toLowerCase().includes(filter.toLowerCase())
          )
        : items
    );
  }, [filter, items]);

  return (
    <div>
      <div style={{ margin: '1rem 0' }}>
        <Input
          autoFocus
          placeholder="search"
          value={filter}
          onChange={e => updateFilter(e.target.value)}
        />
      </div>
      <InfiniteList
        scrollableTarget={scrollableTarget}
        items={filteredItems}
        pageSize={pageSize}
        renderItem={renderItem}
      />
    </div>
  );
};

export const InfiniteList: SearchListComponent = ({
  items,
  pageSize,
  renderItem,
  scrollableTarget,
}) => {
  const infiniteProps = useInfiniteScrolling(items, pageSize, scrollableTarget);
  return (
    <InfiniteScroll {...infiniteProps} scrollableTarget={scrollableTarget}>
      {infiniteProps.items.map(renderItem)}
    </InfiniteScroll>
  );
};
