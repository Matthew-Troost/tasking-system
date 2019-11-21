import guidGenerator from "uuid/v4"
import chroma from "chroma-js"

const toggleFullScreen = () => {
  let doc = window.document
  let docEl = doc.documentElement

  let requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen
  let cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl)
  } else {
    cancelFullScreen.call(doc)
  }
}

function stringToLink(toConvert) {
  return toConvert.toLowerCase().replace(new RegExp(" ", "g"), "-")
}

function linkToString(toConvert) {
  var str = toConvert.replace(new RegExp("-", "g"), " ")

  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match) {
    if (+match === 0) return " " // or if (/\s+/.test(match)) for white spaces
    return match.toUpperCase()
  })
}

function generateGuid() {
  return guidGenerator()
}

function generateColourPalette() {
  return chroma
    .scale(["#8afa6e", "#2A4857"])
    .mode("lch")
    .colors(8)
}

export default {
  toggleFullScreen,
  stringToLink,
  linkToString,
  generateGuid,
  generateColourPalette
}
