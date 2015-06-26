"use strict"

require('../../less/checkbox.less')

let React = require('react')
let Checkbox = require('./checkbox.jsx')
let Strings = require('../utils/strings')
let Classable = require('../mixins/classable')
let Objects = require('../utils/objects')
let Resource = require('../mixins/resource')
let ReceiveValue = require('../mixins/receive-value')

let CheckboxGroup = React.createClass({
  displayName: "CheckboxGroup",

  propTypes: {
    cache: React.PropTypes.bool,
    data: React.PropTypes.array,
    inline: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    readOnly: React.PropTypes.bool,
    sep: React.PropTypes.string,
    src: React.PropTypes.string,
    textTpl: React.PropTypes.string,
    value: React.PropTypes.any,
    valueTpl: React.PropTypes.string
  },

  mixins: [Classable, ReceiveValue, Resource],

  getDefaultProps: function () {
    return {
      sep: ',',
      textTpl: '{text}',
      valueTpl: '{id}'
    }
  },

  getInitialState: function () {
    return {
      data: []
    }
  },

  formatValue: function (value) {
    return Strings.toArray(value, this.props.sep)
  },

  initData: function (data) {
    data = Objects.toTextValue(data, this.props.textTpl, this.props.valueTpl)
    this.setState({ data: data })
  },

  handleChange: function (checked, value) {
    if (typeof value !== 'string') {
      value = value.toString()
    }

    let values = this.state.value
    if (checked) {
      values.push(value)
    } else {
      let i = values.indexOf(value)
      if (i >= 0) {
        values.splice(i, 1)
      }
    }

    if (this.props.onChange) {
      this.props.onChange(this.props.sep ? values.join(this.props.sep) : values)
    }

    this.setState({ value: values })
  },

  getValue: function (sep) {
    let value = this.state.value
    if (sep === undefined) {
      sep = this.props.sep
    }
    if (sep) {
      value = value.join(sep)
    }
    return value
  },

  render: function () {
    let className = this.getClasses(
      'checkbox-group',
      {
        'inline': this.props.inline
      }
    )
    let values = this.state.value

    let items = this.state.data.map((item, i) => {
      let value = this.props.sep ? item.$value.toString() : item.$value
      let checked = values.indexOf(value) >= 0
      return (
        <Checkbox key={i}
          index={i}
          readOnly={this.props.readOnly}
          checked={checked}
          onChange={this.handleChange}
          text={item.$text}
          value={item.$value}
        />
      )
    })

    return (
      <div className={className}>{this.state.msg || items}</div>
    )
  }
})

module.exports = CheckboxGroup

require('./form-control.jsx').register(

  'checkbox-group',

  function (props) {
    return <CheckboxGroup {...props} />
  },

  'array'
)