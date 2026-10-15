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


    acao.preventDefault(); // evitar refresh (?)

    const text = campo.value.trim();

    if (!text) return;

    resultados.textContent = 'Buscando na biblioteca'

    try {

        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(termo)}&limit=1&fields=title,author_name,first_publish_year,cover_i`;
        const buscado = await fetch(url);
        if (!buscado.ok) throw new Error('Erro ${resposta.status}');
        const retorno = await buscado.json();
        const livro = retorno.docs[0];

        if (!livro) {
            resultados.textContent = 'Nenhum resultado encontrado';
            return;
        }

        resultados.textContent = ' ';
        resultados.appendChild(criaBloco(livro));


    }

    catch(erro){

        console.erro(erro);
        resultados.textContent='Deu ruim paizao';
    }

});

function criaBloco(livro){

    // na teoria aqui eh pra conseguir fz a API retornar um article bonitin 

}