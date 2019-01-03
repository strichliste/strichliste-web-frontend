// import { GlobalLoadingIndicator } from './loader';
// import { styled, theme } from 'bricks-of-sand';
// import { connect } from 'react-redux';
// import { AppState } from '../../store';

// interface LoadingIndicatorProps {
//   started: boolean;
// }
// export const LoadingIndicator = styled('div')<LoadingIndicatorProps>(
//   {
//     position: 'fixed',
//     zIndex: 1,
//     top: 0,
//     left: '-1%',
//     height: '2px',
//     backgroundColor: theme.primary,
//     borderRadius: '3px',
//   },
//   props => ({
//     width: props.started ? '102%' : '1%',
//     transition: props.started
//       ? 'width 3000ms ease-out, opacity 200ms linear'
//       : 'none',
//   })
// );

// const mapStateToProps = (state: AppState) => ({
//   started: false,
// });

// export const GlobalLoadingIndicator = connect(mapStateToProps)(
//   LoadingIndicator
// );

export const GlobalLoadingIndicator = () => null;
