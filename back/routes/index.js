var express = require('express');
const { type } = require('express/lib/response');
const { raw } = require('mysql');
var router = express.Router();
let db = require("../db/connection");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/rt/:fullname', async function(req, res, next) {

    let query = `SELECT * FROM normalized2022june06 WHERE fullname='${req.params.fullname}' `
    if (req.params.fullname == "all") {
        query = `SELECT * FROM normalized2022june06 `
    }

    let rows = await db.query(query)


    let counter = 0;
    let all_counter = 0;
    let finalString = "";
    rows.forEach(row => {
        JSON.parse(row.raw).forEach(raw => {
            if (raw.duration > 3000) counter++;
            all_counter++;
            finalString += `${raw.duration} <br/>`;
        })
    })

    res.send(`larger than 3000 : ${counter} <br/> 
                all : ${all_counter}<br/> 
                Percentage : ${counter/all_counter} <hr/> 
                ${finalString} `)

});

router.get("/counting_smaller_and_larger/:treshold", async function(req, res) {

    let rows = await db.query(`SELECT * FROM main`);

    let just_rts = [];

    rows.forEach(row => {
        let temp = [];
        JSON.parse(row.raw).forEach(raw_row => {
            temp.push(raw_row['duration']);
        })

        just_rts.push(temp)
    })

    let final = [];
    just_rts.forEach(row => {

        let larger_than_2_seconds = row.filter(rt => rt > req.params.treshold)
        let smaller_than_2_seconds = row.filter(rt => rt < req.params.treshold)

        let temp = {
            // larger_than_2_seconds: larger_than_2_seconds.length,
            larger_than_2_seconds_percent: (larger_than_2_seconds.length / row.length * 100).toFixed(0),
            // smaller_than_2_seconds: smaller_than_2_seconds.length,
            smaller_than_2_seconds_percent: (smaller_than_2_seconds.length / row.length * 100).toFixed(0),
        }

        final.push(temp);
    })

    let larger_than_x_seconds_percent_average = final.reduce(sum_larger, 0) / final.length;
    let smaller_than_x_seconds_percent_average = final.reduce(sum_smaller, 0) / final.length;

    let finalString = '';

    finalString += `larger_than_x_seconds_percent: ` + larger_than_x_seconds_percent_average
    finalString += "<br/>";
    finalString += `smaller_than_x_seconds_percent: ` + smaller_than_x_seconds_percent_average

    res.send(finalString)

})

function sum_larger(total, num) {
    return total + Number(num['larger_than_2_seconds_percent'])
}

function sum_smaller(total, num) {
    return total + Number(num['smaller_than_2_seconds_percent'])
}


router.get('/get_all_rt_grouped_by_person', async function(req, res, next) {
    let fullname_and_rts_array = [];

    let persons = await db.query(`SELECT DISTINCT fullname FROM normalized `);

    for (let person of persons) {
        let rows = await db.query(`SELECT * FROM main WHERE fullname='${person['fullname']}'`)

        let RTs = [];

        rows.forEach(row => {
            JSON.parse(row['raw']).forEach(rt => {
                RTs.push(rt['duration'])
            })
        })

        fullname_and_rts_array.push({
            fullname: person['fullname'],
            rts: RTs
        })
    }

    let csv = "";
    fullname_and_rts_array.forEach(row => {
        csv += `, ${row['fullname']}`
    })
    csv += `<br/>`;

    for (let count = 0; count < fullname_and_rts_array[0]['rts'].length; count++) {
        let line = '';
        fullname_and_rts_array.forEach(row => {
            line += `, ${row["rts"][count]}`
        })
        csv += `${line} <br/>`;
    }


    res.send(csv);
});

