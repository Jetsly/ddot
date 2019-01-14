import { a } from 'config';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import './index.less';
declare var c:string
class A extends React.Component {
  public render() {
    return <div>111111</div>;
  }
}
export default hot(module)(() => (
  <div>
    scs<A />
  </div>
));
