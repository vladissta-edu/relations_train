/* A finite binary relation is stored as a set of keys "first|second". */
const RelationLogic = (() => {
  const key = (a, b) => `${a}|${b}`;
  const pair = (a, b) => `(${a}, ${b})`;
  function check(elements, relation) {
    const has = (a, b) => relation.has(key(a, b));
    const missingLoop = elements.find(a => !has(a, a));
    const presentLoop = elements.find(a => has(a, a));
    let symmetry = null, antisymmetry = null, transitivity = null;
    for (const a of elements) for (const b of elements) {
      if (has(a, b) && !has(b, a) && !symmetry) symmetry = [a, b];
      if (a !== b && has(a, b) && has(b, a) && !antisymmetry) antisymmetry = [a, b];
      for (const c of elements) {
        if (has(a, b) && has(b, c) && !has(a, c) && !transitivity) transitivity = [a, b, c];
      }
    }
    const reflexive = missingLoop === undefined;
    const irreflexive = presentLoop === undefined;
    const symmetric = symmetry === null;
    const antisymmetric = antisymmetry === null;
    const transitive = transitivity === null;
    return {
      reflexive: {pass: reflexive, reason: reflexive ? 'Для каждого x ∈ A пара (x, x) входит в R.' : `Пары ${pair(missingLoop, missingLoop)} нет в R.`},
      irreflexive: {pass: irreflexive, reason: irreflexive ? 'Ни одна пара (x, x) не входит в R.' : `${pair(presentLoop, presentLoop)} входит в R: элемент находится в отношении с самим собой.`},
      symmetric: {pass: symmetric, reason: symmetric ? 'Для каждой пары (x, y) в R есть обратная пара (y, x).' : `${pair(...symmetry)} входит в R, а ${pair(symmetry[1], symmetry[0])} — нет.`},
      antisymmetric: {pass: antisymmetric, reason: antisymmetric ? 'Нет двух различных элементов, связанных в обе стороны.' : `${pair(...antisymmetry)} и ${pair(antisymmetry[1], antisymmetry[0])} входят в R, хотя ${antisymmetry[0]} ≠ ${antisymmetry[1]}.`},
      transitive: {pass: transitive, reason: transitive ? 'Для каждой цепочки из двух пар есть необходимая третья пара.' : `${pair(transitivity[0], transitivity[1])} и ${pair(transitivity[1], transitivity[2])} входят в R, но ${pair(transitivity[0], transitivity[2])} отсутствует.`},
      equivalence: {pass: reflexive && symmetric && transitive, reason: reflexive && symmetric && transitive ? 'Выполняются рефлексивность, симметричность и транзитивность.' : `Нарушены свойства: ${[!reflexive && 'рефлексивность', !symmetric && 'симметричность', !transitive && 'транзитивность'].filter(Boolean).join(', ')}.`},
      partialOrder: {pass: reflexive && antisymmetric && transitive, reason: reflexive && antisymmetric && transitive ? 'Выполняются рефлексивность, антисимметричность и транзитивность.' : `Нарушены свойства: ${[!reflexive && 'рефлексивность', !antisymmetric && 'антисимметричность', !transitive && 'транзитивность'].filter(Boolean).join(', ')}.`}
    };
  }
  function classes(elements, relation) {
    const remaining = new Set(elements), groups = [];
    for (const a of elements) {
      if (!remaining.has(a)) continue;
      const group = elements.filter(b => relation.has(key(a, b)));
      group.forEach(b => remaining.delete(b));
      groups.push(group);
    }
    return groups;
  }
  return {key, pair, check, classes};
})();

if (typeof module !== 'undefined' && module.exports) module.exports = RelationLogic;

