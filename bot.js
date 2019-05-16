const Discord = require('discord.js');
const auth = require('./auth.json');
const bot = new Discord.Client();

var request = require('request');
var cheerio = require('cheerio');


bot.on('message', (message) => {

    var flag = /^[ampc!]!/.exec(message.content);



    if (flag) {
        var args = message.content.substring(2);
        var prefix = message.content.substring(0 ,1);
        //console.log(prefix)
        var search_url = "";

        switch (prefix){
          case "!":
            search_url = "https://myanimelist.net/search/all?q="
            break;
          case "a":
            search_url = "https://myanimelist.net/anime.php?q="
            break;
          case "m":
            search_url = "https://myanimelist.net/manga.php?q="
            break;
          case "p":
            search_url = "https://myanimelist.net/people.php?q="
            break;
          case "c":
            search_url = "https://myanimelist.net/character.php?q="
            break;
        }

        //console.log(search_url);


        request(search_url + args, function(error, response, body) {
          if(error) {
            //console.log("Error: " + error);
            message.channel.send('Error');
          }
          //console.log("Status code: " + response.statusCode);

          var $ = cheerio.load(body);


          var div_class = '';

          //if (!(/search/.exec($('title').text()))){
            //prefix = 's'
          //}

          switch (prefix){
            case 'a':
              div_class = "borderClass bgColor0"
              var parent = $('td[class="'+ div_class +'"]')
              var res = parent.find('a').attr('href')
              break;

            case 'm':
              div_class = "borderClass bgColor0"
              var parent = $('td[class="'+ div_class +'"]')
              var res = parent.find('a').attr('href')
              break;

            case 'p':
              div_class = "borderClass"
              var parent = $('td[class="'+ div_class +'"]')
              var res = 'https://myanimelist.net' + parent.find('a').attr('href')

              if (/pictures/.exec(res)){
                res = res.substring(0, res.search('pictures'))
              }

              break;

            case 'c':
              div_class = "borderClass bgColor1"
              var parent = $('td[class="'+ div_class +'"]')
              var res = parent.find('a').attr('href')
              break;

            case '!':
              div_class = "list di-t w100"
              var parent = $('div[class="' + div_class + '"]');
              var res = parent.find('a').attr('href');
              break;

            //case 's':
              //var res = $('link[rel="canonical"]').attr('href');
              //console.log(res);
              //break;
          }

          //console.log(parent);
          //var res = parent.find('div');



          //console.log(res);
          //console.log("Search result " + res);


          request(res, function(error, response, body) {
            if(error) {
              //console.log("Error: " + error);
              message.channel.send('Error');
            }
            //console.log("Status code: " + response.statusCode);

            var $ = cheerio.load(body);

            var final = '';

            //var image = $('div[class="js-scrollfix-bottom"]');
            //var img = image.find('img').attr('src');
            //console.log("Image search result " + img);


            var web_type = res.substring(24)
            web_type = web_type.substring(0, web_type.search('/'))

            switch (web_type){
              case 'anime':
                var title = $('h1')
                var title_res = title.find('span').text()
                final = final + "Title: **" + title_res + "**\n"

                var score = $('div[data-title="score"]').text().trim()
                final = final + "Score: **" + score + "**\n"

                var type = $('span[class="information type"]').text()
                final = final + "Type: **" + type + "**\n"

                var year = $('div[class="spaceit"]').text()
                year = year.substring(year.search('Aired:')+ 6)
                year = year.substring(year.search(/[0-9][0-9][0-9][0-9]/), year.search(/[0-9][0-9][0-9][0-9]/)+ 4)
                final = final + "Year: **" + year + "**\n"

                break;

              case 'manga':
                var title = $('h1')
                var title_res = title.find('span').text()
                final = final + "Title: **" + title_res + "**\n"

                var score = $('div[data-title="score"]').text().trim()
                final = final + "Score: **" + score + "**\n"

                var type = $('span[class="information type"]').text()
                final = final + "Type: **" + type + "**\n"

                var year = $('div[class="js-scrollfix-bottom"]').text()
                year = year.substring(year.search('Published:')+ 10)
                year = year.substring(year.search(/[0-9][0-9][0-9][0-9]/), year.search(/[0-9][0-9][0-9][0-9]/)+4)
                final = final + "Year: **" + year + "**\n"

                break;

              case 'character':
                var title = $('h1').text()
                final = final + "Name: **" + title + "**\n"

                var graphy = $('table')
                var graphy_res = graphy.find('table').find('td[class="borderClass"]').text()
                var graphy_res = graphy_res.substring(0, graphy_res.search('\n'))
                final = final + "From: **" + graphy_res + "**\n"

                break;
            }


            //var studio = $('span[class="information studio author"]').text()
            //final = final + "Studio: **" + studio + "**\n"

            message.channel.send(final +  res);
            //{files: [img]}



          });


        });


     }
});

bot.login(auth.token);
