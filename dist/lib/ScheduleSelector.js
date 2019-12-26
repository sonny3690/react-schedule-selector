'use strict';

exports.__esModule = true;
exports.preventScroll = exports.GridCell = undefined;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _add_hours = require('date-fns/add_hours');

var _add_hours2 = _interopRequireDefault(_add_hours);

var _add_days = require('date-fns/add_days');

var _add_days2 = _interopRequireDefault(_add_days);

var _start_of_day = require('date-fns/start_of_day');

var _start_of_day2 = _interopRequireDefault(_start_of_day);

var _is_same_minute = require('date-fns/is_same_minute');

var _is_same_minute2 = _interopRequireDefault(_is_same_minute);

var _format = require('date-fns/format');

var _format2 = _interopRequireDefault(_format);

var _typography = require('./typography');

var _colors = require('./colors');

var _colors2 = _interopRequireDefault(_colors);

var _selectionSchemes = require('./selection-schemes');

var _selectionSchemes2 = _interopRequireDefault(_selectionSchemes);

var _dateUtils = require('./date-utils');

var _dateFns = require('date-fns');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Import only the methods we need from date-fns in order to keep build size small


var formatHour = function formatHour(hour) {
  var h = hour === 0 || hour === 12 || hour === 24 ? 12 : hour % 12;
  var abb = hour < 12 || hour === 24 ? 'am' : 'pm';
  return '' + h + abb;
};

var Wrapper = (0, _styledComponents2.default)('div').withConfig({
  displayName: 'ScheduleSelector__Wrapper',
  componentId: 'sc-10qe3m2-0'
})(['display:flex;align-items:center;width:100%;user-select:none;']);

var Grid = (0, _styledComponents2.default)('div').withConfig({
  displayName: 'ScheduleSelector__Grid',
  componentId: 'sc-10qe3m2-1'
})(['display:flex;flex-direction:row;align-items:stretch;width:100%;']);

var Column = (0, _styledComponents2.default)('div').withConfig({
  displayName: 'ScheduleSelector__Column',
  componentId: 'sc-10qe3m2-2'
})(['display:flex;flex-direction:column;width:', ';'], function (props) {
  return props.dateCellWidth + 'px';
});

var GridCell = exports.GridCell = (0, _styledComponents2.default)('div').withConfig({
  displayName: 'ScheduleSelector__GridCell',
  componentId: 'sc-10qe3m2-3'
})(['margin:', 'px;touch-action:none;width:', ';'], function (props) {
  return props.margin;
}, function (props) {
  return props.dateCellWidth + 'px';
});

var handleQuarterCellBorder = function handleQuarterCellBorder(quarter) {

  switch (quarter) {
    case 0:
      return "border-style: solid solid none none";
    case 1:
      return "border-style: none solid dashed solid";
    case 2:
      return "border-style: none solid none none";
    case 3:
      return "border-style: none solid solid none";
  }
};

var cellVal = function cellVal(val) {
  return val + 'px';
};

var DateCell = (0, _styledComponents2.default)('div').withConfig({
  displayName: 'ScheduleSelector__DateCell',
  componentId: 'sc-10qe3m2-4'
})(['height:', ';width:', ';border-width:0.2px;', ';margin:0px 0px;background-color:', ';'], function (props) {
  return props.dateCellHeight + 'px';
}, function (props) {
  return props.dateCellWidth + 'px';
}, function (_ref) {
  var quarter = _ref.quarter;
  return handleQuarterCellBorder(quarter);
}, function (props) {
  return props.selected ? props.selectedColor : props.unselectedColor;
});

var DateLabel = (0, _styledComponents2.default)(_typography.Subtitle).withConfig({
  displayName: 'ScheduleSelector__DateLabel',
  componentId: 'sc-10qe3m2-5'
})(['color:', ';font-size:', ';margin:5px 0px;@media (max-width:699px){font-size:12px;}'], function (props) {
  return props.dayOfWeek ? 'black' : '#00011F';
}, function (props) {
  return props.dayOfWeek ? '1.3rem' : '1rem';
});

