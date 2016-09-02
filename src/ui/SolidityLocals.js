'use strict'
var BasicPanel = require('./BasicPanel')
var yo = require('yo-yo')
var contractsHelper = require('../solidity/contracts')
var decoder = require('../solidity/decoder')

function SolidityLocals (_parent, _traceManager, _codeManager, _sourceLocationTracker) {
  this.parent = _parent
  this.traceManager = _traceManager
  this.codeManager = _codeManager
  this.basicPanel = new BasicPanel('Locals Variables')
  this.sourceLocationTracker = _sourceLocationTracker
  this.init()
  this.disabled = false
  this.astList
  this.compiledContracts
  this.locals = {}
}

SolidityLocals.prototype.render = function () {
  return yo`<div id='soliditylocals' >${this.basicPanel.render()}</div>`
}

SolidityLocals.prototype.setCompilationResult = function (astList, compiledContracts) {
  this.astList = astList
  this.compiledContracts = compiledContracts
}

SolidityLocals.prototype.init = function () {
  var self = this
  this.locals = {}
  this.codeManager.register('changed', this, function (code, address, index) {
    self.sourceLocationTracker.getSourceLocation(address, index, self.compiledContracts, function (error, rawLocation) {
      if (!error) {
        var nodeDef = contractsHelper.getNodeFromSourceLocation(rawLocation, self.astList)
        if (nodeDef && nodeDef.parent && self.locals[nodeDef.parent.id]) {
          self.decodeLocals(self.locals[nodeDef.parent.id])
        } else {
          self.basicPanel.data = '{}'
          self.basicPanel.update()
        }
      }
    })
  })
}

SolidityLocals.prototype.decodeLocals = function (locals) {
  var self = this
  var decodedLocal = {}
  this.traceManager.getStackAt(this.parent.currentStepIndex, function (error, stack) {
    if (error) {
      console.log(error)
    } else {
      for (var k in locals) {
        var local = locals[k]
        if (local.memoryType === 'stack') {
          var value = stack[stack.length - 1 - local.position]
          if (value) {
            decodedLocal[local.name] = decoder.decodeInt(value, local.type)
          }
        }
      }
      self.basicPanel.data = JSON.stringify(decodedLocal, null, ' ')
      self.basicPanel.update()
    }
  })
}

module.exports = SolidityLocals
