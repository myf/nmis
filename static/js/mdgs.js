$(function() {
    var map;
    var mapLegend, currentlyDisplayedIndicator;
    
    map = newMDGsMap();
    //tileLayers = {};
    var indicatorList = ['NMIS_gross_enrollment_ratio_secondary_education',
         'NMIS_percentage_households_with_access_to_improved_sanitation'];

    //initTileLayersFromIndicatorNames(indicatorList, map);
    
    // Creates a new MDGs map (with nothing but centering information)
    function newMDGsMap() {
        //ex: NMIS_gross_enrollment_ratio_secondary_education
        var centroid = {lat: 9.16718, lng: 7.53662};
        var mapZoom = 6;
        var sw = new L.LatLng(3.9738609758391017, 0.06591796875);
        var ne = new L.LatLng(14.28567730018259, 15.00732421875);
        var country_bounds = new L.LatLngBounds(sw, ne);
        var map = new L.Map('mdg-map', {maxBounds: country_bounds})
            .setView([centroid.lat, centroid.lng], mapZoom);
        //L.mapbox.tileLayer('modilabs.nigeria_base').addTo(map);
        //mapLegend = L.mapbox.legendControl().addTo(map);
        var tileset = "nigeria_base";
        var tileServer = "http://{s}.tiles.mapbox.com/v3/modilabs." +
           tileset + "/{z}/{x}/{y}.png"; 
        var baseLayer = new L.TileLayer(tileServer, {
            maxZoom: 11,
            minZoom: 6 
        });
        baseLayer.addTo(map);
        return map;
    }

    // Creates layer per indicatorName and  adds it to tileLayers object
    function initTileLayersFromIndicatorNames(indicatorNames, map) {
        _.each(indicatorNames, function(indicatorName) {
            var thisLayer = L.mapbox.tileLayer('modilabs.' + indicatorName);
            tileLayers[indicatorName] = thisLayer;
        });
    }

    // Change indicator layer
    var changeIndicator = function(indicatorName) {
        var justDisplayedIndicator = currentlyDisplayedIndicator;
        currentlyDisplayedIndicator = indicatorName;

        // justDisplayedIndicator doesn't exist on first change, no removals necessary
        if (justDisplayedIndicator) {
            map.removeLayer(tileLayers[justDisplayedIndicator]);
            mapLegend.removeLegend(
                tileLayers[justDisplayedIndicator].options.legend);
        }

        tileLayers[currentlyDisplayedIndicator].addTo(map);
        mapLegend.addLegend(
            tileLayers[currentlyDisplayedIndicator].options.legend);
    };



});