var TimeLabelCell = (0, _styledComponents2.default)('div').withConfig({
  displayName: 'ScheduleSelector__TimeLabelCell',
  componentId: 'sc-10qe3m2-6'
})(['position:relative;display:block;width:30px;height:', ';text-align:center;display:flex;justify-content:center;margin-right:3px;align-items:center;'], function (_ref2) {
  var dateCellHeight = _ref2.dateCellHeight;
  return dateCellHeight * 4 + 'px';
});

var TimeText = (0, _styledComponents2.default)(_typography.Text).withConfig({
  displayName: 'ScheduleSelector__TimeText',
  componentId: 'sc-10qe3m2-7'
})(['margin:0;@media (max-width:699px){font-size:10px;}text-align:right;']);

var preventScroll = exports.preventScroll = function preventScroll(e) {
  e.preventDefault();
};

var ScheduleSelector = function (_React$Component) {
  _inherits(ScheduleSelector, _React$Component);

  function ScheduleSelector(props) {
    _classCallCheck(this, ScheduleSelector);

    // Generate list of dates to render cells for
    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _initialiseProps.call(_this);

    var startTime = (0, _start_of_day2.default)(props.startDate);
    _this.dates = [];

    var selected = [];

    for (var d = 0; d < props.numDays; d += 1) {
      var currentDay = [];

      for (var h = props.minTime; h <= props.maxTime; h += 1) {
        for (var i = 0; i < 4; i++) {
          var currentTime = (0, _add_hours2.default)((0, _add_days2.default)(startTime, d), h + 0.25 * i);
          currentDay.push(currentTime);
        }
      }
      _this.dates.push(currentDay);
    }

    _this.state = {
      mouseX: 0,
      mouseY: 0,
      startCoord: [-1, -1]
    };

    _this.selectionSchemeHandlers = {
      linear: _selectionSchemes2.default.linear,
      square: _selectionSchemes2.default.square

      // true if adding false if deleting
    };_this.addMode = false;
    _this.mouseDown = false;

    _this.selected = new Set();
    _this.highlighted = new Set();

    return _this;
  }

  // returns 


  ScheduleSelector.prototype._onMouseMove = function _onMouseMove(e) {

    var coords = this.coordToIndex(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    var mouseX = e.nativeEvent.pageX - this.gridRef.offsetLeft - this.props.offsetLeft;
    var mouseY = e.nativeEvent.pageY - this.gridRef.offsetTop - this.props.offsetTop;

    var _ref3 = [Math.floor(mouseX / this.props.dateCellWidth), Math.floor(mouseY / this.props.dateCellHeight)],
        cellColIndex = _ref3[0],
        cellRowIndex = _ref3[1];

    this.setState({ mouseX: cellColIndex, mouseY: cellRowIndex });
  };

  ScheduleSelector.prototype.render = function render() {
    var _this2 = this;

    return React.createElement(
      Wrapper,
      {
        onMouseDown: function onMouseDown() {
          _this2.mouseDown = true;
        },
        onMouseUp: function onMouseUp() {
          _this2.mouseDown = false;
        } },
      React.createElement(
        Grid,
        { innerRef: function innerRef(el) {
            _this2.gridRef = el;
          },
          onMouseMove: this._onMouseMove.bind(this),
          onMouseUp: function onMouseUp() {
            return _this2.endSelection();
          }
        },
        this.renderTimeLabels(),
        this.dates.map(function (e, i) {
          return _this2.renderDateColumn(i, e);
        })
      )
    );
  };

  return ScheduleSelector;
}(React.Component);

ScheduleSelector.defaultProps = {
  selection: [],
  selectionScheme: 'square',
  numDays: 7,
  minTime: 9,
  maxTime: 23,
  startDate: new Date(),
  dateFormat: 'M/D',
  margin: 0,
  selectedColor: _colors2.default.blue,
  unselectedColor: _colors2.default.paleBlue,
  hoveredColor: _colors2.default.lightBlue,
  dateCellHeight: 15,
  dateCellWidth: 80,
  offsetLeft: 30,
  offsetTop: 60,
  timeLabelMargin: 15,
  onChange: function onChange() {}
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.startSelection = function (dayIndex, timeIndex) {
    if (dayIndex < 0 || timeIndex < 0) {
      return;
    }

    _this3.mouseDown = true;

    _this3.addMode = !_this3.selected.has((0, _dateUtils.stringify)(dayIndex, timeIndex));

    _this3.setState({ startCoord: [dayIndex, timeIndex] });
  };

  this.endSelection = function () {

    for (var x = Math.min(_this3.state.startCoord[0], _this3.state.mouseX); x <= Math.max(_this3.state.startCoord[0], _this3.state.mouseX); x++) {
      for (var y = Math.min(_this3.state.startCoord[1], _this3.state.mouseY); y <= Math.max(_this3.state.startCoord[1], _this3.state.mouseY); y++) {

        if (_this3.addMode) {
          _this3.selected.add((0, _dateUtils.stringify)(x, y));
        } else {
          _this3.selected.delete((0, _dateUtils.stringify)(x, y));
        }
      }
    }

    _this3.setState({ startCoord: [-1, -1] });
    _this3.mouseDown = false;
  };

  this.coordToIndex = function (x, y) {

    return [Math.floor(x / _this3.props.dateCellWidth), Math.floor(y / _this3.props.dateCellHeight)];
  };

  this.renderTimeLabels = function () {
    var labels = [React.createElement(DateLabel, { key: -1 })]; // Ensures time labels start at correct location
    for (var t = _this3.props.minTime; t <= _this3.props.maxTime; t += 1) {
      labels.push(React.createElement(
        TimeLabelCell,
        { key: t, dateCellHeight: _this3.props.dateCellHeight },
        React.createElement(
          TimeText,
          null,
          formatHour(t)
        )
      ));
    }
    return React.createElement(
      Column,
      { style: { marginTop: _this3.props.timeLabelMargin } },
      labels
    );
  };

  this.renderDateColumn = function (dayIndex, dayOfTimes) {

    return React.createElement(
      Column,
      {
        key: dayOfTimes[0],
        margin: _this3.props.margin,
        dateCellWidth: _this3.props.dateCellWidth,
        dateCellHeight: _this3.props.dateCellHeight
      },
      React.createElement(
        GridCell,
        { margin: _this3.props.margin, dateCellWidth: _this3.props.dateCellWidth, dateCellHeight: _this3.props.dateCellHeight },
        React.createElement(
          DateLabel,
          null,
          (0, _format2.default)(dayOfTimes[0], _this3.props.dateFormat)
        ),
        React.createElement(
          DateLabel,
          { dayOfWeek: true },
          (0, _format2.default)(dayOfTimes[1], 'ddd')
        )
      ),
      dayOfTimes.map(function (time, i) {
        return _this3.renderDateCellWrapper(time, dayIndex, i);
      })
    );
  };

  this.shouldHighlight = function (s) {
    var _unstringify = (0, _dateUtils.unstringify)(s),
        x = _unstringify[0],
        y = _unstringify[1];

    var highlighted = _this3.mouseDown && (0, _dateUtils.between)(_this3.state.startCoord[0], _this3.state.mouseX, x) && (0, _dateUtils.between)(_this3.state.startCoord[1], _this3.state.mouseY, y);
    var selected = _this3.selected.has(s);

    return _this3.mouseDown && _this3.addMode && highlighted || !_this3.mouseDown && selected || selected && !highlighted;
  };

  this.renderDateCellWrapper = function (time, dayIndex, timeIndex) {

    var stringified = (0, _dateUtils.stringify)(dayIndex, timeIndex);

    return React.createElement(
      GridCell,
      {
        className: 'rgdp__grid-cell',
        role: 'presentation',
        margin: 0,
        key: time.toISOString()
        // Mouse handlers
        , onMouseDown: function onMouseDown() {
          return _this3.startSelection(dayIndex, timeIndex);
        }
      },
      React.createElement(DateCell, {
        selected: _this3.shouldHighlight(stringified),
        dateCellHeight: _this3.props.dateCellHeight,
        quarter: time.getMinutes() / 15,
        selectedColor: _this3.props.selectedColor,
        unselectedColor: _this3.props.unselectedColor,
        hoveredColor: _this3.props.hoveredColor
      })
    );
  };
};

exports.default = ScheduleSelector;