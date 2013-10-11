(function(){
  NMIS = {};
  var template_cache = {};
  var views = {};

  $(function(){
    new Backbone.Router({
      routes: {
        '': index,
        ':unique_lga/lga_overview': route(lga_overview),
        ':unique_lga/lga_health': route(lga_sector, 'health'),        
        ':unique_lga/lga_education': route(lga_sector, 'education'),
        ':unique_lga/lga_water': route(lga_sector, 'water'),
        ':unique_lga/facility_overview': route(facility_overview),
        ':unique_lga/facility_health': route(facility_sector, 'health'),
        ':unique_lga/facility_education': route(facility_sector, 'education'),  
        ':unique_lga/facility_water': route(facility_sector, 'water')
      }
    });
    Backbone.history.start();
  });
  

  // Views
  function _lga_nav(lga, active_view, sector){
    var template = $('#lga_nav_template').html();
    var html = _.template(template, {
      lga: lga,
      active_view: active_view,
      sector: sector
    });
    $('#lga_nav').html(html);
  }

  function index(){
    render('#index_template', {});
  }

  function lga_overview(lga){
    _lga_nav(lga, 'lga', 'overview');
    render('#lga_overview_template', {
      lga: lga
    });
    leaflet_overview(lga);
  }

  function lga_sector(lga, sector){
    _lga_nav(lga, 'lga', sector);
    render('#lga_sector_template', {
      lga: lga,
      sector: sector
    });
  }

  function facility_overview(lga){
    _lga_nav(lga, 'facility', sector);
    render('#facility_overview', {
      lga: lga
    });
  }

  function facility_sector(lga){
    _lga_nav(lga, 'facility', sector);
  }


  // Helper Functions
  function route(view, sector){
    return function(unique_lga){
      var lga = NMIS.lgas[unique_lga];
      if (typeof lga === 'undefined'){
        var url = '/data/new_data/lgas/' + unique_lga + '.json';
        $.getJSON(url, function(lga){
          NMIS.lgas[unique_lga] = lga;
          view(lga, sector);
        });
      } else {
        view(lga, sector);
      }
    }
  }

  function render(template_id, context){
    var template = $(template_id).html();
    context.NMIS = NMIS;
    context.format_value = format_value;
    var html = _.template(template, context);
    $('#content .content').html(html);
  }

  function format_value(value){
    if (typeof value === 'undefined') return '-';
    if (_.isNumber(value) && value % 1 !== 0)
      return value.toFixed(2);
    return value;
  }
})();


function leaflet_overview(lga){
  var map_div = $(".map")[0];
  var lat_lng = new L.LatLng(lga.latitude, lga.longitude);
  var map_zoom = 9;
  var summary_map = L.map(map_div, {})
      .setView(lat_lng, map_zoom);
  var tileset = "nigeria_base";
  var tile_server = "http://{s}.tiles.mapbox.com/v3/modilabs."
                    + tileset
                    + "/{z}/{x}/{y}.png";
  L.tileLayer(tile_server, {
    minZoom: 6,
    maxZoom: 11
  }).addTo(summary_map);
}

function leaflet_countryview(){
};

function leaflet_facility(){
};

