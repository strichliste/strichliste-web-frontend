import * as React from 'react';
import {
  Location,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

/**
 * React Router v5 → v7 compatibility layer.
 *
 * The codebase grew up on react-router v5's `withRouter` HOC, `RouteComponentProps`
 * and `useHistory`. v7 removed those in favour of hooks. Rather than rewrite every
 * consumer, this thin shim reconstructs the v5-style `history`/`location`/`match`
 * props on top of v7's hooks. Routing definitions themselves use v7 APIs
 * (`Routes`/`Route element`/`Navigate`).
 */

export interface RouterHistory {
  push(to: string): void;
  replace(to: string): void;
  goBack(): void;
  location: Location;
}

export interface RouteComponentProps<
  Params = Record<string, string | undefined>,
> {
  history: RouterHistory;
  location: Location;
  match: { params: Params; url: string };
}

export function useRouter<
  Params extends Record<string, string | undefined> = Record<
    string,
    string | undefined
  >,
>(): RouteComponentProps<Params> {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const history = React.useMemo<RouterHistory>(
    () => ({
      push: (to: string) => navigate(to),
      replace: (to: string) => navigate(to, { replace: true }),
      goBack: () => navigate(-1),
      location,
    }),
    [navigate, location]
  );

  return {
    history,
    location,
    match: { params: params as Params, url: location.pathname },
  };
}

export function useHistory(): RouterHistory {
  return useRouter().history;
}

export function withRouter<Props extends RouteComponentProps>(
  Component: React.ComponentType<Props>
): React.FC<Omit<Props, keyof RouteComponentProps>> {
  function WithRouter(props: Omit<Props, keyof RouteComponentProps>) {
    const router = useRouter();
    return <Component {...(props as Props)} {...router} />;
  }
  WithRouter.displayName = `withRouter(${
    Component.displayName || Component.name || 'Component'
  })`;
  return WithRouter;
}
