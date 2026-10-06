/* ========== DADOS ========== */
const ITEMS = [
  {n:'Brasa Clássico', c:'burgers', e:'🍔', p:32, d:'Carne 180 g, queijo prato, alface, tomate e maionese da casa.', t:'Mais pedido'},
  {n:'Duplo Cheddar', c:'burgers', e:'🧀', p:42, d:'Dois blends, cheddar cremoso, cebola caramelizada e molho especial.'},
  {n:'Bacon Crocante', c:'burgers', e:'🥓', p:38, d:'Carne 180 g, bacon em tiras, cheddar e barbecue defumado.'},
  {n:'Picante Vermelho', c:'burgers', e:'🌶️', p:36, d:'Carne, pepper jack, jalapeño e maionese de pimenta.', t:'Picante'},
  {n:'Frango Crocante', c:'burgers', e:'🍗', p:34, d:'Filé empanado, alface americana e maionese de ervas.'},
  {n:'Veggie Grelhado', c:'burgers', e:'🥬', p:35, d:'Burger de grão-de-bico, rúcula, tomate seco e queijo coalho.'},
  {n:'Batata Rústica', c:'porcoes', e:'🍟', p:22, d:'Batatas com casca, alho e alecrim. Acompanha molho.'},
  {n:'Onion Rings', c:'porcoes', e:'🧅', p:24, d:'Anéis de cebola empanados, sequinhos e crocantes.'},
  {n:'Nuggets da Casa', c:'porcoes', e:'🍤', p:26, d:'10 unidades de frango crocante com dois molhos.'},
  {n:'Refrigerante', c:'bebidas', e:'🥤', p:8, d:'Lata 350 ml. Cola, guaraná ou limão.'},
  {n:'Limonada Suíça', c:'bebidas', e:'🍋', p:12, d:'Limão batido com leite condensado e gelo.'},
  {n:'Milk-shake', c:'bebidas', e:'🥛', p:20, d:'400 ml. Chocolate, morango ou doce de leite.', t:'Cremoso'},
  {n:'Brownie com Sorvete', c:'sobremesas', e:'🍫', p:18, d:'Brownie quente, bola de creme e calda de chocolate.'},
  {n:'Churros Recheado', c:'sobremesas', e:'🍩', p:16, d:'Três churros com doce de leite, passados no açúcar e canela.'}
];
const CATS = {todos:'Todos', burgers:'Hambúrgueres', porcoes:'Porções', bebidas:'Bebidas', sobremesas:'Sobremesas'};
const brl = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

/* ========== ESTADO ========== */
let active = 'todos', count = 0, total = 0, toastTimer;
const $ = id => document.getElementById(id);

/* ========== RENDER ========== */
function renderTabs(){
  $('tabs').innerHTML = Object.entries(CATS).map(([k,v]) =>
    `<button class="tab ${k===active?'active':''}" role="tab" aria-selected="${k===active}" data-cat="${k}">${v}</button>`).join('');
}
function renderGrid(){
  const list = ITEMS.filter(i => active==='todos' || i.c===active);
  $('grid').innerHTML = list.map((i,idx) => `
    <article class="card" style="animation-delay:${idx*70}ms">
      <div class="emoji" aria-hidden="true">${i.e}</div>
      ${i.t ? `<span class="tag">${i.t}</span>` : ''}
      <h3>${i.n}</h3>
      <p>${i.d}</p>
      <div class="row">
        <span class="price">${brl(i.p)}</span>
        <button class="add" data-name="${i.n}" data-price="${i.p}" aria-label="Adicionar ${i.n}">+</button>
      </div>
    </article>`).join('');
}

/* ========== EVENTOS ========== */
$('tabs').addEventListener('click', e => {
  const b = e.target.closest('.tab'); if(!b) return;
  active = b.dataset.cat; renderTabs(); renderGrid();
});
$('grid').addEventListener('click', e => {
  const b = e.target.closest('.add'); if(!b) return;
  count++; total += +b.dataset.price;
  $('count').textContent = count; $('total').textContent = brl(total);
  const cart = $('cart'); cart.classList.remove('bump'); void cart.offsetWidth; cart.classList.add('bump');
  const t = $('toast'); t.textContent = `${b.dataset.name} adicionado!`; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1600);
});
$('menuBtn').addEventListener('click', () => {
  const open = $('links').classList.toggle('open');
  $('menuBtn').classList.toggle('open', open);
  $('menuBtn').setAttribute('aria-expanded', open);
});
$('links').addEventListener('click', e => {
  if(e.target.tagName==='A'){ $('links').classList.remove('open'); $('menuBtn').classList.remove('open'); }
});

/* Revelar ao rolar */
const io = new IntersectionObserver(es => es.forEach(x => { if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); } }), {threshold:.15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ========== INÍCIO ========== */
renderTabs(); renderGrid();