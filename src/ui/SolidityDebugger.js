'use strict'
var style = require('./styles/basicStyles')
var SolidityStatePanel = require('./SolidityStatePanel')
var SolidityLocals = require('./SolidityLocals')
var variableUtil = require('../solidity/variable')
var contractsHelper = require('../solidity/contracts')
var yo = require('yo-yo')
var ui = require('../helpers/ui')

function SolidityDebugger (_parent, _traceManager, _codeManager, _sourceLocationTracker) {
  this.solidityStatePanel = new SolidityStatePanel(_parent, _traceManager, _codeManager)
  this.solidityLocals = new SolidityLocals(_parent, _traceManager, _codeManager, _sourceLocationTracker)
  this.compiledContracts
  this.astList
  this.view
  var self = this
  _parent.register('newTraceLoaded', this, function () {
    self.view.style.display = 'block'
  })
  _parent.register('traceUnloaded', this, function () {
    self.view.style.display = 'none'
  })

  _traceManager.traceAnalyser.register('stepAnalysed', this, function (step, address, vmTraceIndex) {
    if (step.op.indexOf('PUSH') === -1) {
      return
    }
    _codeManager.getCode(address, function (error, code) {
      if (!error) {
        _codeManager.getInstructionIndex(address, vmTraceIndex, function (error, instIndex) {
          if (error) {
            console.log(error)
          } else {
            _sourceLocationTracker.getSourceLocation(address, instIndex, self.compiledContracts, function (error, rawLocation) {
              if (!self.compiledContracts) {
                return
              }
              if (error) {
                console.log(error)
              } else {
                var nodeDef = contractsHelper.getVariableDeclarationFromSourceLocation(rawLocation, self.astList)
                if (nodeDef && nodeDef.node && nodeDef.node.name === 'VariableDeclaration' && step.op.indexOf('PUSH') !== -1) {
                  self.addLocal(nodeDef, step)
                }
              }
            })
          }
        })
      }
    })
  })
}

SolidityDebugger.prototype.addLocal = function (nodeDef, step) {
  if (!this.solidityLocals.locals[nodeDef.parent.id]) {
    this.solidityLocals.locals[nodeDef.parent.id] = {}
  }
  this.solidityLocals.locals[nodeDef.parent.id][nodeDef.node.id] = {
    name: nodeDef.node.attributes.name,
    type: variableUtil.getBasicType(nodeDef.node),
    memoryType: 'stack',
    position: step.stack.length
  }
}

SolidityDebugger.prototype.setCompilationResult = function (astList, compiledContracts) {
  this.solidityStatePanel.setCompilationResult(astList, compiledContracts)
  this.solidityLocals.setCompilationResult(astList, compiledContracts)
  this.compiledContracts = compiledContracts
  this.astList = astList
}

SolidityDebugger.prototype.render = function () {
  var view = yo`<div id='soldebugger' style='display:none'>
        <div style=${ui.formatCss(style.container)}>
          <table>
            <tbody>  
              <tr>
               <td>
                  ${this.solidityStatePanel.render()}
                </td>
                <td>
                  ${this.solidityLocals.render()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>`
  if (!this.view) {
    this.view = view
  }
  return view
}

module.exports = SolidityDebugger