router.get('/get_all_score_groupby_person', async function(req, res, next) {
    let fullname_and_scores_array = [];

    let tableName = 'normalized';

    let persons = await db.query(`SELECT DISTINCT fullname FROM ${tableName} `);


    for (let person of persons) {
        let rows = await db.query(`SELECT * FROM ${tableName} WHERE fullname='${person['fullname']}'`)

        let scores = [];

        rows.forEach(row => {
            JSON.parse(row['result']).forEach(row => {
                scores.push(row['score'])
            })
        })

        fullname_and_scores_array.push({
            fullname: person['fullname'],
            scores: scores
        })
    }

    let csv = "";
    fullname_and_scores_array.forEach(row => {
        csv += `${row['fullname']}, `
    })
    csv += `<br/>`;

    for (let count = 0; count < fullname_and_scores_array[0]['scores'].length; count++) {
        let line = '';
        fullname_and_scores_array.forEach(row => {
            line += `${row["scores"][count]}, `
        })
        csv += `${line} <br/>`;
    }


    res.send(csv);
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

router.get("/avg_score_per_product_per_adjective", async function(req, res) {

    try {
        let tableName = 'normalized2022june06';
        let records = await db.query(`SELECT * FROM ${tableName}`);
        let avg_scores = [];

        product_and_adjectives_list.images.forEach(image => {
            product_and_adjectives_list.words.forEach(word => {
                let total_score = 0;
                let number_of_scores = 0;

                records.forEach(record => {
                    let results = JSON.parse(record['result']);
                    results.forEach(trial => {
                        if (trial.image == image && trial.pair_word.word_one == word.word_one) {
                            total_score += trial.score;
                            number_of_scores++;
                        }
                    })
                })

                avg_scores.push({
                    image,
                    word: `${word.word_one} - ${word.word_two}`,
                    avg_score: (total_score / number_of_scores * 100).toFixed(0)
                })
            })
        })

        let csv = '';

        // crearting header 
        let header = '';
        product_and_adjectives_list.words.forEach(word => {
            header += `, ${word.word_one}-${word.word_two}`;
        })

        // crearing rows
        product_and_adjectives_list.images.forEach(image => {
            let row = image;
            avg_scores.forEach(avg_score => {
                if (avg_score.image == image) {
                    row += ", " + avg_score.avg_score
                }
            })

            csv += row + `<br/>`;
        })

        // combining
        csv = header + "<Br/>" + csv;

        res.send(csv)
    } catch (err) {
        res.send(`CATCH : ${err}`)
    }
})

router.get('/normalizing', async function(req, res, next) {

    try {
        let rows = await db.query(`SELECT * FROM main ORDER BY id ASC`);

        rows.forEach(async function(row) {
            let results = JSON.parse(row['raw']);

            let report = [];

            product_and_adjectives_list.images.forEach(image => {
                product_and_adjectives_list.words.forEach(pair_word => {
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

            let normilized_data = normilizeing(uniqueArray);

            let with_score_data = calc_data(normilized_data)

            with_score_data = with_score_data.filter(row => {
                if (row.avg_word_one == 0 && row.avg_word_two == 0) {

                } else {
                    return row;
                }
            })

            try {
                let result = await db.query(`INSERT INTO normalized(fullname, date, result, part, raw) VALUES ("${row.fullname}", "${row.date}", '${JSON.stringify(with_score_data)}', "${row.part}", '${JSON.stringify(row.raw)}')`);

                if (result) {
                    console.log({ status: true, error: [`row id : ${result.insertId}`] })
                } else {
                    console.log({ status: false, error: ['problem to insert data to db'] })
                }

            } catch (err) {
                res.status(500).send("catch 2 => ", err)
            }
        })

        res.status(200).send(`normilized`);
    } catch (err) {
        res.status(500).send("catch 1 => ", err)
    }


});

function normilizeing(raw_data) {

    // raw_data.forEach(row => {
    //     let limit = 1000;
    //     // curveing the large RTs 
    //     if( row.avg_word_one > limit ) row.avg_word_one = limit;
    //     if( row.avg_word_two > limit ) row.avg_word_two = limit;

    // })

    // finding max and min AVERAGE REACTIN TIME (pay attention!!!!!)
    let max_time = 0
    let min_time = Number.POSITIVE_INFINITY // 100 seconds

    raw_data.forEach(row => {
        if (max_time < row.avg_word_one) max_time = row.avg_word_one
        if (max_time < row.avg_word_two) max_time = row.avg_word_two

        if (min_time > row.avg_word_one && row.avg_word_one != 0) min_time = row.avg_word_one
        if (min_time > row.avg_word_two && row.avg_word_two != 0) min_time = row.avg_word_two
    })

    // console.log(max_time, min_time)

    raw_data.forEach(row => {
        // // dropping large RT 
        // if( row.avg_word_one > 1000 || row.avg_word_two > 1000 ){
        //     row.avg_word_one = 0;
        //     row.avg_word_two = 0;
        
        // // end dropping large RT
        // }else{

        // }

        let awo = row.avg_word_one
        row.avg_word_one = ((row.avg_word_one - min_time) / (max_time - min_time));
        if (row.avg_word_one < 0) {
            // if avg_word_x is zero, the result of the above formula is a negative number, it makes it equal to zero.
            row.avg_word_one = 0
        } else {
            row.avg_word_one = 1 - row.avg_word_one;
        }

        let awt = row.avg_word_two
        row.avg_word_two = ((row.avg_word_two - min_time) / (max_time - min_time));
        if (row.avg_word_two < 0) {
            // if avg_word_x is zero, the result of the above formula is a negative number, it makes it equal to zero.
            row.avg_word_two = 0
        } else {
            row.avg_word_two = 1 - row.avg_word_two;
        }

        console.log(`max_time, min_time = `, max_time , min_time , `    ==> max_time - min_time = `, (max_time - min_time))
        console.log(`avg rt one = `, (awo), `      => calculated score word one : `, row.avg_word_one)
        console.log(`avg rt tow = `, (awt), `      => calculated score word two : `, row.avg_word_two)
        console.log(`calculated score = `, (row.avg_word_two))
        console.log(`_________________________________________________________________________________________________________`)
        
    })

    return raw_data;
}

function calc_data(raw_data) {
    raw_data.forEach(row => {
        row['score'] = Number((row.avg_word_two - row.avg_word_one).toFixed(2))
    })

    return raw_data
}
module.exports = router;