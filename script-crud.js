const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector(".app__section-task-list");
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');


let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [] // caso exista algo no localStorage tarefas, sera feito a conversao de string para array, caso nao tenha tarfas sera criado um array vazio
let tarefaSelecionada = null
let liTarefaSelecionada = null

function atualizarTarefas () {
    localStorage.setItem('tarefas', JSON.stringify(tarefas)) // coloca dentro do armazenamento local, na chave chamada "tarefas" o array "tarefas", que foi convertido para string (pois o localStorage so aceita strings) atraves do metodo "stringify" da api JSON do navegador. Assim evitando que quando atualizarmos a pagina as informações inseridas se percam
}

function criarElementoTarefa(tarefa) { // tranforma uma tarefa em html

    const li = document.createElement('li') // cria uma lista html
    li.classList.add('app__section-task-list-item') // adiciona classe para a lista

    const svg = document.createElement('svg') // cria um svg html
    svg.innerHTML = `
            <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
                <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
            </svg>
    ` // svg recebe o codigo html

    const paragrafo = document.createElement('p')
    paragrafo.textContent = tarefa.descricao // o paragrafo ira receber o conteudo da descricao do objeto "tarefas" informado na chamada da funcao
    paragrafo.classList.add('app__section-task-list-item-description') // adicionando classe de estilos

    const botao = document.createElement('button')
    botao.classList.add('app_button-edit')

    botao.onclick = () => {
        const novaDescricao = prompt("Qual é o novo nome da tarefa?")
        console.log(novaDescricao)
        
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao // alteracao da camada visual
            tarefa.descricao = novaDescricao // alteracao da camada de dados do objeto
            atualizarTarefas()
        } // se o usuario digitar algo no prompt sera alterado o texto da tarefa e o objeto "tarefa" tambem sera alterado
    }
    
    const imagemBotao = document.createElement('img') // cria uma constante especificamente para a imagem
    imagemBotao.setAttribute('src', '/imagens/edit.png') // edita o diretorio da imagem
    botao.append(imagemBotao) // atribui a imagem para dentro do botao

    li.append(svg) // atribui svg para a lista
    li.append(paragrafo) // atribui paragrafo para a lista
    li.append(botao) // atribui botao para a lista

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'true')

    } else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item').forEach(elemento => {
                elemento.classList.remove('app__section-task-list-item-active') // remove a classe de estilos
            })
    
            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = '' // limpa o texto da tarefa ativa  
                tarefaSelecionada = null
                liTarefaSelecionada = null
                return
            }
            
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
            paragrafoDescricaoTarefa.textContent = tarefa.descricao // altera o texto do paragrafo da tarefa ativa
            
            li.classList.add('app__section-task-list-item-active') // adiciona classe de estilos
        }
        
    }


    return li // retorna o elemento
}


// addEventListener('Qual evento quero ouvir?', () => {
    // O que quero executar?
// })

btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden') // Alterna entre remover ou adicionar a classe que esconde o formulario
})

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault(); // previne que o evento que dispara automaticamente quando a ação de "submit" acontece, dispare
    const tarefa = {
        descricao: textarea.value // guarda em um objeto o que foi escrito pelo usuario
    }

    tarefas.push(tarefa) // guarda no array o objeto "tarefa"

    const elementoTarefa = criarElementoTarefa(tarefa) // cria li para a nova tarefa
    ulTarefas.append(elementoTarefa) // atribui para a ul a li criada, para exibir na tela o elemento criado

    atualizarTarefas()

    textarea.value = '' // limpa o texto da tarefa recem criada da caixa de texto

    formAdicionarTarefa.classList.add('hidden') // Adiciona a classe que esconde o formulario
})

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa) // atribui para a ul a li criada, para exibir na tela o elemento criado
})

document.addEventListener('FocoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'true')
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
}) // quando o timer finaliza o estilo da tarefa selecionada muda

const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item" // cria um array apenas com as tarefas completas ou com todas as tarefas 
    document.querySelectorAll(seletor).forEach(elemento => { // percorre o array
        elemento.remove() // remove o elemento
    })

    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [] // se somenteCompletas for verdadeiro, filtra o array removendo as tarefas incompletas, caso contrario, limpa o array

    atualizarTarefas()
}

btnRemoverConcluidas.onclick = () => removerTarefas(true)
btnRemoverTodas.onclick = () => removerTarefas(false)
