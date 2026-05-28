import React from 'react';
import { Tag } from '../../types';
import { useTags } from '../../queries/articles';
import { Button } from '../../bricks';

import styles from './article-tag-filter.module.css';

export const ArticleTagFilter: React.FC<{
  onFilterChange(activeTags: Record<string, string>): void;
}> = ({ onFilterChange }) => {
  const tags = useTags();
  const [activeTags, setActiveTag] = React.useState<Record<string, string>>({});
  const toggleTag = (tag: Tag) => {
    const tagState = activeTags[tag.id];
    const isActive = Boolean(tagState);
    if (isActive) {
      const nextTags = { ...activeTags };
      delete nextTags[tag.id];
      setActiveTag(nextTags);
    } else {
      setActiveTag({ ...activeTags, [tag.id]: isActive ? '' : tag.tag });
    }
  };

  React.useEffect(() => {
    onFilterChange(activeTags);
    // eslint-disable-next-line
  }, [activeTags]);

  return (
    <div className={styles.wrapper}>
      {tags.map(tag => (
        <Button
          className={styles.tag}
          key={tag.id}
          primary={Boolean(activeTags[tag.id])}
          onClick={() => toggleTag(tag)}
          children={tag.tag}
        />
      ))}
    </div>
  );
};
