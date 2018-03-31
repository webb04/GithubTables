import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Filter from './Filter';
import { shallow, mount } from 'enzyme';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Filter options={['one', 'two']} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Renders correctly', () => {
    const tree = renderer
        .create(<Filter options={['one', 'two']} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('Opens on click', () => {
    const Component = mount(<Filter options={['one', 'two']}/>);
    expect(Component.find('.dropdown')).toHaveLength(0);
    Component.find('.Filter').simulate('click');
    expect(Component.state().open).toBe(true);
    expect(Component.find('.dropdown')).toHaveLength(1);
    expect(Component.find('.item')).toHaveLength(2);
});

it('Displays all options', () => {
    const Component = mount(<div>
        <Filter id="one" options={['one', 'two']}/>
        <Filter id="two" options={['three', 'four']}/>
        </div>);

    Component.find('#one').find('.Filter').simulate('click');
    expect(Component.contains('one')).toBe(true);
    expect(Component.contains('two')).toBe(true);
    expect(Component.contains('three')).toBe(false);
    expect(Component.contains('four')).toBe(false);

    Component.find('#two').find('.Filter').simulate('click');
    expect(Component.contains('three')).toBe(true);
    expect(Component.contains('four')).toBe(true);
});

it('Filters by search term', () => {
    const Component = mount(<Filter options={['one', 'two']}/>);
    
    Component.find('.Filter').simulate('click');
    expect(Component.contains('one')).toBe(true);
    expect(Component.contains('two')).toBe(true);
    
    Component.setState({ searchTerm: 'one' });
    expect(Component.contains('one')).toBe(true);
    expect(Component.contains('two')).toBe(false);
    
    Component.setState({searchTerm: 'eight'});
    expect(Component.find('.item')).toHaveLength(0);
});

it('Clears on click', () => {
    const Component = mount(<Filter 
        options={['one', 'two']}
        label="Authors"
        selectedAuthorFilter="Fred"
    />);

    Component.find('.Filter').simulate('click');
    expect(Component.find('.clear')).toHaveLength(1);
    expect(Component.find('.selected')).toHaveLength(1);

    Component.find('.clear').simulate('click')
    Component.setProps({
        options: ['one', 'two'],
        label: "Authors",
        selectedAuthorFilter: null
    })
    expect(Component.find('.clear')).toHaveLength(0);
    expect(Component.find('.selected')).toHaveLength(0);
});

it('Renders label', () => {
    const Component = mount(<Filter options={['five']} label="Labels"/>);
    expect(Component.contains('Filter Labels')).toBe(true);
});