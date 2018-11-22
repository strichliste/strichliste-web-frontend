import * as React from 'react';
import styled from 'react-emotion';
import { GitHubIcon } from '../ui/icons/git-hub';

export const FixedFooter = styled('footer')({
  position: 'fixed',
  width: '100%',
  bottom: 0,
});

export const Footer = styled('footer')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.5rem',
});

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
