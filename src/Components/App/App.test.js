import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import App from './App';
import { shallow, mount } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders correctly', () => {
  const tree = renderer
    .create(<App />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Filters out duplicate dropdown options', () => {
  const Component = shallow(<App />);
  const dupes = ['CLA Signed', 'Type: Bug', 'CLA Signed', 'Type: Bug'];
  expect(Component.instance().distinct(dupes)).toHaveLength(2);
});

it('Merges arrays', () => {
  const Component = shallow(<App />);
  const nested = [['CLA Signed'], ['Type: Bug']];
  expect(Component.instance().mergeArrays(nested)).toEqual(['CLA Signed', 'Type: Bug']);
});

it('Selects author', () => {
  const Component = shallow(<App />).instance();
  Component.onSelectAuthor('webb04');
  expect(Component.state.selectedAuthorFilter).toBe('webb04');
});

it('Selects Label', () => {
  const Component = shallow(<App />).instance();
  Component.onSelectLabel('CLA Signed');
  expect(Component.state.selectedLabelFilter).toBe('CLA Signed');
});

it('Filters authors correctly', () => {
  const Component = shallow(<App />).instance();
  const issues = [
    {
      user: {
        login: 'Fred'
      }
    },
    {
      user: {
        login: 'Anne'
      }
    },
  ];
  expect(Component.getFilteredAuthors(issues, 'Anne')).toEqual([{"user": {"login": "Anne"}}]);
});

it('Filters labels correctly', () => {
  const Component = shallow(<App />).instance();
  const issues = [
    {
      labels: [
        {
          name: 'Bug'
        },
        {
          name: 'Technical Debt'
        }
      ]
    },
    {
      labels: [
        {
          name: 'CLA Signed'
        },
        {
          name: 'Feature Request'
        }
      ]
    },
  ];
  expect(Component.getFilteredLabels(issues, 'Bug')).toEqual([{"labels": [{"name": "Bug"}, {"name": "Technical Debt"}]}]);
});