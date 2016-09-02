'use strict'
var BN = require('ethereumjs-util').BN
var utileth = require('ethereumjs-util')
var varUtil = require('./variable')
var decoder = require('./variable')

module.exports = {  
  decodeInt: function (type, storageContent, location) {
    var bigNumber = new BN(value.replace('0x', ''), 16)
    if (type.innerType === 'uint') {
      return bigNumber.toString(10)
    } else if (type.innerType === 'int') {
      if (isNegative(bigNumber)) {
        return '-' + bigNumber.sub(new BN(new Array(value.length + 1).join('f'), 16)).sub(new BN(1)).toString(10) // return utileth.fromSigned(utileth.toUnsigned(bigNumber)).toString(10)
      } else {
        return bigNumber.toString(10)
      }
    }
  }
}