import React from 'react';
import PropTypes from 'prop-types';

import './Filter.css';

class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
          open: false,
          searchTerm: ''
        };
        this.onTextInput = this.onTextInput.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
      }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    handleClickOutside(e) {
        if (this.node && !this.node.contains(e.target)) {
            this.setState({ open: false})
        }
    }

    onTextInput({ target }) {
        this.setState({ searchTerm: target.value });
    }

    render() {
        const { label, onSelectLabel, onSelectAuthor, options, selectedLabelFilter, selectedAuthorFilter } = this.props;
        const { open, searchTerm } = this.state;
        
        const filteredOptions = searchTerm 
            ? options.filter(option => option.toLowerCase().indexOf(searchTerm) >= 0)
            : options;

        const onChange = label === 'Authors' ? onSelectAuthor : onSelectLabel;
        const selected = label === 'Authors' ? selectedAuthorFilter : selectedLabelFilter;

        return (
                <div className="Filter-Wrapper" ref={node => this.node = node}>
                    <div className="Filter" onClick={() => this.setState({ open: !open })}>
                        {`Filter ${label}`}
                    </div>
                    {
                        open ?
                            <div className="dropdown">
                                <input type="text" onChange={this.onTextInput} value={searchTerm}/>
                                {
                                    selected 
                                        ? <div>
                                            <div className="selected">{selected}</div>
                                            <div className="clear" onClick={() => onChange(null)}>Clear</div>
                                        </div>
                                        : null
                                }
                                {
                                    filteredOptions.map((option, index) => {
                                        return <div key={`filter-${index}`} onClick={() =>  onChange(option)} className="item">{ option }</div>
                                    })
                                }
                            </div>
                            : null
                    }
                </div>
        )
    }
}

Filter.defaultProps = {
    label: 'Authors',
    onSelectLabel: () => {},
    onSelectAuthor: () => {},
    selectedLabelFilter: '',
    selectedAuthorFilter: ''
}

Filter.propTypes = {
    label: PropTypes.oneOf(['Authors', 'Labels']),
    onSelectLabel: PropTypes.func,
    onSelectAuthor: PropTypes.func,
    options: PropTypes.array.isRequired,
    selectedLabelFilter: PropTypes.string,
    selectedAuthorFilter: PropTypes.string
}

export default Filter;