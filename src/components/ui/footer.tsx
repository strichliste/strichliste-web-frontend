import { Footer } from 'bricks-of-sand';
import * as React from 'react';
import { GitHubIcon } from '../ui/icons/git-hub';

export interface MainFooterProps {}

export function MainFooter(props: MainFooterProps): JSX.Element {
  return (
    <Footer>
      <div>
        strichliste-web (MIT License, by{' '}
        <a target="_blank" href="https://github.com/strichliste">
          schinken
        </a>{' '}
        and{' '}
        <a target="_blank" href="https://github.com/strichliste">
          sanderdrummer
        </a>
        )
      </div>
      <div>
        <a target="_blank" href="https://github.com/strichliste">
          <GitHubIcon /> Code
        </a>
      </div>
    </Footer>
  );
}
