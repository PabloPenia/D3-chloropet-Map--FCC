import {
	axisBottom,
	geoPath,
	range,
	scaleLinear,
	scaleThreshold,
	schemeBlues,
	select,
} from 'd3'
import { feature, mesh } from 'topojson'
import { logMsg } from './console'

const color = scaleThreshold()
	.domain(range(2.6, 75.1, (75.1 - 2.6) / 8))
	.range(schemeBlues[9])
const path = geoPath()
const body = select('body')
const tooltip = body
	.append('div')
	.attr('class', 'tooltip')
	.attr('id', 'tooltip')
	.style('opacity', 0)

const x = scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860])
const drawScale = (map) => {
	const g = map
		.append('g')
		.attr('class', 'key')
		.attr('id', 'legend')
		.attr('transform', 'translate(0,40)')

	g.selectAll('rect')
		.data(
			color.range().map((d) => {
				d = color.invertExtent(d)
				if (d[0] === null) {
					d[0] = x.domain()[0]
				}
				if (d[1] === null) {
					d[1] = x.domain()[1]
				}
				return d
			})
		)
		.enter()
		.append('rect')
		.attr('height', 8)
		.attr('x', (d) => x(d[0]))
		.attr('width', (d) => (d[0] && d[1] ? x(d[1]) - x(d[0]) : x(null)))
		.attr('fill', (d) => color(d[0]))

	g.append('text')
		.attr('class', 'caption')
		.attr('x', x.range()[0])
		.attr('y', -6)
		.attr('fill', '#000')
		.attr('text-anchor', 'start')
		.attr('font-weight', 'bold')

	g.call(
		axisBottom(x)
			.tickSize(13)
			.tickFormat((x) => Math.round(x) + '%')
			.tickValues(color.domain())
	)
		.select('.domain')
		.remove()
}

export default function drawMap(canvas, data) {
	const { county, education } = data
	const map = select(canvas)
	drawScale(map)
	map
		.append('g')
		.attr('class', 'counties')
		.selectAll('path')
		.data(feature(county, county.objects.counties).features)
		.enter()
		.append('path')
		.attr('class', 'county')
		.attr('data-fips', (d) => d.id)
		.attr('data-education', (d) => {
			const res = education.filter((obj) => obj.fips === d.id)
			if (res[0]) {
				return res[0].bachelorsOrHigher
			}
			// could not find a matching fips id in the data
			logMsg('There is no data for', d.id)
			return 0
		})
		.attr('fill', (d) => {
			const res = education.filter((obj) => obj.fips === d.id)
			if (res[0]) {
				return color(res[0].bachelorsOrHigher)
			}
			// could not find a matching fips id in the data
			return color(0)
		})
		.attr('d', path)
		.on('mouseover', (event, d) => {
			tooltip.style('opacity', 0.9)
			tooltip
				.html(() => {
					const res = education.filter((obj) => obj.fips === d.id)
					if (res[0]) {
						return (
							res[0]['area_name'] +
							', ' +
							res[0]['state'] +
							': ' +
							res[0].bachelorsOrHigher +
							'%'
						)
					}
					// could not find a matching fips id in the data
					return 0
				})
				.attr('data-education', () => {
					const res = education.filter((obj) => obj.fips === d.id)
					if (res[0]) {
						return res[0].bachelorsOrHigher
					}
					// could not find a matching fips id in the data
					return 0
				})
				.style('left', event.pageX + 10 + 'px')
				.style('top', event.pageY - 28 + 'px')
		})
		.on('mouseout', () => {
			tooltip.style('opacity', 0)
		})

	map
		.append('path')
		.datum(
			mesh(county, county.objects.states, function (a, b) {
				return a !== b
			})
		)
		.attr('class', 'states')
		.attr('d', path)
}
