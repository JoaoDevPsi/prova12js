let livros = JSON.parse(localStorage.getItem('livros')) || [];

const listaLivros = document.getElementById('listaLivros');
const btnAdicionar = document.getElementById('btnAdicionar');
const campoBusca = document.getElementById('campoBusca');
const btnBuscar = document.getElementById('btnBuscar')
const botoesOrdenacao = document.querySelectorAll('#ordenacao button');

function exibirLivros(livrosExibicao = livros) {
    listaLivros.innerHTML = ''; 
    livrosExibicao.forEach(livro => {
        const itemLista = document.createElement('li');
        itemLista.innerHTML = `
            <h3>${livro.titulo}</h3>
            <p>Autor: ${livro.autor}</p>
            <p>Gênero: ${livro.genero}</p>
            <p>Ano: ${livro.ano}</p>
            <p>Avaliação: ${livro.avaliacao || 'Não avaliado'}</p>
            <button class="avaliar" data-titulo="${livro.titulo}">Avaliar</button>
        `;
        listaLivros.appendChild(itemLista);
    });
    
    adicionarEventosAvaliar();
}

function adicionarLivro() {
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const genero = document.getElementById('genero').value;
    const ano = document.getElementById('ano').value;

    if (titulo && autor && genero && ano) {
        livros.push({ titulo, autor, genero, ano, avaliacao: null });
        salvarLivros();
        exibirLivros();
       
        document.getElementById('titulo').value = "";
        document.getElementById('autor').value = "";
        document.getElementById('genero').value = "";
        document.getElementById('ano').value = "";
    }
}

function buscarLivro() {
    const termoBusca = campoBusca.value.toLowerCase();
    const resultados = livros.filter(livro =>
        livro.titulo.toLowerCase().includes(termoBusca) ||
        livro.autor.toLowerCase().includes(termoBusca) ||
        livro.genero.toLowerCase().includes(termoBusca)||
        btnBuscar.addEventListener('click', buscarLivro)
    );
    exibirLivros(resultados);
}

function ordenarLivros(tipo) {
    livros.sort((a, b) => {
        if (tipo === 'avaliacao') {
            const avalA = a.avaliacao === null ? -1 : a.avaliacao;
            const avalB = b.avaliacao === null ? -1 : b.avaliacao;
            return avalB - avalA; 
        }
        return a[tipo].localeCompare(b[tipo]);
    });
    exibirLivros();
}

function salvarLivros() {
    localStorage.setItem('livros', JSON.stringify(livros));
}

function adicionarEventosAvaliar() {
    const botoesAvaliar = document.querySelectorAll('.avaliar');
    botoesAvaliar.forEach(botao => {
        botao.addEventListener('click', () => {
            const tituloLivro = botao.dataset.titulo;
            const avaliacao = prompt(`Avalie o livro "${tituloLivro}" (0 a 5):`);
            if (avaliacao !== null && !isNaN(avaliacao) && avaliacao >= 0 && avaliacao <= 5) {
                const livro = livros.find(l => l.titulo === tituloLivro);
                if (livro) {
                    livro.avaliacao = parseInt(avaliacao);
                    salvarLivros();
                    exibirLivros();
                }
            } else if (avaliacao !== null) {
                alert("Por favor, insira uma avaliação válida entre 0 e 5.");
            }
        });
    });
}


btnAdicionar.addEventListener('click', adicionarLivro);
campoBusca.addEventListener('input', buscarLivro);
botoesOrdenacao.forEach(botao => {
    botao.addEventListener('click', () => ordenarLivros(botao.dataset.tipo));
});

exibirLivros(); 