import { logError } from './console'
import { json } from 'd3'
const EDUCATION_FILE =
	'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const COUNTY_FILE =
	'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

export default async function processData() {
	try {
		const [county, education] = await Promise.all([
			json(COUNTY_FILE),
			json(EDUCATION_FILE),
		])

		console.log({ county, education })
		return { county, education }
	} catch (error) {
		if (error) logError(error)
		return null
	}
}
