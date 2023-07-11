// Create globals so leaflet can load
global.window = {
  screen: {
    devicePixelRatio: 1,
  },
};
global.document = {
  documentElement: {
    style: {},
  },
  getElementsByTagName: function () {
    return [];
  },
  createElement: function () {
    return {};
  },
};
global.navigator = {
  userAgent: "nodejs",
  platform: "nodejs",
};
const L = require("leaflet");

module.exports = class Economy {
  static START_MONEY = 100000;
  static SQUARE_METER_PRICE = 50;
  static DAY_PROFIT_COEFFICIENT = 1; //Доход в день от стоимости недвижимости
  static SARATOV_CENTER = new L.LatLng(51.53328261694288, 46.0209184885025);

  static COST_DISTANCE_COEFFICIENT_FUNCTION = (distanceInMeters)=>{
    return 6 / (distanceInMeters/1000 + 5);
  };

  static getFacilityBounds = (facility) => {
    return new L.LatLngBounds(
      [facility.mapInfo.boundingbox[0], facility.mapInfo.boundingbox[2]],
      [facility.mapInfo.boundingbox[1], facility.mapInfo.boundingbox[3]]
    );
  };
  static calculateFacilityCost = (facility) => {
    const bounds = this.getFacilityBounds(facility);
    const square =
      bounds.getNorthWest().distanceTo(bounds.getNorthEast()) *
      bounds.getNorthWest().distanceTo(bounds.getSouthWest());
    const distanceToCenter = bounds.getCenter().distanceTo(this.SARATOV_CENTER);
    console.log(distanceToCenter);
    const cost = (square * this.SQUARE_METER_PRICE) * this.COST_DISTANCE_COEFFICIENT_FUNCTION(distanceToCenter);
    return Math.floor(cost);
  };
};
