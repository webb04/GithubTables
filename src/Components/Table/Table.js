import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import ReactTable from "react-table";
import "react-table/react-table.css";

const getIssueUrl = id => `https://github.com/facebook/react/issues/${id}`;

class Table extends React.Component {

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
        const { issues, loading } = this.props;
        return (
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
                                accessor: d => moment(d.created_at).format('DD/MM/YYYY'),
                                width: 210,
                                sortMethod: (a, b) => new Date(b) - new Date(a)
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
                                Cell: ({ value }) => {
                                    return (
                                        <div className="label-wrapper">
                                            {
                                                value.map((label, index) => 
                                                    <div key={`label-${index}`} style={this.getLabelStyle(label.color)}> 
                                                        { label.name } 
                                                    </div>
                                                )
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
                    onClick: (e, handleOriginal) => {
                            if (!rowInfo) return;
                            window.location.href = getIssueUrl(rowInfo.original.number)
                        }
                    }
                }}
            />
        )
    }
}

Table.defaultProps = {
    issues: [],
    loading: false
}

Table.propTypes = {
    issues: PropTypes.array,
    loading: PropTypes.bool
}

export default Table;
