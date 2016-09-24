import initMap from './map'
import * as util from 'util'
import random from 'lodash.random'
import map from 'lodash.map'
import uniq from 'lodash.uniq'

function getLoans() {
	return fetch('http://95.85.14.213:8080/loan/').then((a) => a.json());
}

function getLibrary(id) {
	return new Promise((resolve) => resolve({
		id: id,
		latitude: random(55, 56, true),
		longitude: random(8, 9, true)
	}));
}

function getLibraries(loans) {
	const libraryIds = uniq(map(loans, 'biblioteks_id'));
	return Promise.all(map(libraryIds, getLibrary))
}

function getLoansPerLibrary(loans) {
	return loans.reduce((counts, loan) => {
		const lastCount = counts[loan.biblioteks_id] || 0;
		return {...counts, [loan.biblioteks_id]: lastCount + 1};
	}, {})
}

function createWeightedMap(libraries, loanCounts) {
	debugger;
	return map(libraries, lib => {
		return {
			location: new google.maps.LatLng(lib.longitude, lib.latitude),
			weight: loanCounts[lib.id] * 1000
		};
	});
}

window.init = function() {
	getLoans()
		.then(loans => {
			getLibraries(loans)
				.then(libraries => {
					initMap(createWeightedMap(libraries, getLoansPerLibrary(loans)));
				})
		})
};