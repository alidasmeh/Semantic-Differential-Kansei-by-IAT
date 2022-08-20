var express = require('express');
const { type } = require('express/lib/response');
const { raw } = require('mysql');
var router = express.Router();
let db = require("../db/connection");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

let product_and_adjectives_list = {
    "times": {
        "resting_between_trials": 15000,
        "presenting_time": 1500
    },
    "images": [
        "a1b1c1.jpeg",
        "a1b1c2.jpeg",
        "a1b2c1.jpeg",
        "a1b2c2.jpeg",
        "a1b3c1.jpeg",
        "a1b3c2.jpeg",
        "a2b1c2.jpeg",
        "a2b2c1.jpeg",
        "a2b2c2.jpeg"
    ],
    "words": [{
            "word_one": "رسمی",
            "word_two": "خودمانی"
        },
        {
            "word_one": "زشت",
            "word_two": "زیبا"
        },
        {
            "word_one": "فکستنی",
            "word_two": "شیک"
        },
        {
            "word_one": "شکننده",
            "word_two": "مقاوم"
        },
        {
            "word_one": "آرامش بخش",
            "word_two": "تنش زا"
        },
        {
            "word_one": "کلاسیک",
            "word_two": "مدرن"
        },
        {
            "word_one": "فِیک",
            "word_two": "اصیل"
        },
        {
            "word_one": "زمخت",
            "word_two": "ظریف"
        },
        {
            "word_one": "تزئینی",
            "word_two": "کاربردی"
        },
        {
            "word_one": "بدشکل",
            "word_two": "چشم نواز"
        },
        {
            "word_one": "طراحی اصولی",
            "word_two": "طراحی غیر حرفه‌ای"
        }
    ]
}

router.get('/normalizing', async function(req, res, next) {
    
    try {

        let persons = await db.query(`SELECT DISTINCT fullname FROM main `);

        persons.forEach(async function (person){
            let rows = await db.query(`SELECT * FROM main WHERE fullname = '${person.fullname}' ORDER BY id ASC`);

            let results = JSON.parse(rows[0].raw).concat(JSON.parse(rows[1].raw))
            // console.log(person.fullname,": ",results.length)

            let report = [];

            product_and_adjectives_list.images.forEach(image => {
                product_and_adjectives_list.words.forEach((pair_word) => {
                    let array_word_one = [];
                    let array_word_two = [];

                    results.forEach(result => {
                        if (result.image == image) {
                            if (result.word == pair_word.word_one) array_word_one.push(result.duration);
                            if (result.word == pair_word.word_two) array_word_two.push(result.duration);
                        }
                    })

                    // calc average word one 
                    let total_word_one = 0;
                    array_word_one.forEach(num => { total_word_one += num })
                    if (array_word_one.length != 0) total_word_one = parseInt(total_word_one / array_word_one.length);

                    // calc average word two 
                    let total_word_two = 0;
                    array_word_two.forEach(num => { total_word_two += num })
                    if (array_word_two.length != 0) total_word_two = parseInt(total_word_two / array_word_two.length);

                    report.push({
                        image,
                        pair_word,
                        avg_word_one: total_word_one,
                        avg_word_two: total_word_two,
                    })

                })
            })

            const uniqueArray = report.filter((value, index) => {
                const _value = JSON.stringify(value);
                return index === report.findIndex(obj => {
                    return JSON.stringify(obj) === _value;
                });
            });

            find_min_max_rt_for_every_pair_words(uniqueArray)

            let normalized = normilizeing(uniqueArray)

            try {
                let result = await db.query(`INSERT INTO normalized(fullname, date, result, part, raw) VALUES ("${person.fullname}", "${new Date()}", '${JSON.stringify(normalized)}', "0", '${JSON.stringify(results)}')`);
                if (result) {
                    console.log({ status: true, error: [`row id : ${result.insertId}`] })
                } else {
                    console.log({ status: false, error: ['problem to insert data to db'] })
                }

            } catch (err) {
                // res.status(500).send("catch 2 => ", err)
                console.log(err)
            }

        })

        res.status(200).send(`normilized`);
    }catch(err){
        res.status(500).send("catch => ", err)
        
    }

});

function find_min_max_rt_for_every_pair_words(uniqueArray){
    let counter = 0
    let word_with_rt_min_max = [];

    product_and_adjectives_list.words.forEach(pair_word=>{
        let min_time = 1000000000
        let max_time = 0;

        uniqueArray.forEach(element=>{
            if( JSON.stringify(pair_word) == JSON.stringify(element.pair_word)){
                if (max_time < element.avg_word_one) max_time = element.avg_word_one
                if (max_time < element.avg_word_two) max_time = element.avg_word_two

                if (min_time > element.avg_word_one && element.avg_word_one != 0) min_time = element.avg_word_one
                if (min_time > element.avg_word_two && element.avg_word_two != 0) min_time = element.avg_word_two
            }
        })

        let temp = pair_word
        temp.min_time = min_time
        temp.max_time = max_time

        word_with_rt_min_max.push(temp)
    })
    
    return word_with_rt_min_max
}

function normilizeing(uniqueArray) {
    uniqueArray.forEach(element =>{
        // let score_word_one = 1 - ((element.avg_word_one - element.pair_word.min_time)/(element.pair_word.max_time - element.pair_word.min_time));
        // let score_word_two = 1 - ((element.avg_word_two - element.pair_word.min_time)/(element.pair_word.max_time - element.pair_word.min_time));
        
        let score_word_one = ((element.avg_word_one - element.pair_word.min_time) / (element.pair_word.max_time - element.pair_word.min_time));
        if (element.avg_word_one <= 0) {
            // if avg_word_x is zero, the result of the above formula is a negative number, then below code makes it equal to zero.
            score_word_one = 0
        } else {
            score_word_one = 1 - score_word_one;
        }

        let score_word_two = ((element.avg_word_two - element.pair_word.min_time) / (element.pair_word.max_time - element.pair_word.min_time));
        if (element.avg_word_two <= 0) {
            // if avg_word_x is zero, the result of the above formula is a negative number, then below code makes it equal to zero.
            score_word_two = 0
        } else {
            score_word_two = 1 - score_word_two;
        }

        // word_two is always positive and word_one is always negative
        let score = Number((score_word_two - score_word_one).toFixed(2));

        // console.log(element.pair_word.min_time, " - ",element.pair_word.max_time," -- ");
        // console.log(element.avg_word_one, " => ",score_word_one)
        // console.log(element.avg_word_two, " => ",score_word_two)
        // console.log( "score  =======> ",score)
        // console.log(`________________________________________________`)

        element.score = score;
    })

    return uniqueArray
}
module.exports = router;