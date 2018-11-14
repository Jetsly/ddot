import * as React from 'react';
import { hot } from 'react-hot-loader';
import './index.less';
class A extends React.Component {
  public render() {
    return <div>ccvvvc</div>;
  }
}
export default hot(module)(() => (
  <div>
    scs<A />
  </div>
));
