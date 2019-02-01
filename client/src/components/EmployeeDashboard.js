import React, { Component } from 'react'
import propTypes from 'prop-types'
import BreadCrumb from './BreadCrumb'
import LeftSideBar from './LeftSideBar'
import TimeOffApproved from './EmployeeDashboard/TimeOffApproved'
import TimeOffRequest from './EmployeeDashboard/TimeOffRequest'
import AssignedShifts from './EmployeeDashboard/AssignedShifts'
import {
  fetchSingleEmployeeFromDB,
  deleteTimeOffRequest,
  fetchHoursFromDB,
  fetchEmployeesFromDB
} from '../actions'
import { connect } from 'react-redux'
import { Message, Container, Card } from './EmployeeDashboard/styles'
import OuterContainer from './common/OuterContainer'
import Availability from './EmployeeDashboard/Availability'
import { getHoursOfOperationRange, getRange } from '../utils'
import DashCal from './EmployeeDashboard/DashCal'
import Button from './common/Button'

// This page will house all of the information that will be visible to the employees when they log in to the site

class EmployeeDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: '',
      view: 'week',
      date: new Date(),
      width: 'desktop'
    }
  }

  componentDidMount() {
    const { id } = this.props.auth.user
    this.props.fetchSingleEmployeeFromDB(id, this.props.auth.token)
    this.fetchData()
  }

  componentDidUpdate(prevProps, nextProps) {
    if (prevProps.error !== this.props.error) {
      return this.setState({ error: this.props.error })
    }
  }

  deleteExpiredRequest = (torId, token) => {
    const r = window.confirm(
      `This will rescind your PTO request. Are you sure you want to do that?`
    )
    if (r) {
      this.props.deleteTimeOffRequest(torId, token)
    }
  }

  // for when we adding loading state to redux
  // componentDidUpdate(nextProps) {
  //   if (nextProps.employee.employee === null & this.props.employee.employee.loading) {
  //     this.props.history.push('/not-found')
  //   }
  // }

  fetchData() {
    const { organization_id } = this.props.user
    this.props.fetchHoursFromDB(organization_id, this.props.token)
    this.props.fetchEmployeesFromDB(organization_id, this.props.token)
  }

  toggleView = () => {
    if (this.state.view === 'week') {
      return this.setState({
        view: 'day',
        range: getRange({ view: 'day', date: this.state.date })
      })
    } else {
      return this.setState({
        view: 'week',
        range: getRange({ view: 'week', date: this.state.date })
      })
    }
  }

  render() {
    // const { employee, hours } = this.props.employee
    const { employees, hours, employee } = this.props
    const { view, date, width } = this.state
    const names = []

    const events = employees.reduce((acc, employee) => {
      return [
        ...acc,
        ...employee.events.map(event => {
          return {
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
            title: `${employee.first_name} ${employee.last_name}`
          }
        })
      ]
    }, [])
    let hourRange = getHoursOfOperationRange(hours)
    return (
      <OuterContainer>
        <LeftSideBar />
        <BreadCrumb location="Employee Dashboard" />

        <Container>
          <div className="employee-welcome">
            <h1>
              Hi there, {this.props.auth.user.first_name}. Hope you're having a
              lovely day!
            </h1>
          </div>
          <NavButtons>
            <Button onClick={() => this.changeDate('left')}>&#8592;</Button>
            <Button onClick={() => this.changeDate('today')}>Today</Button>
            <Button onClick={() => this.changeDate('right')}>&#8594;</Button>
          </NavButtons>
          <div>
            {width === 'desktop' ? (
              <Button onClick={this.toggleView}>
                {this.state.view === 'week' ? 'Day View' : 'Week View'}
              </Button>
            ) : null}
          </div>
          <div>
            <DashCal
              events={events}
              names={names}
              min={hourRange.min}
              max={hourRange.max}
              view={view}
            />
          </div>

          <div className="wrapper">
            <Card>
              <div className="title">
                <h5>Your Upcoming Shifts</h5>
              </div>
              {/* returns all assigned shift dates and times for the user */}
              {employee && employee.shifts ? (
                <>
                  {employee.shifts.map(item => {
                    return <AssignedShifts key={item.id} {...item} />
                  })}
                </>
              ) : (
                <Message>
                  <p>You haven't been assigned a shift yet.</p>
                </Message>
              )}
            </Card>

            <Card className="tof-wrapper">
              <div className="title">
                <h5>Your Weekly Availability</h5>
              </div>
              {employee && employee.availabilities.length ? (
                <Availability availabilities={employee.availabilities} />
              ) : (
                <Message>You have no availabilities to display.</Message>
              )}
            </Card>

            <Card className="tof-wrapper">
              <div className="title">
                <h5>Your Time Off Requests</h5>
                {employee && employee.time_off.length ? (
                  <Message>
                    <>
                      {employee.time_off.map(item => (
                        <TimeOffApproved
                          key={item.id}
                          status={item.status}
                          start={item.start}
                          reason={item.reason}
                          deleteExpiredRequest={() =>
                            this.deleteExpiredRequest(
                              item.id,
                              this.props.auth.token
                            )
                          }
                        />
                      ))}
                    </>
                  </Message>
                ) : (
                  <Message>No requests to display.</Message>
                )}
              </div>
            </Card>

            <Card>
              <div className="title">
                <h5>Request Time Off</h5>
              </div>
              <TimeOffRequest />
            </Card>
          </div>
        </Container>
      </OuterContainer>
    )
  }
}

const mapStateToProps = state => {
  return {
    employee: state.employee.employee,
    error: state.error,
    auth: state.auth,
    employees: state.employees.employees,
    hours: state.hours.hours,
    user: state.auth.user,
    token: state.auth.token
  }
}

export default connect(
  mapStateToProps,
  {
    fetchSingleEmployeeFromDB,
    deleteTimeOffRequest,
    fetchHoursFromDB,
    fetchEmployeesFromDB
  }
)(EmployeeDashboard)

EmployeeDashboard.propTypes = {
  employee: propTypes.object,
  fetchSingleEmployeeFromDB: propTypes.func.isRequired,
  error: propTypes.string
}

const CalendarButtons = styled.div`
  padding: 20px 40px 0;
  display: flex;
  justify-content: space-between;
  width: 100%;

  @media ${system.breakpoints[1]} {
    justify-content: center;
    padding: 20px 0 0;
  }
`
