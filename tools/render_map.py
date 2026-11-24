import pathlib,base64,cairosvg
R=pathlib.Path(__file__).resolve().parents[1];A=R/'app/assets';O=R/'production';O.mkdir(exist_ok=True)
s=(A/'atlas-master.svg').read_text().replace('href="ocean-texture.png"','href="data:image/png;base64,'+base64.b64encode((A/'ocean-texture.png').read_bytes()).decode()+'"')
(O/'Continuous_Atlas_Master.svg').write_text(s)
cairosvg.svg2png(bytestring=s.encode(),write_to=str(O/'Continuous_Atlas_Master.png'),output_width=4096)
print('Exported continuous raster + standalone SVG')
