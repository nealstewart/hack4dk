import {initMap, updateHeatmap} from './map'
import { filter, random, map, uniq } from 'lodash'

function getLoans(page) {
	return fetch('http://95.85.14.213/loan/?page=' + page).then((a) => a.json());
}

function getLibraries() {
	return fetch('http://95.85.14.213/library/').then((a) => a.json());
}

function getLoansPerLibrary(loans) {
	return loans.reduce((counts, loan) => {
		const lastCount = counts[loan.biblioteks_id] || 0;
		return {...counts, [loan.biblioteks_id]: lastCount + 1};
	}, {})
}

function createWeightedMap(libraries, loanCounts) {
	const libsWithLoc = filter(libraries, (l) => !!l.latitude)
	return map(libsWithLoc, lib => {
		return {
			location: new google.maps.LatLng(lib.latitude, lib.longitude),
			weight: loanCounts[lib.id] || 0
		};
	});
}

const LIBRARIES = getLibraries();

window.init = function() {
	Promise.all([LIBRARIES, getLoans(0)])
		.then(([libraries, loans]) => {
			initMap(createWeightedMap(libraries, getLoansPerLibrary(loans)));
		})
		.catch(err => console.error(err));
};

var page = 0;
window.animate = function() {
	console.log('animate');
	setInterval(() => {
		Promise.all([LIBRARIES, getLoans(page++)])
			.then(([libraries, loans]) => {
				const map = createWeightedMap(libraries, getLoansPerLibrary(loans));
				updateHeatmap(map);
			})
			.catch(err => console.error(err));
	}, 400);

};
