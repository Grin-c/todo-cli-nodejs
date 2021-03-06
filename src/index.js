#! /usr/bin/env node

const program = require("commander");
const {join} = require("path");
const fs = require("fs");
const package = require("../package.json");
const chalk = require("chalk");
const inquirer = require("inquirer");
const figlet = require("figlet")
const Table = require("cli-table");

const todoPath = join(__dirname + "/todo", "todos.json");
const dir = __dirname + "/todo";

program.version(package.version);

function dirExist(dir){
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}
dirExist(dir);

program.version(package.version);

function getJson(path) {
    const data = fs.existsSync(path) ? fs.readFileSync(path) : [];
    try{
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

const saveJson = (path, data) => fs.writeFileSync(path, JSON.stringify(data, null, "\t"));

function showTodo(json) {
    const table = new Table({
        head: [chalk.blue.bold("Posição"), chalk.blue.bold("Todo"), chalk.blue.bold("Descrição"), chalk.blue.bold("Pendente")],
        colWidths: [9, 18, 35, 11]
    });
    json.map( (todo, index) => { 
        try{
            table.push([chalk.yellow.bold(index), todo.todo, todo.desc, todo.done ? chalk.green.bold("Concluido") : chalk.yellow.bold("Pendente")]);
        } catch (err){}
    });
    console.log(table.toString());
}

function cleanTodos(m1, m2){
        fs.unlink(todoPath, (err) => {
        try{
            if (err) throw (err);
            console.log(chalk.green.bold(m1));
        } catch (err){
            console.log(chalk.redBrighat.bold(m2));
        }
    });
}

program
    .command("add <to-do>")
    .description("Adiciona um to-do")
    .option("-d, --desc <pos> <descrição>, Descrição do to-do")
    .action( (todo, desc) => {
        const json = getJson(todoPath);

        if (!desc.desc){
            json.push({
                todo: todo,
                prd: "Normal",
                desc: "NT",
                done: false
            });
        } else{
            json.push({
                todo: todo,
                prd: "Normal",
                desc: desc['desc'],
                done: false
            });
        }
       
        saveJson(todoPath, json);
        console.log(`${chalk.green.bold("To-do adicionado")}`);
        showTodo(json);
    });

program
    .command("rm <pos>")
    .description("Rmove um to-do específico")
    .action( (pos) => {
        const json = getJson(todoPath);
        let qtdNull = 1;
        delete json[pos]; 
        showTodo(json);
        saveJson(todoPath, json);
        
        for (c=0; c < json.length-1; c++){
            if (json[c] === null){
                qtdNull += 1;
            }
        }

        if (qtdNull == json.length){
            cleanTodos("","");
        }
        console.log(chalk.green.bold("To-do removido"));
    });

program
    .command("desc <pos> <descrição>")
    .description("Adiciona uma descrição ao to-do")
    .action( (pos, desc) => {
        const json = getJson(todoPath);
        json[pos].desc = desc;
        saveJson(todoPath, json);
        console.log(chalk.green.bold("Descrição alterada"));
        showTodo(json);
    });

program 
    .command("mud <pos>")
    .description("Muda o to-do")
    .action( async (pos) => {
        const json = getJson(todoPath);
        
        let _todo;
        let _desc;

        _todo = await inquirer.prompt([
            {
                type: "input",
                name: "todo",
                message: "Novo to-do (deixe em branco se não quiser mudar): "
            }
        ]);

        if (_todo.todo.length > 0){
            json[pos].todo = _todo.todo; 
        }
        
        _desc = await inquirer.prompt([
            {
                type: "input",
                name: "desc",
                message: "Nova descrição (deixe em branco se não quiser mudar): "
            }
        ]);

        if (_desc.desc.length > 0){
            json[pos].desc = _desc.desc;
        }

        saveJson(todoPath, json);
        showTodo(json);
    });

program
    .command("do <pos>")
    .description("Marca o to-do como feito")
    .action( (pos) => {
        const json = getJson(todoPath);
        try{
            json[pos].done = true;
            saveJson(todoPath, json);
        } catch (err){
            return console.log(chalk.redBright.bold(`Todo não encontrado`));
        }
        console.log(chalk.green.bold("Status to-do modificado"));
        showTodo(json);
    });

program
    .command('undo <pos>')
    .description('Marca o to-do como não feito')
    .action( (pos) => {
        const json = getJson(todoPath);
        try{
            json[pos].done = false;
            saveJson(todoPath, json);
        } catch (err){
            return console.log(chalk.redBright.bold(`Todo não encontrado`));
        }
        console.log(chalk.green.bold("Status todo modificado"));
        showTodo(json);
    });

program
    .command("list")
    .description("Lista os to-dos")
    .action( () => {
        const json = getJson(todoPath);
        showTodo(json);
    });

program
    .command("clean")
    .description("Limpa todos os to-dos")
    .action( () => {
        cleanTodos("Todos os to-dos foram limpos", "Não existe to-dos");
    });

program
    .command("atl")
    .description("Mostra as atualizações que foram feitas")
    .action( () => {
        console.log(chalk.green.bold(figlet.textSync("Atualizações")));
        console.log(chalk.yellow.bold("Remoção da função de mudar a prioridade"));
    });

program.parse(process.argv);
