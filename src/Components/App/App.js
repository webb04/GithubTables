import React from 'react';

import Filter from '../Filter/Filter';
import Table from '../Table/Table';
import { Tips } from "../Tips/Tips";

import fetch from 'isomorphic-fetch'

import './App.css';

const ISSUES_ENDPOINT = `https://api.github.com/repos/facebook/react/issues`;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      issues: [],
      loading: true,
      selectedAuthorFilter: '',
      selectedLabelFilter: ''
    };
    this.onSelectAuthor = this.onSelectAuthor.bind(this);
    this.onSelectLabel = this.onSelectLabel.bind(this);
  }

  componentDidMount() {
    this.fetchIssues();
  }

  fetchIssues() {
    fetch(ISSUES_ENDPOINT)
      .then(response => response.json())
      .then(issues => {
        if (Array.isArray(issues)) {
          this.setState({ issues, loading: false })
        }
      });
  }

  distinct(array) {
    return [...new Set(array)];
  }

  mergeArrays = arrays => [].concat.apply([], arrays);

  onSelectAuthor(selectedAuthorFilter) {
    this.setState({ selectedAuthorFilter })
  }

  onSelectLabel(selectedLabelFilter) {
    this.setState({ selectedLabelFilter })
  }

  getFilteredAuthors(issues, selectedAuthorFilter) {
    return selectedAuthorFilter 
      ? issues.filter(issue => issue.user.login === selectedAuthorFilter)
      : issues
  }

  getFilteredLabels(issues, selectedLabelFilter) {
    return selectedLabelFilter
      ? issues.filter(issue => issue.labels.map(x => x.name).includes(selectedLabelFilter))
      : issues
  }

  render() {
    const { issues, loading, selectedAuthorFilter, selectedLabelFilter } = this.state;

    const authors = issues.map(issue => issue.user.login);
    
    const labels = this.mergeArrays(
      issues.map(
        subarray => subarray.labels.map(x => x.name)
      )
    );

    const authorFiltered = this.getFilteredAuthors(issues, selectedAuthorFilter);
    const filteredIssues = this.getFilteredLabels(authorFiltered, selectedLabelFilter)
    
    return (
      <div className="App">
        <div className="App-Filter">
          <Filter 
            label="Authors" 
            options={ this.distinct(authors) } 
            onSelectAuthor={this.onSelectAuthor}
            selectedAuthorFilter={selectedAuthorFilter}
          />
        </div>
        <div className="App-Filter">
          <Filter 
            label="Labels" 
            options={ this.distinct(labels) } 
            onSelectLabel={this.onSelectLabel}
            selectedLabelFilter={selectedLabelFilter}
          />
        </div>
        <Table 
          issues={filteredIssues} 
          loading={loading} 
        />
        <Tips />
      </div>
    );
  }
}

export default App;
