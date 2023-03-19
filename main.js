import './style.scss'
import processData from './processData'
import drawMap from './drawMap'
import { logMsg } from './console'
// import * as topojson from 'https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js'
// import 'https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js'
const CANVAS = '#canvas'
const data = await processData()

if (data) {
	drawMap(CANVAS, data)
} else {
	logMsg('There is no data to display')
}
