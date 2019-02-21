// /* eslint-disable @typescript-eslint/no-explicit-any */
// import * as React from 'react';
// import { cleanup, render } from 'react-testing-library';

// afterEach(cleanup);

// const defaultBoundary = {
//   upper: 10,
//   lower: -10,
// };

// const defaultPaymentBoundary = {
//   upper: 5,
//   lower: -5,
// };

// const renderTransactionValidator = ({
//   accountBoundary = defaultBoundary,
//   paymentBoundary = defaultPaymentBoundary,
//   value = 10,
//   balance = 0,
//   isDeposit = true,
// }: any) => {
//   const { getByTestId } = render(
//     <TransactionValidator
//       balance={balance}
//       paymentBoundary={paymentBoundary}
//       accountBoundary={accountBoundary}
//       value={value}
//       isDeposit={isDeposit}
//       userId={1}
//       render={isValid => (
//         <div data-testid="result">{isValid ? 'yes' : 'no'}</div>
//       )}
//     />
//   );

//   return getByTestId;
// };

// describe('TransactionValidator', () => {
//   describe('for deposit', () => {
//     it('is valid in paymentBoundary and accountBoundary', () => {
//       const getByTestId = renderTransactionValidator({ value: 4, balance: 0 });
//       expect(getByTestId('result').textContent).toEqual('yes');
//     });

//     it('is valid in account but not for paymentBoundary', () => {
//       const getByTestId = renderTransactionValidator({ value: 6, balance: 0 });
//       expect(getByTestId('result').textContent).toEqual('no');
//     });

//     it('is valid for payment but not for accountBoundary', () => {
//       const getByTestId = renderTransactionValidator({ value: 4, balance: 9 });
//       expect(getByTestId('result').textContent).toEqual('no');
//     });

//     it('has upper account disabled', () => {
//       const getByTestId = renderTransactionValidator({
//         accountBoundary: { upper: false, lower: -5 },
//         value: 4,
//         balance: 9,
//       });
//       expect(getByTestId('result').textContent).toEqual('yes');
//     });

//     it('has upper payment disabled', () => {
//       const getByTestId = renderTransactionValidator({
//         paymentBoundary: { upper: false, lower: -5 },
//         value: 9,
//         balance: 0,
//       });
//       expect(getByTestId('result').textContent).toEqual('yes');
//     });
//   });

//   describe('for dispense', () => {
//     it('is valid in paymentBoundary and accountBoundary', () => {
//       const getByTestId = renderTransactionValidator({
//         isDeposit: false,
//         value: 4,
//         balance: 0,
//       });
//       expect(getByTestId('result').textContent).toEqual('yes');
//     });

//     it('is valid in account but not for paymentBoundary', () => {
//       const getByTestId = renderTransactionValidator({
//         isDeposit: false,
//         value: 6,
//         balance: 0,
//       });
//       expect(getByTestId('result').textContent).toEqual('no');
//     });

//     it('negative value is valid for payment but not for accountBoundary', () => {
//       const getByTestId = renderTransactionValidator({
//         isDeposit: false,
//         value: 4,
//         balance: -9,
//       });
//       expect(getByTestId('result').textContent).toEqual('no');
//     });

//     it('has lower account disabled', () => {
//       const getByTestId = renderTransactionValidator({
//         isDeposit: false,
//         accountBoundary: { upper: 5, lower: false },
//         value: 4,
//         balance: -9,
//       });
//       expect(getByTestId('result').textContent).toEqual('yes');
//     });

//     it('has upper payment disabled', () => {
//       const getByTestId = renderTransactionValidator({
//         isDeposit: false,
//         paymentBoundary: { upper: 5, lower: false },
//         value: -9,
//         balance: 0,
//       });
//       expect(getByTestId('result').textContent).toEqual('yes');
//     });
//   });
// });
