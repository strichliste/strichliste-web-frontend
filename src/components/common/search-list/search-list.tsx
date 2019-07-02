/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Input } from 'bricks-of-sand';

export const useInfiniteScrolling = (
  items: any[],
  PAGE_SIZE: number,
  noScrollBarPageOffset = 2
) => {
  const [page, setPage] = useState(1);
  const nextPage = () => {
    setPage(page + 1);
  };
  const pageItems = items.slice(0, PAGE_SIZE * page);

  useEffect(() => {
    const hasVScroll = document.body.scrollHeight > document.body.clientHeight;
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
}>;

export const SearchList: SearchListComponent = ({
  items,
  pageSize,
  renderItem,
}) => {
  const [filter, updateFilter] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(
      filter
        ? items.filter(item => item.name.toLowerCase().includes(filter))
        : items
    );
  }, [filter, items]);

  return (
    <div>
      <Input value={filter} onChange={e => updateFilter(e.target.value)} />
      <InfiniteList
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
}) => {
  const infiniteProps = useInfiniteScrolling(items, pageSize);

  return (
    <InfiniteScroll {...infiniteProps}>
      {infiniteProps.items.map(renderItem)}
    </InfiniteScroll>
  );
};
