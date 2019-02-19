import * as React from 'react';
import { connect } from 'react-redux';
import { startLoadingSettings } from '../../store/reducers';
interface ActionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startLoadingSettings: any;
}
export class SettingsLoader extends React.Component<ActionProps> {
  public componentDidMount(): void {
    this.props.startLoadingSettings();
  }

  // tslint:disable-next-line:prefer-function-over-method
  public render(): null {
    return null;
  }
}

const mapDispatchToProps = {
  startLoadingSettings,
};

export const ConnectedSettingsLoader = connect(
  undefined,
  mapDispatchToProps
)(SettingsLoader);
