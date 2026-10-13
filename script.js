const botao = document.querySelector('.menu');
const nav = document.querySelector('.nav');
botao.addEventListener('click', () => {



    const open = nav.classList.toggle('open');
    botao.setAttribute('aria-expanded',open);

});
