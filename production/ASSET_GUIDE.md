# Assets and continuous-map handoff

## Use raster and vector together

`Continuous_Atlas_Master.png` is one 4096 × 6237 long image, not a collage of country screenshots. `Continuous_Atlas_Master.svg` is the same map with the ocean raster embedded. Map bounds are west −20, south −3, east 20, north 50, with a north-up Mercator projection. The SVG additionally contains surrounding geography outside its export viewport, so a live camera can view wider land without inventing a rectangular coastline.

Use `app/assets/atlas-master.svg` in the running app and keep `ocean-texture.png` beside it. The runtime reads the SVG once, then animates its viewBox. Geography is never regenerated between stages. `map-config.json` contains projection bounds; `regions.json` contains matching paths; `source-regions.geojson` preserves region geometry. Spain and Nigeria remain at their actual relative locations. The PNG is a static export; do not use it as a different background for every page.

| Asset | Rendering | Purpose |
|---|---|---|
| Atlas countries/regions | SVG vectors | Accurate relative position and clean zoom |
| Sea texture | Generated raster | Decorative water detail, not map data |
| Portrait sprite | Generated raster | Three consistent fictional faces |
| Hotspots, guide globe, waveforms | HTML/SVG/CSS | Interactive movement and sharp scaling |
| UI labels/options | Real HTML text + local fonts | Legible hierarchy, selection and accessibility |
| Approved reference board | Raster image | Composition guide only, not geographic authority |

## Rebuild

Download the Natural Earth GeoJSON sources listed in ATTRIBUTION.md into a folder with names `countries.geojson` and `admin1.geojson`. Install Python packages `shapely` and `cairosvg`. From kit root:

```sh
python tools/build_map.py /absolute/path/to/geo_source
python tools/render_map.py
```

Spain's 10m provinces are dissolved by autonomous-community name; Nigeria has 36 states plus FCT. Country outlines are 50m generalisation, while region paths are 10m: minor coastal differences are expected. This is an educational overview, not survey-grade geography. Do not manually redraw Spain or Nigeria from the generated board. Original user-supplied EPS files are retained as references, not required for playback.

## Audio and optional media

Generate the 106 exact MP3 filenames listed in ALL_AUDIO_SCRIPTS.md. No audio files have been generated or charged for. Optional quiet ambience should be separate, fully ducked while any voice plays, and obey Sound. No music is required for the included preview. No video file is required: the camera, portrait reveal, waveform and guide animate in code.

The 14 page screenshots are views of one app and should not be turned into full-screen baked UI images. Source text should remain selectable HTML. A long contact sheet is included for reviewing flow; the continuous atlas PNG is the actual reusable master.
