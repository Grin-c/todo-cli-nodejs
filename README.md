# todo-cli-nodejs
Todo (CLI) feito em nodejs 😁

**Baseado no tutorial da [Medium](https://medium.com/henriquekuwai/criando-sua-cli-com-node-js-d6dee7d03110)**

## Recursos

* Adicione tarefas 
* Escolha a prioridade delas
* Mude os to-dos
* Marque como feita ou desmarque e deixe como pendente
* Liste as tarefas
* Limpe todos de uma vez

## Comandos

* td add (todo) #Adiciona um todo
<br> (todo) = Atividade
* td prd (pos) (prd) #Muda a prioridade do todo
<br> (pos) = Posição
<br> (prd) = Prioridade
* td desc (pos) (desc) #Muda a descrição do todo
<br> (desc) = Descrição
* td mud (pos) #Muda o todo
* td do (pos) #Marca o todo como feito
* td undo (pos) #Marca o todo como pendente
* td list #Lista os todos
* td clean #Limpa os todos
* td criador #Mostra o criador do programa



## Requisitos
* nodejs (Alguma versão aí) 
* git

Obs: O node na versão 17 funciona 😁

## Instalação

1. Clone o repositório:
    ``` bash
    git clone https://github.com/Rofen1/todo-cli-nodejs.git
    cd todo-cli-nodejs
    ```

2. Instale as Dependências (nodejs, npm)

    **Siga o passo a passo da sua distribuição**

3. Instale os packages do node     
    ``` bash
    npm install --global yarn 
    yarn add commander path fs chalk cli-table inquirer
    ```
4. Fazer o link para o arquivo
    ``` bash
    npm link
    ```
    **Caso não funcione:** 
    ``` bash
    sudo npm link
    ```

## Desinstalação
1. Entre no diretório do programa e desfaça o link
    ``` bash
    npm unlink
    ```
    **Caso não funcione:** 
    ``` bash
    npm unlink -g
    ```
    Ou:
    ``` bash
    sudo npm unlink -g
    ```
2. Exclua o diretório do programa
    ``` bash
    rm -rf todo-cli-nodejs
    ```
    

