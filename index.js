import {initMap, updateHeatmap} from './map'
import { filter, random, map, uniq, find, compact } from 'lodash'
var moment = require('moment');

var myHeaders = new Headers();
myHeaders.append('pragma', 'no-cache');

function getLoans(date) {
	var headers = new Headers();
myHeaders.append('pragma', 'cache');
	return fetch('http://95.85.14.213/loan/?size=1000000&date=' + date, {
		cache: 'default',
		mode: 'cors',
		headers
	}).then((a) => a.json());
}

function getLoanStats(date) {
	return fetch('http://95.85.14.213/loan/grouped?size=1000000&date=' + date, {
		cache: 'default',
		mode: 'cors'
	}).then((a) => a.json());
}

function getLibraries() {
	return fetch('http://95.85.14.213/library/', {
		cache: 'default',
		mode: 'cors'
	}).then((a) => a.json())
		.then(libraries => filter(libraries, (l) => !!l.latitude));
}

function getLoansPerLibrary(loans) {
	return loans.reduce((counts, loan) => {
		const lastCount = counts[loan.biblioteks_id] || 0;
		return {...counts, [loan.biblioteks_id]: lastCount + 1};
	}, {})
}

function createWeightedMap(libraries, loanCounts) {
	return filter(map(libraries, lib => {
		return {
			location: new google.maps.LatLng(lib.latitude, lib.longitude),
			weight: loanCounts[lib.id] || 0
		};
	}), a => a.weight > 0);
}

const LIBRARIES = getLibraries();

function getLibraryLocation(libraries, id) {
	const lib = find(libraries, {id: id});
	return new google.maps.LatLng(lib.latitude, lib.longitude)
}

function createWeightedLocations(libraries, loanStats) {
	return compact(map(loanStats, (s) => {
		const lib = find(libraries, {id: s.biblioteks_id});
		if (!lib) return null;
		return {
			location: new google.maps.LatLng(lib.latitude, lib.longitude),
			weight: s.count
		};
	}))
}

var date = moment('2014-01-01');
window.init = function() {
	initMap();

	showHeatMapFor(date);
};

function showHeatMapFor(date) {
	return Promise.all([LIBRARIES, getLoanStats(date.format('YYYY-MM-DD'))])
		.then(([libraries, loanStats]) => {
			updateHeatmap(createWeightedLocations(libraries, loanStats));
		})
		.catch(err => console.error(err));
}


function registerNext() {
	setTimeout(() => {
		showHeatMapFor(date)
			.then(registerNext);

		date = date.add(1, 'day');
		document.getElementById('date').innerText = date.format("dddd, MMMM Do YYYY");
	}, 100);
}

/*
var otherDate = moment('2006-10-16');
for (var i = 0; i < 3000; i++) {
	getLoanStats(otherDate.format('YYYY-MM-DD'));
	otherDate = otherDate.add(1, 'day');
}
*/

window.animate = function() {
	registerNext();
};
