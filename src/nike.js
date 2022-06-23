const axios = require("axios");
const cheerio = require("cheerio");

function search_jordan(html) {
    let data = [];
    const $ = cheerio.load(html);
    $("figure").each(function (i, item) {
        let titulo = $(this).find(".product-card__title").text();
        let subtitulo = $(this).find(".product-card__subtitle").text();
        let precio = $(this).find(".product-price").text();
        let link = $(this).find(".product-card__link-overlay").attr('href');
        data.push({
            'link': link,
            'message': `${titulo}\n${subtitulo}\n${precio}\n${link}`
        });
    });
    return data;
};

function search_upcoming(html) {
    let data = [];
    const $ = cheerio.load(html);
    $("figure.d-md-h").each(function (i, item) {
        let fecha = ($(this).find(".available-date-component").text()).replaceAll("a las 16:00", "a las 11:00");
        let nombre = $(this).find(".headline-5").text();
        let url = 'https://www.nike.com' + ($(this).find("a.card-link").attr('href')).replaceAll('us/es', 'mx');
        if (nombre[0] == ' ') {
            nombre = nombre.substring(1, 100);
        } else {
            let index = nombre.indexOf(' ', 4);
            nombre = [nombre.slice(0, index), " -", nombre.slice(index)].join('');
        }
        data.push({
            'link': url,
            'message': `Upcoming\n${nombre}\n${fecha}\n${url}`
        });
    });
    return data;
};

exports.jordan = async function () {
    const res = await axios.get('https://www.nike.com/mx/w?q=air%20jordan%201&vst=air%20jordan%201');
    const { data } = await res;
    return search_jordan(data);
};

exports.upcoming = async function () {
    const res = await axios.get('https://www.nike.com/mx/launch?s=upcoming')
    const {data} = await res;
    return search_upcoming(data);
};