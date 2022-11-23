import { CMBlockMarkerHelper } from "../../../utils/CMBlockMarkerHelper";
var L = require('leaflet');
import { LineHandle } from "codemirror";

const ENHANCEMENT_LEAFLET_SPAN_MARKER_CLASS = 'enhancement-leaflet-block-marker';
const ENHANCEMENT_LEAFLET_SPAN_MARKER_LINE_CLASS = 'enhancement-leaflet-block-marker-line';

// Initialise the leaflet API. Note the "as any" cast, since the leaflet types
// are wrong.
// leaflet.initialize({ startOnLoad: false })

export default function leafletRender(cm) {
    console.log("Attempting leafletRender")
    new CMBlockMarkerHelper(cm, null, /^\s*```leaflet\s*$/, /^\s*```\s*$/, (beginMatch, endMatch, content, fromLine, toLine) => {
        // code from zettlr
        let container = document.createElement('div')
        let map_div = document.createElement('div')
        map_div.setAttribute('id', "map")
        container.classList.add('leaflet-chart')

        try {
            // Initialize the map
            var map = L.map(map_div, {
                scrollWheelZoom: false
            });

            // Set the position and zoom level of the map
            map.setView([52.683559, -1.822360], 7);

            // Initialize the base layer
            var osm_mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            container.appendChild(map_div)
            // container.innerHTML = JSON.stringify(L)// leaflet.render(`graphDivL${fromLine}-L${toLine}${Date.now()}`, content)
        } catch (err: any) {
            container.classList.add('error')
            // TODO: Localise!
            container.innerText = `Could not render map:\n\n${err.message as string}`
        }
        return container;
    }, () => {
        const span = document.createElement('span');
        span.textContent = '===> Folded Leaflet Code Block <===';
        span.style.cssText = 'color: lightgray; font-size: smaller; font-style: italic;';
        return span;
    }, ENHANCEMENT_LEAFLET_SPAN_MARKER_CLASS, true);

    cm.on('renderLine', (editor, line: LineHandle, element: Element) => {
        if (element.getElementsByClassName(ENHANCEMENT_LEAFLET_SPAN_MARKER_CLASS).length > 0) {
            element.classList.add(ENHANCEMENT_LEAFLET_SPAN_MARKER_LINE_CLASS);
        }
    })
}
