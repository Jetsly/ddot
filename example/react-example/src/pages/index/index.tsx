import { a } from 'config';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import './index.less';
declare var c:string
console.log(c)
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
