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
    fetch("/static/media/mikroquartiere_with_predictions.db193fc3.geojson")
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
        version: "v1",
        config: {
          visState: {
            filters: [],
            layers: [
              {
                type: "geojson",
                config: {
                  dataId: "mikroquartiere",
                  label: "True MQ Type",
                  color: [18, 147, 154],
                  highlightColor: [252, 242, 26, 255],
                  columns: { geojson: "geometry" },
                  isVisible: true,
                  visConfig: {
                    opacity: 1,
                    strokeOpacity: 0.8,
                    thickness: 0.5,
                    strokeColor: [221, 178, 124],
                    colorDomain: actual_domain,
                    colorRange: {
                      name: "Custom Palette",
                      type: "custom",
                      category: "Custom",
                      colors: actual_colors,
                    },
                    stroked: false,
                    filled: true,
                  },
                  hidden: false,
                  textLabel: [
                    {
                      field: null,
                      color: [255, 255, 255],
                      size: 18,
                      offset: [0, 0],
                      anchor: "start",
                      alignment: "center",
                      outlineWidth: 0,
                      outlineColor: [255, 0, 0, 255],
                      background: false,
                      backgroundColor: [0, 0, 200, 255],
                    },
                  ],
                },
                visualChannels: {
                  colorField: { name: "RN_NUTZUNG_LEVEL3", type: "string" },
                  colorScale: "ordinal",
                  strokeColorField: null,
                  strokeColorScale: "quantile",
                  sizeField: null,
                  sizeScale: "linear",
                  heightField: null,
                  heightScale: "linear",
                  radiusField: null,
                  radiusScale: "linear",
                },
              },
              {
                type: "geojson",
                config: {
                  dataId: "mikroquartiere",
                  label: "CNN Predicted MQ Type",
                  color: [18, 147, 154],
                  highlightColor: [252, 242, 26, 255],
                  columns: { geojson: "geometry" },
                  isVisible: true,
                  visConfig: {
                    opacity: 1,
                    strokeOpacity: 0.8,
                    thickness: 0.5,
                    strokeColor: [221, 178, 124],
                    colorDomain: predicted_domain,
                    colorRange: {
                      name: "Custom Palette",
                      type: "custom",
                      category: "Custom",
                      colors: predicted_colors,
                    },
                    stroked: false,
                    filled: true,
                  },
                  hidden: false,
                  textLabel: [
                    {
                      field: null,
                      color: [255, 255, 255],
                      size: 18,
                      offset: [0, 0],
                      anchor: "start",
                      alignment: "center",
                      outlineWidth: 0,
                      outlineColor: [255, 0, 0, 255],
                      background: false,
                      backgroundColor: [0, 0, 200, 255],
                    },
                  ],
                },
                visualChannels: {
                  colorField: { name: "predicted_class", type: "string" },
                  colorScale: "ordinal",
                  strokeColorField: null,
                  strokeColorScale: "quantile",
                  sizeField: null,
                  sizeScale: "linear",
                  heightField: null,
                  heightScale: "linear",
                  radiusField: null,
                  radiusScale: "linear",
                },
              },
              {
                type: "geojson",
                config: {
                  dataId: "mikroquartiere",
                  label: "Matching Prediction",
                  color: [18, 147, 154],
                  highlightColor: [252, 242, 26, 255],
                  columns: { geojson: "geometry" },
                  isVisible: true,
                  visConfig: {
                    opacity: 1,
                    strokeOpacity: 0.8,
                    thickness: 0.5,
                    strokeColor: [221, 178, 124],
                    colorDomain: ["true", "false"],
                    colorRange: {
                      name: "Custom Palette",
                      type: "custom",
                      category: "Custom",
                      colors: ["#FF3333", "#00CC00"],
                    },
                    stroked: false,
                    filled: true,
                  },
                  hidden: false,
                  textLabel: [
                    {
                      field: null,
                      color: [255, 255, 255],
                      size: 18,
                      offset: [0, 0],
                      anchor: "start",
                      alignment: "center",
                      outlineWidth: 0,
                      outlineColor: [255, 0, 0, 255],
                      background: false,
                      backgroundColor: [0, 0, 200, 255],
                    },
                  ],
                },
                visualChannels: {
                  colorField: { name: "correct_prediction", type: "string" },
                  colorScale: "ordinal",
                  strokeColorField: null,
                  strokeColorScale: "quantile",
                  sizeField: null,
                  sizeScale: "linear",
                  heightField: null,
                  heightScale: "linear",
                  radiusField: null,
                  radiusScale: "linear",
                },
              },
            ],
            interactionConfig: {
              tooltip: {
                fieldsToShow: {
                  mikroquartiere: [
                    { name: "RN_NUTZUNG_LEVEL3", format: null },
                    { name: "predicted_class", format: null },
                    { name: "correct_prediction", format: null },
                  ],
                },
                compareMode: false,
                compareType: "absolute",
                enabled: true,
              },
            },
            layerBlending: "normal",
            splitMaps: [],
            animationConfig: { currentTime: null, speed: 1 },
          },
          mapStyle: {
            styleType: "dark-matter",
            topLayerGroups: {},
            visibleLayerGroups: {
              label: true,
              road: true,
              border: false,
              building: true,
              water: true,
              land: true,
              "3d building": false,
            },
            threeDBuildingColor: [15.035172933000911, 15.035172933000911, 15.035172933000911],
            backgroundColor: [0, 0, 0],
            mapStyles: {},
          },
        },
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
