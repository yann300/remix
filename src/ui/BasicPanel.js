'use strict'
var style = require('./styles/basicStyles')
var yo = require('yo-yo')
var ui = require('../helpers/ui')
var jsonMarkup = require('json-markup')
var jsonStyle = require('../ui/styles/jsonMarkup')

function BasicPanel (_name, _width, _height, _html) {
  this.data
  this.name = _name
  this.width = _width
  this.height = _height
  this.view
  this.html = false
  if (_html) {
    this.html = _html
  }
}

BasicPanel.prototype.update = function () {
  yo.update(this.view, this.render())
  if (this.html) {
    this.view.querySelector('#basicpanel').innerHTML = jsonMarkup(this.data, jsonStyle)
  }
}

BasicPanel.prototype.hide = function () {
  this.view.style.display = 'none'
}

BasicPanel.prototype.show = function () {
  this.view.style.display = 'block'
}

BasicPanel.prototype.content = function () {
  if (this.html) {
    return yo`<div style=${ui.formatCss({'width': this.width}, style.panel.table, style.font)} id='basicpanel' ></div>`
  } else {
    return yo`<pre style=${ui.formatCss({'width': this.width}, style.panel.table, style.font)} id='basicpanel' >${this.data}</pre>`
  }
}

BasicPanel.prototype.render = function () {
  var view = yo`<div id='container' style=${ui.formatCss({'width': this.width}, style.panel.container)}>
    <div style=${ui.formatCss(style.panel.title)}>
      ${this.name}
    </div>
      <div style=${ui.formatCss({'height': this.height}, style.panel.tableContainer)}>
      ${this.content()}
    </div>
  </div>`
  if (!this.view) {
    this.view = view
  }
  return view
}

module.exports = BasicPanel
