// @flow

import * as React from 'react'
import styled from 'styled-components'

// Import only the methods we need from date-fns in order to keep build size small
import addHours from 'date-fns/add_hours'
import addDays from 'date-fns/add_days'
import addMinutes from 'date-fns/add_days'
import startOfDay from 'date-fns/start_of_day'
import isSameMinute from 'date-fns/is_same_minute'
import formatDate from 'date-fns/format'

import { Text, Subtitle } from './typography'
import colors from './colors'
import selectionSchemes from './selection-schemes'
import {stringify, unstringify, between} from './date-utils'
import { isThisWeek } from 'date-fns';

const formatHour = (hour: number): string => {
  const h = hour === 0 || hour === 12 || hour === 24 ? 12 : hour % 12
  const abb = hour < 12 || hour === 24 ? 'am' : 'pm'
  return `${h}${abb}`
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  user-select: none;
`

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;

`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => props.dateCellWidth + 'px'};

`

export const GridCell = styled.div`
  margin: ${props => props.margin}px;
  touch-action: none;
  width: ${props => props.dateCellWidth + 'px'};
`

const handleQuarterCellBorder = quarter => {

  switch (quarter) {
    case 0:
      return "border-style: solid solid none solid";
    case 1:
      return "border-style: none solid dotted solid";
    case 2:
      return "border-style: dotted solid none solid";
    case 3:
      return "border-style: none solid solid solid";
  }
}

const cellVal = val => `${val}px`

const DateCell = styled.div`
  height: ${props => props.dateCellHeight + 'px'};
  width: ${props => props.dateCellWidth + 'px'};
  border-width: 0.2px;
  border-style: solid;
  ${({ quarter }) => handleQuarterCellBorder(quarter)};
  margin: 0px 0px;
  background-color: ${props => (props.selected ? props.selectedColor : props.unselectedColor)};
`

const DateLabel = styled(Subtitle)`
  color: ${props => (props.dayOfWeek ? 'black' : '#00011F')};
  font-size: ${props => (props.dayOfWeek ? '1.3rem' : '1rem')};
  margin: 5px 0px;
  
  @media (max-width: 699px) {
    font-size: 12px;
  }
`

const TimeLabelCell = styled.div`
  position: relative;
  display: block;
  width: 30px;
  height: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background: yellow;
`

const TimeText = styled(Text)`
  margin: 0;
  
  @media (max-width: 699px) {
    font-size: 10px;
  }
  text-align: right;
