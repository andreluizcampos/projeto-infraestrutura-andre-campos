const botao = document.querySelector('.menu');
const nav = document.querySelector('.nav');
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

    resultados.textContent = 'Buscando na biblioteca'

    try {

        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(text)}&limit=1&fields=title,author_name,first_publish_year,cover_i`;
        const buscado = await fetch(url);
        if (!buscado.ok) throw new Error(` Erro ${buscado.status}`);
        const retorno = await buscado.json();
        const livro = retorno.docs[0];

        if (!livro) {
            resultados.textContent = 'Nenhum resultado encontrado';
            return;
        }

        resultados.textContent = ' ';
        resultados.appendChild(criaBloco(livro));


    }

    catch (erro) {

        console.error(erro);
        resultados.textContent = 'Deu ruim paizao';
    }

});

function criaBloco(livro) {


    const bloco = document.createElement('article');

    bloco.className = 'bloco';


    if (livro.cover_i) {

        const capa = document.createElement('img');
        capa.className ='bloco-capa';
        capa.src = `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`
        capa.alt = `Capa de ${livro.title}`;
        capa.loading = 'lazy';
        bloco.appendChild(capa);
    }
    else {


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

    const botao = document.createElement('button');
    botao.className = 'bloco-botao';
    botao.type = 'button';
    botao.textContent = 'Quero ler';


    info.append(titulo, autor, ano, botao);

    bloco.appendChild(info);


    return bloco;

}