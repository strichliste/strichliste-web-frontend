import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  Boundary,
  getSettingsBalance,
  getUserBalance,
} from '../../store/reducers';

interface OwnProps {
  userId?: number;
  value: number;
  render(isValid: boolean): JSX.Element;
}

interface StateProps {
  balance: number | boolean;
  boundary: Boundary;
}

interface ActionProps {}

export type ArticleValidatorProps = ActionProps & StateProps & OwnProps;

export function ArticleValidator(
  props: ArticleValidatorProps
): JSX.Element | null {
  const userBuysArticles = props.userId;
  if (userBuysArticles) {
    const newValue =
      (typeof props.balance === 'boolean' ? 0 : props.balance) - props.value;
    const buyArticleIsValid = props.boundary.lower < newValue;

    return <>{props.render(buyArticleIsValid)}</>;
  } else {
    const createArticleIsValid =
      props.value > 0 && props.value * -1 > props.boundary.lower;
    return <>{props.render(createArticleIsValid)}</>;
  }
}

const mapStateToProps = (state: AppState, props: OwnProps): StateProps => ({
  balance: props.userId
    ? getUserBalance(state, props.userId)
    : getSettingsBalance(state),
  boundary: state.settings.payment.boundary,
});

export const ConnectedArticleValidator = connect(mapStateToProps)(
  ArticleValidator
);
