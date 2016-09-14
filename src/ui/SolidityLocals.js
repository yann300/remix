'use strict'
var BasicPanel = require('./BasicPanel')
var yo = require('yo-yo')
var contractsHelper = require('../solidity/contracts')
var decoder = require('../solidity/localsDecoder')
var SourceMappingDecoder = require('../util/sourceMappingDecoder')

function SolidityLocals (_solDebugger, _parent, _traceManager, _codeManager, _sourceLocationTracker) {
  this.solDebugger = _solDebugger
  this.parent = _parent
  this.traceManager = _traceManager
  this.codeManager = _codeManager
  this.basicPanel = new BasicPanel('Locals Variables', null, null, true)
  this.sourceMappingDecoder = new SourceMappingDecoder()
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
  this.parent.register('traceUnloaded', this, function () {
    self.basicPanel.data = ''
    self.basicPanel.update()
  })

  this.codeManager.register('changed', this, function (code, address, index) {
    self.sourceLocationTracker.getSourceLocation(address, index, self.compiledContracts, function (error, rawLocation) {
      if (!error) {
        var nodeDef = contractsHelper.getNodeFromSourceLocation(rawLocation, self.astList)
        if (nodeDef && nodeDef.parent && self.locals[nodeDef.parent.id]) {
          var toDecode = {}
          var currentLocals = self.locals[nodeDef.parent.id]
          for (var k in currentLocals) {
            if (parseInt(currentLocals[k].type.src.split(':')[0]) <= rawLocation.start) {
              toDecode[currentLocals[k].name] = currentLocals[k]
            }
          }
          self.decodeLocals(toDecode)
        } else {
          self.basicPanel.data = '{}'
          self.basicPanel.update()
        }
      }
    })
  })
}

SolidityLocals.prototype.decodeLocals = function (locals, localsDefinitions) {
  var self = this
  var currentStack
  this.traceManager.getStackAt(this.parent.currentStepIndex, function (error, stack) {
    if (error) {
      console.log(error)
    } else {
      currentStack = stack
    }
  })

  this.traceManager.getMemoryAt(this.parent.currentStepIndex, function (error, memory) {
    if (error) {
      console.log(error)
    } else {
      self.basicPanel.data = decoder.decodeLocals(locals, currentStack, memory)
      self.basicPanel.update()
    }
  })
}

module.exports = SolidityLocals