`

type PropsType = {
  selection: Array<Date>,
  selectionScheme: SelectionSchemeType,
  onChange: (Array<Date>) => void,
  startDate: Date,
  numDays: number,
  minTime: number,
  maxTime: number,
  dateFormat: string,
  margin: number,
  unselectedColor: string,
  selectedColor: string,
  hoveredColor: string,
  renderDateCell?: (Date, boolean, (HTMLElement) => void) => React.Node
}

export const preventScroll = (e: TouchEvent) => {
  e.preventDefault()
}

export default class ScheduleSelector extends React.Component<PropsType, StateType> {
  dates: Array<Array<Date>>
  selectionSchemeHandlers: { [string]: (Date, Date, Array<Array<Date>>) => Date[] }
cellToDate: Map < HTMLElement, Date >
  documentMouseUpHandler: () => void
    endSelection: () => void
      handleTouchMoveEvent: (SyntheticTouchEvent<*>) => void
        handleTouchEndEvent: () => void
          handleMouseUpEvent: Date => void
            handleMouseEnterEvent: Date => void
              handleSelectionStartEvent: Date => void
                gridRef: ?HTMLElement

  static defaultProps = {
  selection: [],
  selectionScheme: 'square',
  numDays: 7,
  minTime: 9,
  maxTime: 23,
  startDate: new Date(),
  dateFormat: 'M/D',
  margin: 0,
  selectedColor: colors.blue,
  unselectedColor: colors.paleBlue,
  hoveredColor: colors.lightBlue,
  dateCellHeight: 20,
  dateCellWidth: 100,
  onChange: () => { }
}

constructor(props: PropsType) {
  super(props)

  // Generate list of dates to render cells for
  const startTime = startOfDay(props.startDate)
  this.dates = []

  let selected = []

  for (let d = 0; d < props.numDays; d += 1) {
    const currentDay = []

    selected.push([])

    for (let h = props.minTime; h <= props.maxTime; h += 1) {
      for (let i = 0; i < 4; i++) {
        let currentTime = addMinutes(addHours(addDays(startTime, d), h), i * 15);
        currentDay.push(currentTime);
        selected[d].push(false);
      }
    }
    this.dates.push(currentDay)
  }

  this.state = {
    mouseX: 0,
    mouseY: 0,
    startCoord: [-1, -1],
    endCoord: [-1, -1],
  }


  this.selectionSchemeHandlers = {
    linear: selectionSchemes.linear,
    square: selectionSchemes.square
  }

  // true if adding false if deleting
  this.addMode = false;
  this.mouseDown = false;

  this.selected = new Set();
  this.highlighted = new Set();

}


startSelection = (dayIndex, timeIndex) => {
  if (dayIndex < 0 || timeIndex < 0){
    return;
  }

  this.mouseDown = true;

  this.addMode = !this.selected.has(stringify(dayIndex, timeIndex));

  this.setState({startCoord: [dayIndex, timeIndex]});
}

endSelection = () => {

  for (let x = Math.min(this.state.startCoord[0], this.state.mouseX); x <= Math.max(this.state.startCoord[0], this.state.mouseX); x++){
    for (let y = Math.min(this.state.startCoord[1], this.state.mouseY); y <= Math.max(this.state.startCoord[1], this.state.mouseY); y++){
      
      if (this.addMode){
        this.selected.add(stringify(x,y))
      } else {
        this.selected.delete(stringify(x,y))
      }
    }
  }
  
  this.setState({startCoord: [-1, -1]})
  this.mouseDown = false;
}



// returns 
coordToIndex = (x, y) => {

  return [Math.floor(x / this.props.dateCellWidth), Math.floor(y / this.props.dateCellHeight)]
}


renderTimeLabels = (): React.Element<*> => {
  const labels = [<DateLabel key={-1} />] // Ensures time labels start at correct location
  for (let t = this.props.minTime; t <= this.props.maxTime; t += 1) {
    labels.push(
      <TimeLabelCell key={t}>
        <TimeText>{formatHour(t)}</TimeText>
      </TimeLabelCell>
    )
  }
  return <Column margin={this.props.margin}>{labels}</Column>
}

renderDateColumn = (dayIndex: number, dayOfTimes: Array<Date>) => {

  return (

    <Column
      key={dayOfTimes[0]}
      margin={this.props.margin}
      dateCellWidth={this.props.dateCellWidth}
      dateCellHeight={this.props.dateCellHeight}
    >
      <GridCell margin={this.props.margin} dateCellWidth={this.props.dateCellWidth} dateCellHeight={this.props.dateCellHeight}>
        <DateLabel>{formatDate(dayOfTimes[0], this.props.dateFormat)}</DateLabel>
        <DateLabel dayOfWeek>{formatDate(dayOfTimes[1], 'ddd')}</DateLabel>
      </GridCell>
      {dayOfTimes.map((time, i) => this.renderDateCellWrapper(time, dayIndex, i))}
    </Column>

  )
}


shouldHighlight = s => {
  
  const [x,y] = unstringify(s);

  const highlighted = (this.mouseDown && between(this.state.startCoord[0], this.state.mouseX, x) && between(this.state.startCoord[1], this.state.mouseY, y));
  const selected = this.selected.has(s)
  
  return (this.mouseDown && this.addMode && highlighted) || (!this.mouseDown && selected) || (selected && ! highlighted)
}



renderDateCellWrapper = (time: Date, dayIndex, timeIndex): React.Element<*> => {

  const stringified = stringify(dayIndex, timeIndex);

  return (
    <GridCell
      className="rgdp__grid-cell"
      role="presentation"
      margin={0}
      key={time.toISOString()}
      // Mouse handlers
      onMouseDown={() => this.startSelection(dayIndex, timeIndex)}
    >
      <DateCell
        selected={this.shouldHighlight(stringified)}
        // innerRef={refSetter}
        dateCellHeight={this.props.dateCellHeight}
        quarter={1}
        selectedColor={this.props.selectedColor}
        unselectedColor={this.props.unselectedColor}
        hoveredColor={this.props.hoveredColor}
      />
    </GridCell>
  )
}

_onMouseMove(e) {

  let coords = this.coordToIndex(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

  const mouseX = e.nativeEvent.pageX - this.gridRef.offsetLeft - 30;
  const mouseY = e.nativeEvent.pageY - this.gridRef.offsetTop - 60;

  const [cellColIndex, cellRowIndex] = [Math.floor(mouseX / this.props.dateCellWidth), Math.floor(mouseY / this.props.dateCellHeight)];
  this.setState({ mouseX: cellColIndex, mouseY: cellRowIndex});
}


render(): React.Element <*> {
  return(
    <Wrapper
      onMouseDown = {()=> { this.mouseDown = true}}
      onMouseUp = {()=> { this.mouseDown = false }}>

  <Grid innerRef={el => { this.gridRef = el }}
    onMouseMove={this._onMouseMove.bind(this)}
    onMouseUp={() => this.endSelection()}
    >
    {this.renderTimeLabels()}
    {this.dates.map((e, i) => this.renderDateColumn(i, e))}
  </Grid >


  <h1>{this.state.mouseX} {this.state.mouseY}</h1>
    </Wrapper >
    )
  }
}
