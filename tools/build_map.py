"""Build a single coordinate-aligned SVG atlas and a small region dataset.
Run from kit root: python tools/build_map.py /path/to/geo_source
Requires shapely. Raster exports: python tools/render_map.py.
"""
import json, math, sys, pathlib, html
from shapely.geometry import shape, box, mapping
from shapely.ops import unary_union
ROOT=pathlib.Path(__file__).resolve().parents[1]; OUT=ROOT/'app/assets'
SRC=pathlib.Path(sys.argv[1]); W=3200
west,east,south,north=-20,20,-3,50
merc=lambda lat: math.degrees(math.log(math.tan(math.pi/4+math.radians(lat)/2)))
H=round(W*(merc(north)-merc(south))/(east-west))
def xy(lon,lat):return [(lon-west)*W/(east-west),(merc(north)-merc(lat))*W/(east-west)]
def path(g):
 if g.is_empty:return ''
 polys=[g] if g.geom_type=='Polygon' else list(g.geoms)
 out=[]
 for p in polys:
  if p.geom_type!='Polygon':continue
  for ring in [p.exterior,*p.interiors]:
   pts=[xy(*c[:2]) for c in ring.coords]
   out.append('M'+'L'.join(f'{x:.2f},{y:.2f}' for x,y in pts)+'Z')
 return ''.join(out)
# Extend drawing beyond the portrait export viewport so wide/mobile camera
# views never reveal a false rectangular coastline. Export remains one atlas.
clip=box(-70,-60,85,75)
bgx,bgy=xy(-70,75); bgz,bgb=xy(85,-60)
bgw,bgh=bgz-bgx,bgb-bgy
countries=json.load(open(SRC/'countries.geojson'))['features']
admin=json.load(open(SRC/'admin1.geojson'))['features']
selected=[f for f in admin if f['properties']['adm0_a3'] in ['ESP','NGA']]
groups={}
for f in selected:
 p=f['properties'];key=(p['adm0_a3'],p['region'] if p['adm0_a3']=='ESP' else p['name'])
 groups.setdefault(key,[]).append(shape(f['geometry']))
regions=[]
for (country,name),gg in groups.items():
 geom=unary_union(gg).simplify(.002,preserve_topology=True)
 regions.append({'country':country,'name':name,'path':path(geom),'geometry':mapping(geom)})
(OUT/'regions.json').write_text(json.dumps(regions,ensure_ascii=False,separators=(',',':')))
land=[];countries_meta=[]
for f in countries:
 g=shape(f['geometry'])
 if not g.intersects(clip):continue
 p=f['properties'];name=p['NAME_EN']; d=path(g.intersection(clip).simplify(.007,preserve_topology=True))
 land.append(f'<path d="{d}"/>');countries_meta.append({'name':name,'path':d})
landpaths=''.join(land)
labels=[('Spain',-3.7,40.8),('Portugal',-8,39.6),('France',2.2,46.5),('Morocco',-6.5,31.6),('Algeria',2,28),('Niger',8.3,17.5),('Nigeria',8,10.3),('Benin',2.3,9.7),('Cameroon',12.5,6.6),('Chad',18,15),('Mali',-3,17.5),('Mauritania',-11,21),('Senegal',-14.3,14.8),('Ghana',-1.2,7.6),('Gulf of Guinea',1,1),('Atlantic Ocean',-18,25)]
texts=''.join(f'<text x="{xy(lon,lat)[0]:.2f}" y="{xy(lon,lat)[1]:.2f}">{html.escape(name)}</text>' for name,lon,lat in labels)
adminpaths=''.join(f'<path d="{r["path"]}"/>' for r in regions)
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs><pattern id="grain" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="3" cy="9" r=".55" fill="#8b7757" opacity=".12"/><circle cx="18" cy="20" r=".4" fill="#fff" opacity=".3"/></pattern></defs>
<rect x="{bgx}" y="{bgy}" width="{bgw}" height="{bgh}" fill="#a6dfeb"/>
<image href="ocean-texture.png" x="{bgx}" y="{bgy}" width="{bgw}" height="{bgh}" preserveAspectRatio="none"/>
<g fill="none" stroke="#70bdd1" stroke-width="17" stroke-opacity=".18">{landpaths}</g>
<g fill="#e9dfc7" stroke="#8b897c" stroke-width="1.6" fill-rule="evenodd">{landpaths}</g>
<g fill="url(#grain)" stroke="none" fill-rule="evenodd">{landpaths}</g>
<g fill="none" stroke="#aaa18c" stroke-width=".7" stroke-opacity=".8">{adminpaths}</g>
<g fill="#374640" font-family="Manrope,Arial,sans-serif" font-size="20" text-anchor="middle" letter-spacing="1.2">{texts}</g>
</svg>'''
(OUT/'atlas-master.svg').write_text(svg)
(OUT/'map-config.json').write_text(json.dumps({'width':W,'height':H,'bounds':[west,south,east,north],'projection':'Web Mercator, north up','labels':labels,'countries':countries_meta},ensure_ascii=False))
# Reproducible source subset; no need to bundle entire world admin1 file.
(OUT/'source-regions.geojson').write_text(json.dumps({'type':'FeatureCollection','features':[{'type':'Feature','properties':{'country':r['country'],'name':r['name']},'geometry':r['geometry']} for r in regions]},ensure_ascii=False))
print('Built',W,H,'regions',len(regions))
