import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { Tips } from './Tips';
import { shallow, mount } from 'enzyme';

it('Renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Tips />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  
it('Renders correctly', () => {
    const tree = renderer
        .create(<Tips />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});