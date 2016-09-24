import initMap from './map'
import { filter, random, map, uniq } from 'lodash'

function getLoans() {
	return fetch('http://95.85.14.213:8080/loan/').then((a) => a.json());
}

function getLibraries(loans) {
	return fetch('http://95.85.14.213:8080/library/').then((a) => a.json());
}

function getLoansPerLibrary(loans) {
	return loans.reduce((counts, loan) => {
		const lastCount = counts[loan.biblioteks_id] || 1;
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

var p = getLoans()
		.then(loans => {
			return getLibraries()
				.then(libraries => {
					console.log(libraries, loans);
					return {libraries, loans};
				});
		});

window.init = function() {
	p.then(({libraries, loans}) => {
		const map = createWeightedMap(libraries, getLoansPerLibrary(loans));
		console.log(map);
		initMap(map);
	});
};