if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  const definitions = [
    ['reflexive', 'Рефлексивность', 'Для любого x ∈ A: (x, x) ∈ R.'],
    ['irreflexive', 'Антирефлексивность', 'Для любого x ∈ A: (x, x) ∉ R.'],
    ['symmetric', 'Симметричность', '(x, y) ∈ R ⇒ (y, x) ∈ R.'],
    ['antisymmetric', 'Антисимметричность', '(x, y) ∈ R и (y, x) ∈ R ⇒ x = y.'],
    ['transitive', 'Транзитивность', '(x, y) ∈ R и (y, z) ∈ R ⇒ (x, z) ∈ R.'],
    ['equivalence', 'Отношение эквивалентности', 'Рефлексивность + симметричность + транзитивность.'],
    ['partialOrder', 'Отношение частичного порядка', 'Рефлексивность + антисимметричность + транзитивность.']
  ];
  const examples = [
    {id:'reflexive',title:'Рефлексивность',subtitle:'Каждый элемент связан с собой',note:'На главной диагонали стоят единицы. Уберите одну петлю, чтобы рефлексивность нарушилась.',pairs:[['a','a'],['b','b'],['c','c'],['a','b']]},
    {id:'irreflexive',title:'Антирефлексивность',subtitle:'Нет ни одной петли',note:'На главной диагонали только нули. Добавьте любую петлю, чтобы антирефлексивность нарушилась.',pairs:[['a','b'],['b','c']]},
    {id:'symmetric',title:'Симметричность',subtitle:'Каждая стрелка имеет обратную',note:'Пары (a, b) и (b, a) входят в R. Уберите одну из них, чтобы нарушить симметричность.',pairs:[['a','b'],['b','a'],['c','c']]},
    {id:'antisymmetric',title:'Антисимметричность',subtitle:'Нет встречных стрелок между разными элементами',note:'Стрелка a → b есть, а обратной нет. Добавьте (b, a), чтобы нарушить антисимметричность.',pairs:[['a','a'],['a','b'],['b','b']]},
    {id:'transitive',title:'Транзитивность',subtitle:'Нужная третья пара присутствует',note:'Из (a, b) и (b, c) должна следовать (a, c). Уберите (a, c), чтобы увидеть нарушение.',pairs:[['a','b'],['b','c'],['a','c']]},
    {id:'equivalence',title:'Отношение эквивалентности',subtitle:'Два класса эквивалентности',note:'Элементы a и b относятся к одному классу, c — к другому. Классы образуют разбиение A.',pairs:[['a','a'],['a','b'],['b','a'],['b','b'],['c','c']]},
    {id:'partialOrder',title:'Отношение частичного порядка',subtitle:'Цепочка из трёх элементов',note:'Представьте a ≤ b ≤ c. Здесь присутствуют петли и пара (a, c), необходимая для транзитивности.',pairs:[['a','a'],['b','b'],['c','c'],['a','b'],['b','c'],['a','c']]}
  ];
  const state = {elements:['a','b','c'],relation:new Set(),highlight:null,example:'reflexive'};
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = (tag, attrs={}) => {const el=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attrs)) el.setAttribute(k,String(v));return el;};
  function allPairs() {return state.elements.flatMap(a => state.elements.map(b => [a,b]));}
  function has(a,b) {return state.relation.has(RelationLogic.key(a,b));}
  function toggle(a,b) {
    const k=RelationLogic.key(a,b);
    if(state.relation.has(k)) state.relation.delete(k); else state.relation.add(k);
    state.highlight=k; state.example=null; $('example-note').textContent='Ваше отношение: добавляйте и убирайте пары, чтобы проверить свойства.';
    render();
  }
  function buildPairControls() {
    const grid=$('product-pairs'); grid.replaceChildren();grid.dataset.size=String(state.elements.length);
    for(const [a,b] of allPairs()) {
      const btn=document.createElement('button');btn.type='button';btn.className='pair-chip';btn.dataset.a=a;btn.dataset.b=b;
      btn.textContent=RelationLogic.pair(a,b);btn.addEventListener('click',()=>toggle(a,b));grid.append(btn);
    }
    const thead=$('relation-matrix').querySelector('thead'),tbody=$('relation-matrix').querySelector('tbody');
    thead.replaceChildren();tbody.replaceChildren();
    const head=document.createElement('tr'),corner=document.createElement('th');corner.scope='col';corner.textContent='R';head.append(corner);
    for(const b of state.elements){const th=document.createElement('th');th.scope='col';th.textContent=b;head.append(th);}thead.append(head);
    for(const a of state.elements){
      const tr=document.createElement('tr'),rowHead=document.createElement('th');rowHead.scope='row';rowHead.textContent=a;tr.append(rowHead);
      for(const b of state.elements){const td=document.createElement('td');if(a===b)td.className='diagonal';const btn=document.createElement('button');btn.type='button';btn.dataset.a=a;btn.dataset.b=b;btn.addEventListener('click',()=>toggle(a,b));td.append(btn);tr.append(td);}tbody.append(tr);
    }
  }
  function renderControls(){
    const total=state.elements.length**2;
    $('set-notation').textContent=`A = {${state.elements.join(', ')}}`;
    $('product-summary').textContent=`В A × A — ${total} упорядоченных пар`;
    $('relation-count').textContent=`Выбрано ${state.relation.size} из ${total} пар`;
    for(const btn of document.querySelectorAll('.set-button')) btn.setAttribute('aria-pressed',String(Number(btn.dataset.size)===state.elements.length));
    for(const btn of document.querySelectorAll('.pair-chip, #relation-matrix button')){
      const {a,b}=btn.dataset,selected=has(a,b),highlighted=state.highlight===RelationLogic.key(a,b);
      btn.setAttribute('aria-pressed',String(selected));btn.classList.toggle('highlighted',highlighted);
      if(btn.closest('table')) btn.textContent=selected?'1':'0';
      btn.setAttribute('aria-label',`Пара ${RelationLogic.pair(a,b)} ${selected?'входит':'не входит'} в R; нажмите, чтобы ${selected?'убрать':'добавить'} её`);
    }
    const selected=allPairs().filter(([a,b])=>has(a,b)).map(([a,b])=>RelationLogic.pair(a,b));
    $('relation-set').textContent=selected.length?`R = {${selected.join(', ')}}`:'R = ∅';
    for(const btn of document.querySelectorAll('.example-button')) btn.setAttribute('aria-pressed',String(btn.dataset.example===state.example));
  }
  function renderGraph(){
    const graph=$('relation-graph');graph.replaceChildren();
    const title=svg('title',{id:'graph-svg-title'});title.textContent='Ориентированный граф отношения R';graph.append(title);
    const desc=svg('desc',{id:'graph-svg-desc'});desc.textContent=state.relation.size?`Элементы множества: ${state.elements.join(', ')}. Стрелки соответствуют парам ${allPairs().filter(([a,b])=>has(a,b)).map(([a,b])=>RelationLogic.pair(a,b)).join(', ')}.`:'Стрелок пока нет.';graph.append(desc);
    const defs=svg('defs');
    for(const [id,color] of [['arrowhead','#116b68'],['arrowhead-highlight','#b4543e']]){const marker=svg('marker',{id,viewBox:'0 0 10 10',refX:'8.6',refY:'5',markerWidth:'7',markerHeight:'7',orient:'auto-start-reverse'});marker.append(svg('path',{d:'M 0 0 L 10 5 L 0 10 z',fill:color}));defs.append(marker);}graph.append(defs);
    // Keep loops and arrowheads well inside the 420 × 340 viewBox.
    const positions=state.elements.length===3?{a:[210,110],b:[105,260],c:[315,260]}:{a:[105,105],b:[315,105],c:[315,265],d:[105,265]};
    for(const [a,b] of allPairs()){
      if(!has(a,b))continue;
      const [x1,y1]=positions[a],[x2,y2]=positions[b];let d;
      if(a===b){d=`M ${x1-14} ${y1-18} C ${x1-60} ${y1-82}, ${x1+60} ${y1-82}, ${x1+14} ${y1-18}`;}
      else{
        const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;
        const sx=x1+ux*23,sy=y1+uy*23,ex=x2-ux*25,ey=y2-uy*25;
        const curve=has(b,a)?25:0;
        d=`M ${sx} ${sy} Q ${(sx+ex)/2-uy*curve} ${(sy+ey)/2+ux*curve} ${ex} ${ey}`;
      }
      const path=svg('path',{d,class:`graph-edge${state.highlight===RelationLogic.key(a,b)?' highlighted':''}`});
      const edgeTitle=svg('title');edgeTitle.textContent=`Пара ${RelationLogic.pair(a,b)} входит в R`;path.append(edgeTitle);graph.append(path);
    }
    for(const a of state.elements){const [x,y]=positions[a];graph.append(svg('circle',{cx:x,cy:y,r:21,class:'graph-node'}));const label=svg('text',{x,y:y+1,class:'graph-node-label'});label.textContent=a;graph.append(label);}
  }
  function renderResults(){
    const results=RelationLogic.check(state.elements,state.relation),container=$('property-results');container.replaceChildren();
    for(const [id,name,rule] of definitions){const result=results[id],card=document.createElement('article');card.className=`property-card${result.pass?'':' fail'}`;
      const heading=document.createElement('div');heading.className='property-card-heading';
      const title=document.createElement('h4');title.textContent=name;const status=document.createElement('span');status.className='status';status.textContent=result.pass?'Выполняется':'Не выполняется';heading.append(title,status);
      const ruleEl=document.createElement('p');ruleEl.className='rule';ruleEl.textContent=rule;const reason=document.createElement('p');reason.className='reason';reason.textContent=result.reason;
      card.append(heading,ruleEl,reason);container.append(card);
    }
    const structure=$('structure-result');structure.replaceChildren();
    const strong=document.createElement('strong'),text=document.createElement('span');
    if(results.equivalence.pass){strong.textContent='Классы эквивалентности: ';text.textContent=RelationLogic.classes(state.elements,state.relation).map(g=>`{${g.join(', ')}}`).join('  ·  ')+' — они образуют разбиение A.';}
    else if(results.partialOrder.pass){strong.textContent='Отношение частичного порядка: ';text.textContent='между различными элементами нет встречных пар; можно проследить цепочки связанных элементов.';}
    else{strong.textContent='Проверяйте дальше: ';text.textContent='одно отношение может обладать несколькими свойствами сразу.';}
    structure.append(strong,text);
  }
  function render(){renderControls();renderGraph();renderResults();}
  function loadExample(id){
    const ex=examples.find(item=>item.id===id);if(!ex)return;
    state.elements=['a','b','c'];state.relation=new Set(ex.pairs.map(([a,b])=>RelationLogic.key(a,b)));state.highlight=null;state.example=id;
    buildPairControls();$('example-note').textContent=ex.note;render();
  }
  function init(){
    const examplesEl=$('example-buttons');
    for(const ex of examples){const btn=document.createElement('button');btn.type='button';btn.className='example-button';btn.dataset.example=ex.id;const title=document.createElement('strong'),subtitle=document.createElement('span');title.textContent=ex.title;subtitle.textContent=ex.subtitle;btn.append(title,subtitle);btn.addEventListener('click',()=>loadExample(ex.id));examplesEl.append(btn);}
    for(const btn of document.querySelectorAll('.set-button'))btn.addEventListener('click',()=>{const size=Number(btn.dataset.size);if(size===state.elements.length)return;state.elements=['a','b','c','d'].slice(0,size);state.relation=new Set([...state.relation].filter(k=>k.split('|').every(a=>state.elements.includes(a))));state.highlight=null;state.example=null;buildPairControls();$('example-note').textContent='Множество A изменено. Проверьте, какие свойства сохранились.';render();});
    $('clear-button').addEventListener('click',()=>{state.relation.clear();state.highlight=null;state.example=null;$('example-note').textContent='Отношение R пусто. Добавьте пары, чтобы проверить свойства.';render();});
    $('all-button').addEventListener('click',()=>{state.relation=new Set(allPairs().map(([a,b])=>RelationLogic.key(a,b)));state.highlight=null;state.example=null;$('example-note').textContent='Все пары из A × A входят в R.';render();});
    loadExample('reflexive');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
}
