import React, { useEffect, useState } from "react";
import KeplerGl from "kepler.gl";
import { addDataToMap } from "kepler.gl/actions";
import { useDispatch } from "react-redux";
// import helpers from "./helpers";

const label_color_mapping = {
  "Acker": "##e6ffe6",
  "Bahnhöfe und Bahnanlagen": "#660000",
  "Bildung": "#E1B1CC",
  "Büro- und Verwaltungsviertel": "#005ce6",
  "Energieversorgung u. Rundfunkanlagen": "#ffff00",
  "Friedhof": "#4d4d4d",
  "Geschäfts-, Kern- u. Mischgebiete": "#0000ff",
  "Gesundheit und Einsatzorg.": "#C85060",
  "Gewässer inkl. Bachbett": "#00ccff",
  "Gärtnerei, Obstplantagen": "#ffff99",
  "Industrie, prod. Gewerbe, Großhandel inkl. Lager": "#ffaa00",
  "Kläranlage, Deponie": "#4d3300",
  "Kultur, Freizeit, Messe": "#00b38f",
  "Militärische Anlagen": "#ff6699",
  "Mischnutzung wenig dicht": "#80ff80",
  "Park, Grünanlage": "#003300",
  "Parkplätze u. Parkhäuser": "#bfbfbf",
  "Sport und Bad (Indoor)": "#6666ff",
  "Sport und Bad (Outdoor), Camping": "#9999ff",
  "Straßenraum begrünt": "#264d00",
  "Straßenraum unbegrünt": "#333300",
  "Transformationsfläche, Baustelle, Materialgew.": "#ff7733",
  "Transport und Logistik inkl. Lager": "#7A7A7A",
  "Wald": "#2E5D31",
  "Wasserversorgung": "#9999ff",
  "Weingarten": "#6600cc",
  "Wiese": "#B1C877",
  "Wohn(misch)gebiet mittlerer Dichte": "#00ff00",
  "dichtes Wohn(misch)gebiet": "#008000",
  "großvolumiger, solitärer Wohn(misch)bau": "#3E8C50",
  "locker bebautes Wohn(misch)gebiet": "#80ff80",
  "solitäre Handelsstrukturen": "#001a66",
};

