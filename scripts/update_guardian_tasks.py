"""Synchronize the approved guardian-art iteration and its local dashboard mirror."""
from pathlib import Path
import json
import sys

root = Path(__file__).resolve().parents[1]
data = json.loads((root / 'tasks.json').read_text(encoding='utf-8-sig'))
tasks = {task['id']: task for task in data['tasks']}
updates = {
    'TASK-006': dict(title='Histórico: primeira arte dos três protetores', description='Primeiro conjunto visual preservado como histórico. Substituído pelos nove guardiões épicos da TASK-025.'),
    'TASK-007': dict(title='Histórico: primeira arte das criaturas e chefe', description='Primeiro conjunto de inimigos preservado como histórico. A rodada épica da TASK-025 entrega quatro criaturas e duas fases do Colosso do Eclipse.'),
    'TASK-014': dict(description='Comportamentos do Prisma Solar, Véu de Aurora e Núcleo de Brasa com projéteis, dano em área e lentidão.'),
    'TASK-016': dict(title='Colosso do Eclipse e cena final', description='Batalha do chefe em duas fases, invocação de larvas e purificação. Arte atual integrada na TASK-024.'),
    'TASK-021': dict(title='Direção de arte: Santuário e guardiões épicos', description='Direção atual de humanoides fantásticos sólidos, sem referências religiosas; geração seguida de integração autorizada por Bruno.', indicators=['Armaduras inventadas e três famílias com silhuetas próprias', 'Narrativa, PRD e direção sincronizados', 'Escopo desta rodada: 18 imagens novas, 3 retratos e 5 camadas reutilizadas']),
    'TASK-022': dict(title='Primeira prova visual — histórico encerrado', description='Oito ativos iniciais preservados. Bruno pediu corpos sólidos; os protetores abstratos foram substituídos nesta rodada. Ambiente reaproveitado com pendência de resolução registrada separadamente.', status='done', audit_confirmed=True, indicators=['Fontes e prompts históricos preservados', 'Caminho de 34 células e alfa verificados', 'Revisão solicitada por Bruno incorporada; não equivale a aprovação estética final']),
    'TASK-023': dict(title='Expansão opcional: ícones e efeitos ilustrados', description='Itens restantes do catálogo anterior ficam fora da rodada atual. Não bloqueiam o teste local dos guardiões épicos.', indicators=['Escopo e autorização de nova rodada definidos', 'Ícones, efeitos e materiais adicionais produzidos sob a direção atual']),
    'TASK-024': dict(title='Integrar guardiões épicos na partida', description='18 sprites, retratos, ambiente e caminho integrados por autorização direta. IDs e valores de balanceamento preservados.', status='done', audit_confirmed=True, indicators=['Nove níveis e quatro inimigos usam texturas próprias', 'Chefe muda de imagem na fase 2; vitória usa espírito purificado', 'Rota, proporções, sombras e textos públicos atualizados', 'Build aprovado e regras numéricas iguais ao HEAD']),
}
for key, values in updates.items():
    tasks[key].update(values)
    if values.get('status') == 'done': tasks[key]['completed_at'] = '2026-10-08'

new_tasks = [
    dict(id='TASK-025', title='Gerar 18 sprites épicos e 3 retratos', description='Guardiões N1/N2/N3, quatro criaturas, duas fases do chefe, purificado, fenda e núcleo. Fontes, prompts, dimensões, alfa e ancoragens registrados.', status='done', milestone='m2_design_arte', tier='tier2_fast', indicators=['18 PNGs com alfa real e cantos transparentes', 'Protetores e evoluções mantêm identidade e escala', '512×512; chefe 1024×1024; retratos derivados', 'Manifesto e folhas de comparação preservados'], audit_confirmed=True, created_at='2026-10-08', completed_at='2026-10-08'),
    dict(id='TASK-026', title='QA do jogo local e auditoria da nova arte', description='Build, balanceamento e revisão Tier 3 aprovados. Fluxos interativos, capturas e limitações na auditoria: Autoplay normal perdeu na horda 3; quatro hordas percorridas com recursos extras apenas no QA.', status='done' if '--complete' in sys.argv else 'review', milestone='m4_frontend_ui', tier='tier3_reviewer', indicators=['Build e 2 testes de balanceamento aprovados', 'Seleção, três níveis, venda e reinícios testados', 'Fases do chefe, invocações, purificação, vitória e derrota testadas', 'Hordas e layout em 1280×720 e 1920×1080 conferidos', 'Captura e endereço local entregues'], audit_confirmed='--complete' in sys.argv, created_at='2026-10-08'),
    dict(id='TASK-027', title='Resolução nativa final de cosmos e piso', description='Cenários atuais têm 1672×941 nativos. Regenerar futuramente no alvo 2560×1440; não ampliar para simular detalhe.', status='todo', milestone='m2_design_arte', tier='tier2_fast', indicators=['Cosmos e piso gerados nativamente no alvo', 'Encaixe e contraste preservados na substituição'], audit_confirmed=False, created_at='2026-10-08'),
]
for task in new_tasks:
    if task['status'] == 'done': task['completed_at'] = '2026-10-08'
    if task['id'] in tasks: tasks[task['id']].update(task)
    else: data['tasks'].append(task); tasks[task['id']] = task
data['project']['summary'] = 'Santuário do Sonho: guardiões épicos, evoluções e criaturas integrados ao jogo local. Cenários em resolução final permanecem pendentes.'
data['project']['last_updated'] = '2026-10-08'
total = len(data['tasks'])
done = sum(task['status'] == 'done' for task in data['tasks'])
data['project']['metrics'] = dict(total_tasks=total, completed_tasks=done, progress_percentage=round(done / total * 100))
serialized = json.dumps(data, ensure_ascii=False, indent=2)
(root / 'tasks.json').write_text(serialized + '\n', encoding='utf-8')
(root / 'tasks_data.js').write_text('window.__TASKS_DATA__ = ' + serialized + ';\n', encoding='utf-8')
for name in ['docs/DESIGN_SYSTEM_STITCH.md', 'docs/SANCTUARY_ART_PRODUCTION.md']:
    path = root / name
    content = path.read_text(encoding='utf-8')
    replacements = {'Ilustração2D':'Ilustração 2D', 'Grade16':'Grade 16', 'de80pixels':'de 80 pixels', 'lógico1280':'lógico 1280', 'em3/4':'em 3/4', 'Protetores80':'Protetores 80', 'protetores80':'protetores 80', 'inimigos64':'inimigos 64', 'comuns64':'comuns 64', 'chefe128':'chefe 128', 'fase1':'fase 1', 'fase2':'fase 2', 'Fase2':'Fase 2', 'Landscape16':'Landscape 16', 'nativos1672':'nativos 1672', 'alvo2560':'alvo 2560', 'novas:9':'novas: 9', ',4':', 4', ',2':', 2', ',1':', 1', 'e1':'e 1', 'Reutilizam-se5':'Reutilizam-se 5', ';3':'; 3', 'RGBA512':'RGBA 512', 'chefe1024':'chefe 1024', 'de10':'de 10', 'em72':'em 72'}
    for before, after in replacements.items(): content = content.replace(before, after)
    path.write_text(content, encoding='utf-8')
print(json.dumps(data['project']['metrics']))
