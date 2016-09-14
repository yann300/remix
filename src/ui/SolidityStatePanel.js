'use strict'
var BasicPanel = require('./BasicPanel')
var yo = require('yo-yo')
var contractsHelper = require('../solidity/contracts')

function SolidityStatePanel (_solDebugger, _parent, _traceManager, _codeManager) {
  this.solDebugger = _solDebugger
  this.parent = _parent
  this.traceManager = _traceManager
  this.codeManager = _codeManager
  this.basicPanel = new BasicPanel('Contract Storage', null, null, true)
  this.init()
  this.disabled = false
  this.astList
  this.compiledContracts
  this.cache = new Cache()
}

SolidityStatePanel.prototype.render = function () {
  return yo`<div id='soliditystate' >${this.basicPanel.render()}</div>`
}

SolidityStatePanel.prototype.setCompilationResult = function (astList, compiledContracts) {
  this.astList = astList
  this.compiledContracts = compiledContracts
}

SolidityStatePanel.prototype.init = function () {
  var self = this
  this.parent.register('traceUnloaded', this, function () {
    self.cache.clear()
    self.basicPanel.data = ''
    self.basicPanel.update()
  })

  this.parent.register('indexChanged', this, function (index) {
    if (self.disabled) return
    if (index < 0) return
    if (self.parent.currentStepIndex !== index) return

    self.traceManager.getStorageAt(index, self.parent.tx, function (error, storage) {
      if (error) {
        console.log(error)
        self.basicPanel.data = ''
      } else if (self.parent.currentStepIndex === index) {
        self.traceManager.getCurrentCalledAddressAt(index, function (error, address) {
          if (!error) {
            self.codeManager.getCode(address, function (error, code) {
              if (!error) {
                self.basicPanel.data = self.formatSolState(address, code, storage)
              }
            })
          }
        })
      }
      self.basicPanel.update()
    }, self.address)
  })
}

SolidityStatePanel.prototype.formatSolState = function (address, code, storage) {
  var ctrName = this.solDebugger.contractNameByAddress(address, code)
  if (ctrName) {
    var storageLocation = this.cache.storageLocationByContract[ctrName]
    if (!storageLocation) {
      storageLocation = contractsHelper.getStorageLocationOf(ctrName, this.astList)
      this.cache.storageLocationByContract[ctrName] = storageLocation
    }
    var stateVar = contractsHelper.decodeState(storageLocation, storage)
    return stateVar
  } else {
    return 'cannot found contract for address ' + address
  }
}

function Cache () {
  this.storageLocationByContract = {}
  this.clear = function () {
    this.storageLocationByContract = {}
    this.contractNameByAddress = {}
  }
}

module.exports = SolidityStatePanel
