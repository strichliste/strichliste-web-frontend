import { Footer } from 'bricks-of-sand';
import * as React from 'react';
import { GitHubIcon } from '../ui/icons/git-hub';

export function MainFooter(): JSX.Element {
  return (
    <Footer>
      <div>
        strichliste-web (MIT License, by{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/schinken"
        >
          schinken
        </a>{' '}
        and{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/sanderdrummer"
        >
          sanderdrummer
        </a>
        )
      </div>
      <div>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://github.com/strichliste"
        >
          <GitHubIcon /> Code
        </a>
      </div>
    </Footer>
  );
}
