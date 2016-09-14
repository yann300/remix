'use strict';
var decoder = require('./decoder');
var varUtil = require('./variable');
var ethutil = require('ethereumjs-util');

module.exports = {
  decodeLocals: function (locals, stack, memory) {
    var decodedLocal = {};
    for (var k in locals) {
      var local = locals[k];
      decodedLocal[local.name] = this.decode(local, stack, memory).value;
    }
    return decodedLocal;
  },

  decodeType: function (local, value, memory) {
    var ret = {};
    if (varUtil.isInt(local.type)) {
      ret = this.decodeInt(local, value, memory);
    } else if (local.type.innerType === 'bool') {
      ret = this.decodeBool(local, value, memory);
    } else if (local.type.isStruct) {
      ret = this.decodeStruct(local, value, memory);
    } else if (local.type.isBytes) {
      ret = this.decodeBytes(local, value, memory);
    } else if (local.type.isEnum) {
      ret = this.decodeEnum(local, value, memory);
    } else if (varUtil.isAddress(local.type)) {
      ret = this.decodeAddress(local, value, memory);
    }
    return ret;
  },

  decode: function (local, stack, memory) {
    var value = getStackValue(stack, local.position);
    if (!value) {
      return '';
    }
    memory = memory.join('');
    var ret;
    if (local.type.isArray) {
      ret = this.decodeArray(local, value, memory);
    } else {
      ret = this.decodeType(local, value, memory);
    }
    return ret;
  },

  decodeAddress: function (local, value, memory) {
    if (local.memoryType === 'stack') {
      return {
        value: value,
        memSize: local.type.memSize
      };
    } else {
      return {
        value: memory.substr(value, local.type.memSize),
        memSize: local.type.memSize
      };
    }
  },

  decodeBytes: function (local, value, memory) {
    var ret = {};
    if (local.memoryType === 'stack') {
      ret.value = value;
      ret.memSize = 64;
    } else {
      ret.memSize = 0;
      var offset = formatOffset(local, value, memory);
      var size = local.type.memSize;
      if (local.type.size === 'dynamic') {
        size = memory.substr(offset, 64);
        size = 2 * parseInt(size, 16);
        offset += 64;
        ret.memSize += 64;
      }
      ret.value = '0x' + memory.substr(offset, size);
      ret.memSize += size;
      if (local.type.innerType === 'string') {
        ret.value = decoder.decodeString(ret.value, local.type);
      }
    }
    return ret;
  },

  decodeStruct: function (local, offset, memory) {
    var ret = {};
    for (var k in local.type.members) {
      var member = local.type.members[k];
      var itemRet = this.decode(member, offset, memory);
      ret[member.name] = itemRet.value;
      offset += itemRet.memSize;
    }
    return ret;
  },

  decodeArray: function (local, offset, memory) {
    offset = formatOffset(local, offset, memory);
    var ret = this.decodeArrayInternal(local, 0, offset, memory);
    return ret;
  },

  decodeArrayInternal: function (local, depth, offset, memory) {
    var ret = [];
    var size = local.type.dim[depth];
    if (size === 'dynamic') {
      size = memory.substr(offset, 64);
      size = parseInt(size, 16);
      offset += 64;
    }
    var memSize = 0;
    for (var k = 0; k < size; k++) {
      var itemRet;
      var remoteOffset = offset;
      if (depth === local.type.dim.length - 1) {
        if (local.type.size === 'dynamic') {
          remoteOffset = this.getItemRemoteOffset(local, offset, memory);
        }
        itemRet = this.decodeType(local, remoteOffset, memory);
        if (local.type.size === 'dynamic') {
          offset += 64;
          memSize += 64;
        } else {
          offset += 64;
          memSize += 64;
        }
      } else {
        remoteOffset = this.getItemRemoteOffset(local, offset, memory);
        itemRet = this.decodeArrayInternal(local, depth + 1, remoteOffset, memory);
        offset += 64;
        memSize += itemRet.memSize;
      }

      ret.push(itemRet.value);
    }
    return {
      value: ret,
      mem: memSize
    };
  },

  getItemRemoteOffset: function (local, offset, memory) {
    var remoteOffset = offset;
    remoteOffset = memory.substr(remoteOffset, 64);
    remoteOffset = ethutil.unpad(remoteOffset);
    remoteOffset = parseInt(remoteOffset, 16) * 2;
    return remoteOffset;
  },

  decodeInt: function (local, value, memory) {
    value = formatOffset(local, value, memory);
    if (local.memoryType === 'memory') {
      value = memory.substr(value, 64);
    }
    return {
      value: decoder.decodeInt(value, local.type),
      memSize: 64
    };
  },

  decodeBool: function (local, value, memory) {
    value = formatOffset(local, value, memory);
    if (local.memoryType === 'memory') {
      value = memory.substr(value, local.type.memSize);
    }
    return {
      value: decoder.decodeBool(value, local.type),
      memSize: 64
    };
  },

  decodeEnum: function (local, value, memory) {
    value = formatOffset(local, value, memory);
    if (local.memoryType === 'memory') {
      value = memory.substr(value, local.type.memSize);
    }
    return {
      value: decoder.decodeEnum(value, local.type),
      memSize: 64
    };
  }
};

function getStackValue (stack, position) {
  var value = stack[stack.length - 1 - position];
  if (!value) {
    return undefined;
  }
  if (value === '0x') {
    value = '0x00';
  }
  return value;
}

function formatOffset (local, value, memory) {
  if (local.memoryType === 'memory' && value.indexOf && value.indexOf('0x') === 0) {
    value = 2 * parseInt(value, 16);
  }
  return value;
}
