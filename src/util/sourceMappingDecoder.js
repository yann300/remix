'use strict'
var util = require('../helpers/util')

/**
 * Decompress the source mapping given by solc-bin.js
 */
function SourceMappingDecoder () {
  // s:l:f:j
}

/**
 * Decode the source mapping for the given @arg index
 *
 * @param {Integer} index      - source mapping index to decode
 * @param {String} mapping     - compressed source mapping given by solc-bin
 * @return {Object} returns the decompressed source mapping for the given index {start, length, file, jump}
 */
SourceMappingDecoder.prototype.atIndex = function (index, mapping) {
  var ret = {}
  var map = mapping.split(';')
  if (index >= map.length) {
    index = map.length - 1
  }
  for (var k = index; k >= 0; k--) {
    var current = map[k]
    if (!current.length) {
      continue
    }
    current = current.split(':')
    if (ret.start === undefined && current[0] && current[0].length) {
      ret.start = parseInt(current[0])
    }
    if (ret.length === undefined && current[1] && current[1].length) {
      ret.length = parseInt(current[1])
    }
    if (ret.file === undefined && current[2] && current[2].length) {
      ret.file = parseInt(current[2])
    }
    if (ret.jump === undefined && current[3] && current[3].length) {
      ret.jump = current[3]
    }
    if (ret.start !== undefined && ret.length !== undefined && ret.file !== undefined && ret.jump !== undefined) {
      break
    }
  }
  return ret
}

/**
 * Decode the source mapping for the given compressed mapping
 *
 * @param {String} mapping     - compressed source mapping given by solc-bin
 * @return {Array} returns the decompressed source mapping. Array of {start, length, file, jump}
 */
SourceMappingDecoder.prototype.decompressAll = function (mapping) {
  var map = mapping.split(';')
  var ret = []
  for (var k in map) {
    var compressed = map[k].split(':')
    var sourceMap = {
      start: compressed[0] ? parseInt(compressed[0]) : ret[ret.length - 1].start,
      length: compressed[1] ? parseInt(compressed[1]) : ret[ret.length - 1].length,
      file: compressed[2] ? parseInt(compressed[2]) : ret[ret.length - 1].file,
      jump: compressed[3] ? compressed[3] : ret[ret.length - 1].jump
    }
    ret.push(sourceMap)
  }
  return ret
}

/**
  * Retrieve line/column position of each source char
  *
  * @param {String} source - contract source code
  * @return {Arrray} returns an array containing offset of line breaks
  */
SourceMappingDecoder.prototype.getLinebreakPositions = function (source) {
  var ret = []
  for (var pos = source.indexOf('\n'); pos >= 0; pos = source.indexOf('\n', pos + 1)) {
    ret.push(pos)
  }
  return ret
}

/**
 * Retrieve the line/colum position for the given source mapping
 *
 * @param {Object} sourceLocation - object containing attributes {source} and {length}
 * @param {Array} lineBreakPositions - array returned by the function 'getLinebreakPositions'
 * @return {Object} returns an object {start: {line, column}, end: {line, column}} (line/column count start at 0)
 */
SourceMappingDecoder.prototype.convertOffsetToLineColumn = function (sourceLocation, lineBreakPositions) {
  if (sourceLocation.start >= 0 && sourceLocation.length >= 0) {
    return {
      start: convertFromCharPosition(sourceLocation.start, lineBreakPositions),
      end: convertFromCharPosition(sourceLocation.start + sourceLocation.length, lineBreakPositions)
    }
  } else {
    return {
      start: null,
      end: null
    }
  }
}

SourceMappingDecoder.prototype.isAfter = function (location1, location2) {
  return parseInt(location1.split(':')[0]) >= parseInt(location2.split(':')[0])
}

function convertFromCharPosition (pos, lineBreakPositions) {
  var line = util.findLowerBound(pos, lineBreakPositions)
  if (lineBreakPositions[line] !== pos) {
    line = line + 1
  }
  var beginColumn = line === 0 ? 0 : (lineBreakPositions[line - 1] + 1)
  var column = pos - beginColumn
  return {
    line: line,
    column: column
  }
}

module.exports = SourceMappingDecoder
