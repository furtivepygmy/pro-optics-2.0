import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import TicketFeed from '../../components/ticket-feed/TicketFeed';
import Spinner from '../../components/spinner/Spinner';
// import Navbar2 from '../layout/Navbar2';

class Tickets extends Component {
  state = {
    filter: '',
    date: '',
    dateTerm: '',
    type: '',
    term: ''
  };

  onFilterSelect = filter => {
    this.setState({ filter });
  };

  onTypeSelect = type => {
    this.setState({ type });
  };

  onDateFilterSelect = date => {
    this.setState({ date });
  };

  render() {
    const { filter, date, dateTerm, type, term } = this.state;
    const { provider, setProvider, currentUser, tickets } = this.props;

    let searchForm;
    let dateFilters;
    let providerFilters;
    let content;
    let results = [];

    searchForm = (
      <div className="row mb-3">
        <div className="col-md-2" />
        <div className="col-md-8">
          <div className="input-group">
            <button
              type="button"
              className="btn btn-secondary dropdown-toggle"
              data-toggle="dropdown"
            >
              {filter !== '' ? filter : 'Select Filter'}{' '}
            </button>
            <div className="dropdown-menu">
              <button
                onClick={() => this.onFilterSelect('Active')}
                className="btn dropdown-item"
              >
                Active
              </button>
              <button
                onClick={() => this.onFilterSelect('Pending')}
                className="btn dropdown-item"
              >
                Pending
              </button>
              <button
                onClick={() => this.onFilterSelect('Complete')}
                className="btn dropdown-item"
              >
                Complete
              </button>
              <button
                onClick={() => this.onFilterSelect('')}
                className="btn dropdown-item"
              >
                Clear Filter
              </button>
            </div>
            <div className="input-group-prepend">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-toggle="dropdown"
              >
                {type !== '' ? type : 'Search By'}{' '}
              </button>
              <div className="dropdown-menu">
                <button
                  onClick={() => this.onTypeSelect('Ticket Number')}
                  className="btn dropdown-item"
                >
                  Ticket Number
                </button>
                <button
                  onClick={() => this.onTypeSelect('Account Number')}
                  className="btn dropdown-item"
                >
                  Account Number
                </button>
                <button
                  onClick={() => this.onTypeSelect('Client Name')}
                  className="btn dropdown-item"
                >
                  Client Name
                </button>
                <button
                  onClick={() => this.onTypeSelect('Client NIN')}
                  className="btn dropdown-item"
                >
                  Client NIN
                </button>
                <button
                  onClick={() => this.setState({ term: '', type: '' })}
                  className="btn dropdown-item"
                >
                  Clear
                </button>
              </div>
            </div>
            <input
              type="text"
              className="form-control"
              value={term}
              onChange={({ target }) => this.setState({ term: target.value })}
              placeholder="Enter Search Term"
              disabled={type === '' && true}
            />
          </div>
        </div>
      </div>
    );

    dateFilters = (
      <div className="row">
        <div className="col-md-2" />
        <div className="col-md-8">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-toggle="dropdown"
              >
                {date !== '' ? date : 'Select Date Filter'}{' '}
              </button>
              <div className="dropdown-menu">
                <button
                  onClick={() => this.onDateFilterSelect('Date Created')}
                  className="btn dropdown-item"
                >
                  Date Created
                </button>
                <button
                  onClick={() => this.setState({ date: '', dateTerm: '' })}
                  className="btn dropdown-item"
                >
                  Clear Filter
                </button>
              </div>
            </div>
            <input
              type="date"
              className="form-control"
              value={dateTerm}
              onChange={({ target }) =>
                this.setState({ dateTerm: target.value })
              }
              disabled={date === '' && true}
            />
          </div>
        </div>
      </div>
    );

    providerFilters = currentUser && currentUser.role === 'admin' && (
      <div className="row">
        <div className="col-md-2" />
        <div className="col-md-8">
          <div className="btn-group" role="group">
            <button
              onClick={() => setProvider('intv')}
              className={`btn ${
                provider === 'intv' ? 'btn-dark' : 'btn-secondary'
              } mb-3`}
            >
              Intelvision
            </button>
            <button
              onClick={() => setProvider('airtel')}
              className={`btn ${
                provider === 'airtel' ? 'btn-dark' : 'btn-secondary'
              } mb-3`}
            >
              Airtel
            </button>
            <button
              onClick={() => setProvider('cws')}
              className={`btn ${
                provider === 'cws' ? 'btn-dark' : 'btn-secondary'
              } mb-3`}
            >
              Cable &amp; Wireless
            </button>
          </div>
        </div>
        <div className="col-md-2" />
      </div>
    );

    if (!tickets) {
      content = <Spinner />;
    } else {
      switch (filter) {
        case 'Active':
          results = tickets.filter(
            ticket =>
              ticket.status === 'On field' ||
              ticket.status === 'Require survey' ||
              ticket.status === 'Provisioning required by client'
          );
          break;
        case 'Pending':
          results = tickets.filter(
            ticket =>
              ticket.status === 'Issued' ||
              ticket.status === 'Return to Intelvision'
          );
          break;
        case 'Complete':
          results = tickets.filter(
            ticket =>
              (ticket.status === 'Complete' ||
                ticket.status === 'Complete to activate at a later date') &&
              !ticket.closed
          );
          break;
        case '':
          results = tickets;
          break;
        default:
          break;
      }

      switch (date) {
        case 'Date Created':
          if (dateTerm !== '') {
            results = results.filter(
              ticket => ticket.date.substring(0, 10) === dateTerm
            );
          }
          break;
        case '':
          break;
        default:
          break;
      }

      switch (type) {
        case 'Ticket Number':
          results = results.filter(ticket =>
            ticket._id.toString().includes(term)
          );
          break;
        case 'Account Number':
          results = results.filter(ticket =>
            ticket.endUserInfo.id.toLowerCase().includes(term.toLowerCase())
          );
          break;
        case 'Client Name':
          results = results.filter(ticket =>
            ticket.endUserInfo.name.toLowerCase().includes(term.toLowerCase())
          );
          break;
        case 'Client NIN':
          results = results.filter(ticket =>
            ticket.endUserInfo.nin.includes(term)
          );
          break;
        case '':
          break;
        default:
          break;
      }

      content = (
        <div>
          <TicketFeed tickets={results} />
        </div>
      );
    }

    return (
      <div className="tickets">
        {/* TODO <Navbar2 /> */}
        <div className="container">
          <div className="row mt-4">
            <div className="col-md-12">
              <Link to={`/dashboard`} className="btn btn-light mb-3">
                Return To Dashboard
              </Link>
              <Link
                to={`/create-ticket`}
                className="btn btn-primary mb-3 float-right"
              >
                Create New Ticket
              </Link>
              <br />
              <h1 className="display-4 text-center">Tickets</h1>
              <p className="lead text-center">
                Search for tickets using the controls below
              </p>
              <br />
              {searchForm}
              {dateFilters}
              {providerFilters}

              <p className="lead text-center pt-4">
                {!tickets ? (
                  <span>Fetching tickets, one moment please</span>
                ) : (
                  <span>
                    {results.length === 0 ? (
                      <span>No tickets found, try a different search</span>
                    ) : (
                      <span>
                        Found <strong>{results.length}</strong>{' '}
                        {results.length === 1 ? 'result' : 'results'}
                      </span>
                    )}
                  </span>
                )}
              </p>
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tickets;
