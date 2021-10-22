#! /usr/bin/env node

const program = require("commander");
const {join} = require("path");
const fs = require("fs");
const package = require("../package.json");
const chalk = require("chalk");
const Table = require("cli-table");

const todoPath = join(__dirname + "/todo", "todos.json");

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
        head: [chalk.blue.bold("Posição"), chalk.blue.bold("Todo"), chalk.blue.bold("Prioridade"), chalk.blue.bold("Descrição"), chalk.blue.bold("Pendente")],
        colWidths: [15, 15, 15, 35, 15]
    })
    json.map( (todo, index) => { 
        table.push([index, todo.title, chalk.yellow.bold(todo.prd), todo.desc, todo.done ? chalk.green.bold("Concluido") : chalk.yellow.bold("Pendente")]);
    })
    console.log(table.toString());
}

program
    .command("add <to-do>")
    .description("Adiciona um to-do")
    .option("-p, --prioridade <prioridade>, Prioridade do to-do")
    .action( (todo, opt) => {
        const json = getJson(todoPath);

        const optionString = String(opt['prioridade']);

        if (optionString == "undefined"){
            json.push({
                title: todo,
                prd: "Normal",
                desc: "NT",
                done: false
            })
        } else{
            json.push({
                title: todo,
                prd: optionString,
                desc: "NT",
                done: false
            })
        }
       
        saveJson(todoPath, json);
        console.log(`${chalk.green.bold("To-do adicionado")}`);
        showTodo(json)
    })

program
    .command("prd <pos> <prioridade>")
    .description("Muda a prioridade do to-do")
    .action( (pos, prd) => {
        const json = getJson(todoPath);
        json[pos].prd = prd;
        saveJson(todoPath, json);
        console.log(chalk.green.bold("Prioridade modificada"));
        showTodo(json);
    })

program
    .command("desc <pos> <descrição>")
    .description("Adiciona uma descrição ao to-do")
    .action( (pos, desc) => {
        const json = getJson(todoPath);
        json[pos].desc = desc;
        let tamanho =  () => {
            console.log()
        }
        saveJson(todoPath, json);
        console.log(chalk.green.bold("Descrição alterada"));
        showTodo(json);
    })

program
    .command("do <pos>")
    .description("Marca o to-do como feito")
    .action( (pos) => {
        const json = getJson(todoPath);
        try{
            json[pos].done = true;
            saveJson(todoPath, json);
        } catch (err){
            return console.log(chalk.redBright.bold(`Todo não encontrado`))
        }
        console.log(chalk.green.bold("Status to-do modificado"));
        showTodo(json);
    })

program
    .command('undo <pos>')
    .description('Marca o to-do como não feito')
    .action( (pos) => {
        const json = getJson(todoPath);
        try{
            json[pos].done = false;
            saveJson(todoPath, json);
        } catch (err){
            return console.log(chalk.redBright.bold(`Todo não encontrado`))
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
    })

program
    .command("clean")
    .description("Limpa TO-DOS os todos")
    .action( () => {
        fs.unlink(todoPath, (err) => {
            try{
                if (err) throw (err);
                console.log(chalk.green.bold("Todos os to-dos foram limpos"));
            } catch (err){
                console.log(chalk.redBright.bold("Não existe to-dos"));
            }
        })
    })

program.parse(process.argv);
