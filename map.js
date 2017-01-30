
// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

var map, heatmap, arr;

export function initMap() {
	arr = new google.maps.MVCArray([]);
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 7,
		center: { lat: 55.8325, lng: 10.5922 },
		mapTypeId: 'terrain'
	});
	heatmap = new google.maps.visualization.HeatmapLayer({
		data: arr,
		map: map
	});
	var radius = 1;
	heatmap.set('radius', radius);
	setInterval(() => heatmap.set('radius', radius++), 100);
}

export function updateHeatmap(points) {
	arr.clear();
	points.forEach((p) => {
		arr.push(p)
	})
}
