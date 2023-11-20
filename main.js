/*
Русский:
Создатель: Kredwi
Язык: Русский
Добавьте сами свою рекламу

English:
Creator: Kredwi
Language: Russian
Add your own advertisement yourself.
*/

const { Telegraf, Markup } = require('telegraf'); // Подключаем библиотеку Telegraf
const fs = require('fs'); // Подключаем библиотеку fs(FileSystem) что бы читать films.json
require('dotenv').config(); // Подключение библиотеки dotenv что бы process.env работал

const bot = new Telegraf(process.env.token);
const errorCode = 'Вы ввели неправильный код'; // Сообщение когда код ввели неверно

bot.start(async (ctx) => { // Создаем обработку команды /start
    const sub = await checkSub(ctx); // Проверка подписки
    /*
    Если переменная sub ровна true то выводится сообщение "Введите код фильма:"
    Если же она ровна false то выводится сообщение с ошибкой
    */
    sub ? ctx.reply('Введите код фильма:') : errorSubscribe(ctx);
})

bot.on('message', async (ctx) => {
    try {

    } catch (error) {
        
    }
    const sub = await checkSub(ctx);
    if (sub) { // Проверка если sub будет равен (==) true то выполнится код в if
        var films = fs.readFileSync('./films.json', 'utf-8'); // Чтение файла films.json
        films = JSON.parse(films); // Изменении значения переменной films
        if (films[ctx.message.text]) { // Проверка есть ли введеный код в файле films.json
            const caption = `
Название: <b>${films[ctx.message.text].name}</b> (<b>${films[ctx.message.text].year}</b>)
Описание: <b>${films[ctx.message.text].description}</b>`; // Объявление переменной с содержимым фильма
            ctx.replyWithPhoto(
                films[ctx.message.text].image,
                {
                    caption, // Вывод текста который в переменной "caption"
                    parse_mode: 'HTML' // Установка парсера в режим HTML (что бы HTML теги работали)
                }
            ); // Отправка фото которое было преклепленно в films.json
        }
        else ctx.reply(errorCode); // Ошибка если код не найден
    } else 
        errorSubscribe(ctx); // Ошибка если не подписан на канал
})

bot.launch(); // Запуск бота

function errorSubscribe(ctx) { // Переменная для обработки ошибки
    ctx.replyWithHTML('Вы не подписаны на канал', // Вывод самой ошибки
    Markup.inlineKeyboard([
        { text: 'ПОДПИСАТЬСЯ', url: process.env.urlChannel } // Вывод кнопки что бы подписаться на какой-то канал
    ]))
}

const checkSub = async (ctx) => { // Фукнция проверки подписки
    const usersChannelSubscribe = await bot.telegram.getChatMember(process.env.channel, ctx.from.id); // получение всех подписчиков в Канале
    const SubscribeStatus = usersChannelSubscribe.status; // Обращение к объекту status
    if (
        SubscribeStatus != 'left' && // Если статус не равен "Выход" то код выполнится
        SubscribeStatus != 'kicked' // Если статус не равен "Кикнут" то код выполнится
    )
        return true; // Возращется true если все правильно
    else return false; // Возращется false если человек не подписан
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));