function Map() {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/mikroquartiere_with_predictions.geojson")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.error("Error fetching the GeoJSON data:", error);
      });
  }, []);

  useEffect(() => {
    if (data) {
      console.log(data);
      const actual_categories = [...new Set(data.features.map(feature => feature.properties.RN_NUTZUNG_LEVEL3))].sort();
      const predicted_categories = [...new Set(data.features.map(feature => feature.properties.predicted_class))].sort();

      const predicted_domain = Object.keys(label_color_mapping).filter(cat => predicted_categories.includes(cat));
      const predicted_colors = predicted_domain.map(cat => label_color_mapping[cat]);

      const actual_domain = Object.keys(label_color_mapping).filter(cat => actual_categories.includes(cat));
      const actual_colors = actual_domain.map(cat => label_color_mapping[cat]);

      const config = {
        "version": "v1",
        "config": {
          "visState": {
            "filters": [],
            "layers": [
              {
                "id": "y4ax1ul",
                "type": "geojson",
                "config": {
                  "dataId": "map",
                  "columnMode": "geojson",
                  "label": "Prediction Correct",
                  "color": [
                    248,
                    149,
                    112
                  ],
                  "highlightColor": [
                    252,
                    242,
                    26,
                    255
                  ],
                  "columns": {
                    "geojson": "_geojson"
                  },
                  "isVisible": false,
                  "visConfig": {
                    "opacity": 0.8,
                    "strokeOpacity": 0.8,
                    "thickness": 0.5,
                    "strokeColor": [
                      130,
                      154,
                      227
                    ],
                    "colorRange": {
                      "colors": [
                        "#FF4040",
                        "#A7D503",
                        "#18F472",
                        "#1872F4",
                        "#A703D5",
                        "#FF4040"
                      ],
                      "name": "Sinebow",
                      "type": "cyclical",
                      "category": "D3"
                    },
                    "strokeColorRange": {
                      "name": "Global Warming",
                      "type": "sequential",
                      "category": "Uber",
                      "colors": [
                        "#4C0035",
                        "#880030",
                        "#B72F15",
                        "#D6610A",
                        "#EF9100",
                        "#FFC300"
                      ]
                    },
                    "radius": 10,
                    "sizeRange": [
                      0,
                      10
                    ],
                    "radiusRange": [
                      0,
                      50
                    ],
                    "heightRange": [
                      0,
                      500
                    ],
                    "elevationScale": 5,
                    "stroked": false,
                    "filled": true,
                    "enable3d": false,
                    "wireframe": false,
                    "fixedHeight": false
                  },
                  "hidden": false,
                  "textLabel": [
                    {
                      "field": null,
                      "color": [
                        255,
                        255,
                        255
                      ],
                      "size": 18,
                      "offset": [
                        0,
                        0
                      ],
                      "anchor": "start",
                      "alignment": "center",
                      "outlineWidth": 0,
                      "outlineColor": [
                        255,
                        0,
                        0,
                        255
                      ],
                      "background": false,
                      "backgroundColor": [
                        0,
                        0,
                        200,
                        255
                      ]
                    }
                  ]
                },
                "visualChannels": {
                  "colorField": {
                    "name": "correct_prediction",
                    "type": "boolean"
                  },
                  "colorScale": "ordinal",
                  "strokeColorField": null,
                  "strokeColorScale": "quantile",
                  "sizeField": null,
                  "sizeScale": "linear",
                  "heightField": null,
                  "heightScale": "linear",
                  "radiusField": null,
                  "radiusScale": "linear"
                }
              },
              {
                "id": "pzibfev",
                "type": "geojson",
                "config": {
                  "dataId": "map",
                  "columnMode": "geojson",
                  "label": "Predicted Class",
                  "color": [
                    136,
                    87,
                    44
                  ],
                  "highlightColor": [
                    252,
                    242,
                    26,
                    255
                  ],
                  "columns": {
                    "geojson": "_geojson"
                  },
                  "isVisible": true,
                  "visConfig": {
                    "opacity": 0.8,
                    "strokeOpacity": 0.8,
                    "thickness": 0.5,
                    "strokeColor": [
                      255,
                      153,
                      31
                    ],
                    "colorRange": {
                      "colors": [
                        "#12939A",
                        "#DDB27C",
                        "#88572C",
                        "#FF991F",
                        "#F15C17",
                        "#223F9A",
                        "#DA70BF",
                        "#125C77",
                        "#4DC19C",
                        "#776E57",
                        "#17B8BE",
                        "#F6D18A",
                        "#B7885E",
                        "#FFCB99",
                        "#F89570",
                        "#829AE3",
                        "#E79FD5",
                        "#1E96BE",
                        "#89DAC1",
                        "#B3AD9E"
                      ],
                      "name": "Uber Viz Qualitative",
                      "type": "qualitative",
                      "category": "Uber"
                    },
                    "strokeColorRange": {
                      "name": "Global Warming",
                      "type": "sequential",
                      "category": "Uber",
                      "colors": [
                        "#4C0035",
                        "#880030",
                        "#B72F15",
                        "#D6610A",
                        "#EF9100",
                        "#FFC300"
                      ]
                    },
                    "radius": 10,
                    "sizeRange": [
                      0,
                      10
                    ],
                    "radiusRange": [
                      0,
                      50
                    ],
                    "heightRange": [
                      0,
                      500
                    ],
                    "elevationScale": 5,
                    "stroked": false,
                    "filled": true,
                    "enable3d": false,
                    "wireframe": false,
                    "fixedHeight": false
                  },
                  "hidden": false,
                  "textLabel": [
                    {
                      "field": null,
                      "color": [
                        255,
                        255,
                        255
                      ],
                      "size": 18,
                      "offset": [
                        0,
                        0
                      ],
                      "anchor": "start",
                      "alignment": "center",
                      "outlineWidth": 0,
                      "outlineColor": [
                        255,
                        0,
                        0,
                        255
                      ],
                      "background": false,
                      "backgroundColor": [
                        0,
                        0,
                        200,
                        255
                      ]
                    }
                  ]
                },
                "visualChannels": {
                  "colorField": {
                    "name": "predicted_class",
                    "type": "string"
                  },
                  "colorScale": "ordinal",
                  "strokeColorField": null,
                  "strokeColorScale": "quantile",
                  "sizeField": null,
                  "sizeScale": "linear",
                  "heightField": null,
                  "heightScale": "linear",
                  "radiusField": null,
                  "radiusScale": "linear"
                }
              },
              {
                "id": "n50z4kp",
                "type": "geojson",
                "config": {
                  "dataId": "map",
                  "columnMode": "geojson",
                  "label": "Ground Truth",
                  "color": [
                    137,
                    218,
                    193
                  ],
                  "highlightColor": [
                    252,
                    242,
                    26,
                    255
                  ],
                  "columns": {
                    "geojson": "_geojson"
                  },
                  "isVisible": true,
                  "visConfig": {
                    "opacity": 0.8,
                    "strokeOpacity": 0.8,
                    "thickness": 0.5,
                    "strokeColor": [
                      179,
                      173,
                      158
                    ],
                    "colorRange": {
                      "colors": [
                        "#12939A",
                        "#DDB27C",
                        "#88572C",
                        "#FF991F",
                        "#F15C17",
                        "#223F9A",
                        "#DA70BF",
                        "#125C77",
                        "#4DC19C",
                        "#776E57",
                        "#17B8BE",
                        "#F6D18A",
                        "#B7885E",
                        "#FFCB99",
                        "#F89570",
                        "#829AE3",
                        "#E79FD5",
                        "#1E96BE",
                        "#89DAC1",
                        "#B3AD9E"
                      ],
                      "name": "Uber Viz Qualitative",
                      "type": "qualitative",
                      "category": "Uber"
                    },
                    "strokeColorRange": {
                      "name": "Global Warming",
                      "type": "sequential",
                      "category": "Uber",
                      "colors": [
                        "#4C0035",
                        "#880030",
                        "#B72F15",
                        "#D6610A",
                        "#EF9100",
                        "#FFC300"
                      ]
                    },
                    "radius": 10,
                    "sizeRange": [
                      0,
                      10
                    ],
                    "radiusRange": [
                      0,
                      50
                    ],
                    "heightRange": [
                      0,
                      500
                    ],
                    "elevationScale": 5,
                    "stroked": false,
                    "filled": true,
                    "enable3d": false,
                    "wireframe": false,
                    "fixedHeight": false
                  },
                  "hidden": false,
                  "textLabel": [
                    {
                      "field": null,
                      "color": [
                        255,
                        255,
                        255
                      ],
                      "size": 18,
                      "offset": [
                        0,
                        0
                      ],
                      "anchor": "start",
                      "alignment": "center",
                      "outlineWidth": 0,
                      "outlineColor": [
                        255,
                        0,
                        0,
                        255
                      ],
                      "background": false,
                      "backgroundColor": [
                        0,
                        0,
                        200,
                        255
                      ]
                    }
                  ]
                },
                "visualChannels": {
                  "colorField": {
                    "name": "RN_NUTZUNG_LEVEL3",
                    "type": "string"
                  },
                  "colorScale": "ordinal",
                  "strokeColorField": null,
                  "strokeColorScale": "quantile",
                  "sizeField": null,
                  "sizeScale": "linear",
                  "heightField": null,
                  "heightScale": "linear",
                  "radiusField": null,
                  "radiusScale": "linear"
                }
              }
            ],
            "effects": [],
            "interactionConfig": {
              "tooltip": {
                "fieldsToShow": {
                  "mqka9f": [
                    {
                      "name": "fid",
                      "format": null
                    },
                    {
                      "name": "FMZK_ID",
                      "format": null
                    },
                    {
                      "name": "F_KLASSE",
                      "format": null
                    },
                    {
                      "name": "LM",
                      "format": null
                    },
                    {
                      "name": "LAYER",
                      "format": null
                    }
                  ]
                },
                "compareMode": false,
                "compareType": "absolute",
                "enabled": true
              },
              "brush": {
                "size": 0.5,
                "enabled": false
              },
              "geocoder": {
                "enabled": false
              },
              "coordinate": {
                "enabled": false
              }
            },
            "layerBlending": "normal",
            "overlayBlending": "normal",
            "splitMaps": [],
            "animationConfig": {
              "currentTime": null,
              "speed": 1
            },
            "editor": {
              "features": [],
              "visible": true
            }
          },
          "mapState": {
            "bearing": 0,
            "dragRotate": false,
            "latitude": 48.221004531737066,
            "longitude": 16.391442490706943,
            "pitch": 0,
            "zoom": 14.288353501501714,
            "isSplit": false,
            "isViewportSynced": true,
            "isZoomLocked": false,
            "splitMapViewports": []
          },
          "mapStyle": {
            "styleType": "dark-matter",
            "topLayerGroups": {},
            "visibleLayerGroups": {
              "label": true,
              "road": true,
              "border": false,
              "building": true,
              "water": true,
              "land": true,
              "3d building": false
            },
            "threeDBuildingColor": [
              15.035172933000911,
              15.035172933000911,
              15.035172933000911
            ],
            "backgroundColor": [
              0,
              0,
              0
            ],
            "mapStyles": {}
          },
          "uiState": {
            "mapControls": {
              "mapLegend": {
                "active": true
              }
            }
          }
        }
      };

      dispatch(
        addDataToMap({
          datasets: {
            info: {
              label: "Mikroquartiere with Predictions",
              id: "mikroquartiere",
            },
            data: data,
          },
          option: {
            centerMap: true,
            readOnly: false,
          },
          config,
        })
      );
    }
  }, [dispatch, data]);

  return (
    <KeplerGl
      id="map"
      width={window.innerWidth}
      height={window.innerHeight}
      mapboxApiAccessToken="pk.eyJ1IjoiaWYyM2IyODgiLCJhIjoiY204cWFjbW9mMGhxdzJxc2F3dXV2cWJ1YiJ9.0imHMsmwBLj6Sf-jIshJ_A"
    />

  );
}

export default Map;
