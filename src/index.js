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

program
    .command("add <to-do>")
    .description("Adiciona um to-do")
    .action( (todo) => {
        const data = getJson(todoPath);
        data.push({
            title: todo,
            done: false
        })
        saveJson(todoPath, data);
        console.log(`${chalk.green.bold("To-do adicionado")}`);
    })

function showTodo(data) {
    const table = new Table({
        head: [chalk.blue.bold("Id"), chalk.blue.bold("Todo"), chalk.blue.bold("Pendente")],
        colWidths: [15, 15, 15]
    })
    data.map( (todo, index) => { 
        table.push([index, todo.title, todo.done ? chalk.green.bold("Concluido") : chalk.yellow.bold("Pendente")]);
    })
    console.log(table.toString());
}

program
    .command("list")
    .description("Lista os to-dos")
    .action( () => {
        const data = getJson(todoPath);
        showTodo(data);
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
                console.log(chalk.red.bold("Não existe to-dos"));
            }
        })
    })

program
    .command("do <todo>")
    .description("Marca o to-do como feito")
    .action( (todo) => {
        const data = getJson(todoPath);
        data[todo].done = true;
        saveJson(todoPath, data);
        console.log(chalk.green.bold("Status to-do modificado"));
        showTodo(data);
    })

program
    .command('undo <todo>')
    .description('Marca o to-do como não feito')
    .action( (todo) => {
        const data = getJson(todoPath);
        data[todo].done = false;
        saveJson(todoPath, data);
        console.log(chalk.green.bold("Status todo modificado"));
        showTodo(data);
    });


program.parse(process.argv);
