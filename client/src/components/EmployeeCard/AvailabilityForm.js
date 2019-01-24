import React, { Component } from 'react'
import styled from '@emotion/styled'
import system from '../../design/theme'
import { connect } from 'react-redux'
import { getAvailability, editAvailability } from '../../actions'
import Button from '../common/Button'
import Availability from './AvailabilitySelect'

const user = '9474b689-ef77-47a1-ba20-b1bac12beeee'

class AvailabilityForm extends Component {
  constructor() {
    super()
    this.state = {
      availability: [],
      loading: false,
      days: [
        {
          name: 'sunday',
          startTime: undefined,
          endTime: undefined,
          off: false
        },
        {
          name: 'monday',
          startTime: undefined,
          endTime: undefined,
          off: false
        },
        {
          name: 'tuesday',
          startTime: undefined,
          endTime: undefined,
          off: false
        },
        {
          name: 'wednesday',
          startTime: undefined,
          endTime: undefined,
          off: false
        },
        {
          name: 'thursday',
          startTime: undefined,
          endTime: undefined,
          off: false
        },
        {
          name: 'friday',
          startTime: undefined,
          endTime: undefined,
          off: false
        },
        {
          name: 'saturday',
          startTime: undefined,
          endTime: undefined,
          off: false
        }
      ]
    }
  }

  componentDidMount() {
    this.props.getAvailability(user, this.props.token)
  }

  handleChange = (targetDay, property, value, availability) => {
    this.setState({
      days: this.state.days.map(day => {
        if (day.name === targetDay) {
          // "processed' sets the property to a boolean or a number because it defaulted
          // to a string on the server without this
          const processed = property === 'off' ? Boolean(value) : Number(value)
          return { ...day, [property]: processed, availability }
        } else {
          return day
        }
      })
    })
  }

  //checks to see which availabilities have been updated and sends the changes to the server
  updateAvailability = () => {
    this.state.days.map(day => {
      return day.availability
        ? this.props.editAvailability({
            availability: day.availability,
            changes: {
              start_time: day.startTime,
              end_time: day.endTime,
              off: day.off
            },
            token: this.props.token
          })
        : null
    })
  }

  render() {
    return (
      <div>
        <h5>Edit Availability</h5>
        {/* maps over all availabilities and displays them with the ability to select changes */}
        {this.props.availability.map((a, i) => {
          return (
            <div key={a.id}>
              <Availability
                // uses local state to display the names of the days because the db sends a number
                day={this.state.days[i].name}
                startTime={a.start_time}
                endTime={a.end_time}
                off={a.off}
                name={this.state.days[i]}
                startTimeValue={this.state.days[i].startTime}
                endTimeValue={this.state.days[i].endTime}
                handleChange={this.handleChange}
                submit={this.props.getAvailability}
                availability={a}
              />
            </div>
          )
        })}
        <button onClick={this.updateAvailability}>submit</button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    availability: state.availability.availability,
    token: state.auth.token
  }
}

export default connect(
  mapStateToProps,
  { editAvailability, getAvailability }
)(AvailabilityForm)