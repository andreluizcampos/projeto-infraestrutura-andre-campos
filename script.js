const botao = document.querySelector('.menu');
const nav = document.querySelector('.nav');
const secaobusca = document.querySelector('.busca');

botao.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    botao.setAttribute('aria-expanded', open);
});

const form = document.querySelector('.busca-form');
const campo = document.querySelector('#campo-busca');
const resultados = document.querySelector('.resultados');

form.addEventListener('submit', async (acao) => {
    acao.preventDefault(); // evitar refresh (?) // revisar essa funcionalidade

    const text = campo.value.trim();

    if (!text) return;

    resultados.textContent = 'Buscando na biblioteca';

    try {
        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(text)}&limit=16&fields=key,title,author_name,first_publish_year,cover_i`;
        const buscado = await fetch(url);
        if (!buscado.ok) throw new Error(`Erro ${buscado.status}`);
        const retorno = await buscado.json();
        const livro = retorno.docs;

        if (livro.length == 0) {
            resultados.textContent = 'Nenhum resultado encontrado';
            return;
        }

        resultados.textContent = '';

        livro.forEach((item) => {
            resultados.appendChild(criaBloco(item));
        });

    } catch (erro) {
        console.error(erro);
        resultados.textContent = 'Deu ruim paizao';
    }
});

function criaBloco(livro, L1) {
    const bloco = document.createElement('article');
    bloco.className = 'bloco';



    if (livro.cover_i) {
        const capa = document.createElement('img');
        capa.className = 'bloco-capa';
        capa.src = `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`;
        capa.alt = `Capa de ${livro.title}`;
        capa.loading = 'lazy';
        bloco.appendChild(capa);
    } else {
        const noCapa = document.createElement('div');
        noCapa.className = 'bloco-capa no-capa';
        bloco.appendChild(noCapa);
    }

    const info = document.createElement('div');
    info.className = 'bloco-info';

    const titulo = document.createElement('h2');
    titulo.className = 'bloco-titulo';
    titulo.textContent = livro.title;

    const autor = document.createElement('p');
    autor.className = 'bloco-autor';
    autor.textContent = livro.author_name?.[0] ?? 'Desconhecido';

    const ano = document.createElement('p');
    ano.className = 'bloco-ano';
    ano.textContent = livro.first_publish_year ?? '';


    if (!L1) {

        const botao = document.createElement('button');
        botao.className = 'bloco-botao';
        botao.type = 'button';

        info.append(titulo, autor, ano, botao);
        if (EstaNaLista(livro.key)) {
            botao.textContent = 'Na lista';
            botao.disabled = true;
        } else {
            botao.textContent = 'Quero ler';

            botao.addEventListener('click', () => {
                AddQueroLer(livro);
                botao.textContent = 'Na lista';
                botao.disabled = true;
            });
        }


    }
    else {

        const seletor = document.createElement('select');
        seletor.className = 'bloco-seletor';
        info.append(titulo, autor, ano, seletor);

        const opt = [
            { valor: 'queroler', texto: 'Quero ler' },
            { valor: 'lendo', texto: 'Lendo' },
            { valor: 'lidos', texto: 'Lido' },];


        opt.forEach((op) => {

            const option = document.createElement('option');
            option.value = op.valor;
            option.textContent = op.texto;
            seletor.appendChild(option);
            option.selected = op.valor === L1;
        })

        seletor.addEventListener('change', () => {

            MoveLivro(livro.key, L1, seletor.value);
            mostraLista(L1);
        })

    }

    bloco.appendChild(info);



    return bloco;
}

//  Botao de add:

const KEY = 'resenha-listas';

function CarregaListas() {
    try {
        const salvo = localStorage.getItem(KEY);
        return salvo ? JSON.parse(salvo) : { queroler: [], lendo: [], lidos: [] };
    } catch {
        return { queroler: [], lendo: [], lidos: [] };
    }
}

function SalvaListas(listas) {
    localStorage.setItem(KEY, JSON.stringify(listas));
}

function EstaNaLista(key) {
    const listas = CarregaListas();
    const all = [...listas.queroler, ...listas.lendo, ...listas.lidos];
    return all.some((salvo) => salvo.key == key);
}

function AddQueroLer(livro) {
    if (EstaNaLista(livro.key)) {
        return;
    }

    const listas = CarregaListas();

    listas.queroler.push({
        key: livro.key,
        title: livro.title,
        author_name: livro.author_name ?? [],
        first_publish_year: livro.first_publish_year ?? null,
        cover_i: livro.cover_i ?? null,
    });

    SalvaListas(listas);
}

function MoveLivro(key, l1, l2) {


    if (l1 == l2) {

        return;
    }

    const listas = CarregaListas();
    const livro = listas[l1].find((l) => l.key === key);

    if (!livro) return;

    listas[l1] = listas[l1].filter((l) => l.key !== key);
    listas[l2].push(livro);
    SalvaListas(listas);

}

function mostraLista(nome) {


    const listas = CarregaListas();
    const livros = listas[nome];
    resultados.textContent = '';

    if (livros.length == 0) {

        resultados.textContent = 'Nenhum livro nesta lista ainda';
        return;
    }

    livros.forEach((livro) => {

        resultados.appendChild(criaBloco(livro, nome))
    })




}

// trocar de aba chama lista:

nav.addEventListener('click', (evento) => {

    const link = evento.target.closest('a');

    if (!link) {

        return;
    }

    evento.preventDefault();

    const lista = link.dataset.lista;

    if (lista == 'busca') {

        resultados.textContent = '';
        secaobusca.hidden = false;
    }
    else {
        secaobusca.hidden = true;
        mostraLista(lista);
    }

    nav.querySelectorAll('a').forEach((l) => l.classList.remove('on'));
    link.classList.add('on');
    nav.classList.remove('open');
    botao.setAttribute('aria-expanded', false);


})

