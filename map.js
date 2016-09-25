
// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

var map, heatmap, arr;

export function initMap(points) {
	arr = new google.maps.MVCArray(points);
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 7,
		center: { lat: 55.8325, lng: 10.5922 },
		mapTypeId: 'terrain'
	});
	heatmap = new google.maps.visualization.HeatmapLayer({
		data: arr,
		map: map
	});
	var radius = 15;
	heatmap.set('radius', radius);
}

export function updateHeatmap(points) {
	arr.clear();
	points.forEach((p) => {
		arr.push(p)
	})
}
