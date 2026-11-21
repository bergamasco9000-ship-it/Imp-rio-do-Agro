cd "$(dirname "$0")"
python3 - <<'PY'
p2=open('p2.js').read().replace('DAYMS=4000','DAYMS=60000')
p3=open('p3.js').read().replace("if(S.day%5===0)save();","if(typeof hookDay==='function')hookDay();\n if(S.day%5===0)save();")
p5=open('p5.js').read()
p5=p5.replace("['goals','🎯 Metas']]","['reg','🏆 Região'],['inv','🎒 Inventário'],['lv','⭐ Nível'],['hunt','🏹 Caça'],['bolsa','📈 Bolsa'],['ct','📜 Contratos'],['fish','🎣 Pesca'],['goals','🎯 Metas'],['obras','🏗️ Obras'],['album','📒 Álbum'],['guia','📖 Guia']]").replace("fin:pFin,goals:pGoals}","fin:pFin,hunt:pHunt,bolsa:pBolsa,ct:pCt,fish:pFish,inv:pInv,lv:pLv,goals:pGoals,reg:pReg,guia:pGuia,album:pAlbum,obras:pObras}")
p6=open('p6.js').read()
lines=[l for l in p6.split('\n') if not l.startswith('function showModal') and not l.startswith('function hideModal')]
p6='\n'.join(lines);p6=p6[:p6.index("document.addEventListener('click'")]
F=lambda n:open(n).read()
out=F('w1.html')+p2+F('h_data.js')+F('g_data.js')+p3+F('w_help.js')+p5+p6+F('w_world.js')+F('g_farm.js')+F('g_crime.js')+F('g_npc.js')+F('w_hunt.js')+F('w_ui.js')+F('g_ui2.js')+F('g_wild2.js')+F('g_bolsa.js')+F('g_life.js')+F('g_hero.js')+F('g_world2.js')+F('g_dogs.js')+F('g_biome.js')+F('g_meta.js')+F('g_secret.js')+F('g_tut2.js')+F('g_art.js')+F('g_ranch.js')+F('g_fest0.js')+F('g_rooms.js')+F('g_build.js')+F('g_look.js')+F('g_fix.js')+F('g_season.js')+F('g_legend.js')+F('g_rival.js')+F('g_festa.js')+F('g_pc.js')+F('g_cow.js')+F('g_thief.js')+F('g_bld2.js')+F('g_life2.js')+F('g_veh.js')+F('g_hunt2.js')+F('g_horse2.js')+F('g_agro.js')+F('g_econ.js')+F('g_people.js')+F('g_guns.js')+F('g_invest.js')+F('g_emp.js')+F('g_emp2.js')+F('g_size.js')+F('g_wildart.js')+F('g_beasts.js')+F('g_cabin.js')+F('g_onca.js')+F('g_dogs3.js')+F('g_grab.js')+F('g_map.js')+F('g_detail.js')+F('g_vila.js')+F('g_more.js')+F('g_lux.js')+F('g_lux2.js')+F('g_watch.js')+F('g_mall.js')+F('g_breed.js')+F('g_imp.js')+F('g_recinto.js')+F('g_rvlife.js')+F('g_cars.js')+F('g_bull.js')+F('g_tut3.js')+F('g_tips.js')+F('g_fix2.js')+F('g_bar2.js')+F('g_bar3.js')+F('g_pistols.js')+F('g_fix3.js')+F('g_title.js')+F('g_title2.js')+F('g_audio.js')+F('g_save.js')+F('g_celular.js')+F('g_leilao.js')+F('g_expo.js')+F('g_gerente.js')+F('g_pick.js')+F('g_fix4.js')+F('g_dogs4.js')+F('g_civic.js')+F('g_armazem.js')+F('g_obrafix.js')+F('g_mate2.js')+F('g_bal.js')+F('g_horse3.js')+F('g_lendas.js')+F('g_avisos.js')+F('g_dogeq.js')+F('g_app.js')+F('w_end.js')
open('world.html','w').write(out)
open('world.js','w').write(out.split('<script>\n',1)[1].rsplit('</script>',1)[0])
PY
node --check world.js && echo SYNTAX_OK
