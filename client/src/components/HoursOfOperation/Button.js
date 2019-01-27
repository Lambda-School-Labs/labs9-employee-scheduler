import React from 'react'
import styled from '@emotion/styled'
import system from '../../design/theme'
import Zoom from 'react-reveal'
import Checkbox from './Checkbox'
import TimeSlider from './TimeSlider'
import Status from './Status'

const Button = ({
  id,
  name,
  closedAllDay,
  status,
  toggled,
  disabled,
  open_time,
  close_time
}) => {
  return (
    <Container>
      <Zoom right>
        <div className="buttons">
          <TimeSlider
            disabled={disabled}
            name={name}
            open_time={open_time}
            close_time={close_time}
          />
        </div>
      </Zoom>
      <div>
        <p className="days" id={id}>
          {name}
        </p>
      </div>
      <Zoom left>
        <div className="closeToggle">
          <Checkbox closedAllDay={closedAllDay} toggled={toggled} name={name} />
          <Status status={status} />
        </div>
      </Zoom>
    </Container>
  )
}

export default Button

const Container = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 15px;
  .days {
    border-radius: ${system.borders.bigRadius};
    background: ${system.color.neutral};
    border: 0;
    box-shadow: ${system.shadows.button};
    padding: ${system.spacing.standardPadding};
    width: 116px;
    text-align: center;
    margin: 0 10px 10px 11px;
    font-size: ${system.fontSizing.sm};
  }
  .buttons {
    /* position: absolute; */
    /* margin-top: -12px;
    margin-left: 120px; */
    width: 177px;
    background: white;
    padding: 12px;
    margin-right: 15px;
    /* padding-right: 25px; */
    border-radius: 0 25px 25px 0;
    button {
      cursor: pointer;
      margin: 5px;
      font-size: 1.8rem;
      border: transparent;
    }
  }
  .closeToggle {
    display: flex;
    flex-direction: column;
    /* justify-items: center; */
    justify-content: space-evenly;
    height: 6px;
    position: relative;
    margin-bottom: 12px;
    padding: 0 15px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    p {
      margin-top: 5px;
      font-size: ${system.fontSizing.s};
      height: 100%;
    }
  }
`
