import React from 'react';
import moment from 'moment';

import { Tips } from "../Tips/Tips";

import ReactTable from "react-table";
import "react-table/react-table.css";

import './App.css';

const ISSUES_ENDPOINT = `https://api.github.com/repos/facebook/react/issues`;
const getIssueUrl = id => `https://github.com/facebook/react/issues/${id}`;

// TODO: filter by author or label
// TODO: jest test components

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      issues: [],
      loading: true
    };
  }

  componentDidMount() {
    this.fetchIssues();
  }

  fetchIssues() {
    fetch(ISSUES_ENDPOINT)
      .then(response => response.json())
      .then(issues => this.setState({ issues, loading: false }));
  }

  getColorByBgColor(bgColor) {
    if (bgColor === 'ee0701' || bgColor === 'b60205') return '#fff'
    return (parseInt(bgColor, 16) > 0xffffff / 2) 
      ? '#000' 
      : '#fff';
  }

  getLabelStyle(color) {
    return {
      background: `#${color}`,
      color: this.getColorByBgColor(color),
      padding: ' 2px 5px',
      margin: '5px 5px 0px 0px',
      borderRadius: '3px',
      float: 'left',
      fontSize: '14px'
    }
  }

  render() {
    const { issues, loading } = this.state;
    return (
      <div className="App">
        <ReactTable
          data={issues}
          loading={loading}
          columns={[
            {
              columns: [
                {
                  Header: "Number",
                  accessor: "number",
                  width: 90
                },
                {
                  id: "Date",
                  Header: "Date",
                  accessor: d => moment(d.created_at).calendar(),
                  width: 210
                },
                {
                  id: "Reporter",
                  Header: "Reporter",
                  accessor: d => d.user ? d.user.login : null,
                  width: 150
                },
                {
                  Header: "Status",
                  accessor: "state",
                  width: 100
                },
                {
                  Header: "Name",
                  accessor: "title"
                },
                {
                  id: "Assignee",
                  Header: "Assignee",
                  accessor: d => d.assignee,
                  width: 150,
                  Cell: ({ value }) => {
                    return (
                      <div>
                        {
                          <div style={{}}>
                            { value && value.login && value.avatar_url
                              ? <div>{ value.login } <span className="avatar" style={{ backgroundImage: `url("${value.avatar_url}")`}}></span></div> 
                              : null 
                            }
                          </div>
                        }
                      </div>
                    )
                  }
                },
                {
                  id: "Labels",
                  Header: "Labels",
                  accessor: d => d.labels,
                  Cell: props => {
                    return (
                      <div className="label-wrapper">
                        {
                          props.value.map((label, index) => 
                            <div key={`label-${index}`} style={this.getLabelStyle(label.color)}> 
                              { label.name } 
                            </div>)
                        }
                      </div>
                    )
                  }
                }
              ]
            }
          ]}
          defaultPageSize={15}
          className="-striped -highlight"
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, handleOriginal) => 
                window.location.href = getIssueUrl(rowInfo.original.number)
            }
          }}
        />
        <Tips />
      </div>
    );
  }
}

export default App;
