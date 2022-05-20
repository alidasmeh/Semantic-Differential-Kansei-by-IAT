// the architecture of this code is procedural 
// there is no await async in this code

let global_data = null;
let results = [];

let current_trial_number = 0;
let current_image_number = -1;
let current_image = null;
let timer_beginning = 0;

function loading_data() {
    let partNumber = Number(prompt(`بخش اول یا دوم؟`));
    if (partNumber != 1 && partNumber != 2) return alert('Stopped');

    $.get(
        `data_part${partNumber}.json`,
        function(response) {
            randomizing_data(response)
        }
    )
}

function randomizing_data(data) {
    // let first_time = [...shuffle(data.images)];
    // let second_time = [...shuffle(data.images)];
    // let third_time = [...shuffle(data.images)];

    // data.images = first_time.concat(second_time, third_time)

    data.images = shuffle(data.images.concat(data.images, data.images));
    data.words = shuffle(data.words);

    global_data = data;
}

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}

loading_data();

document.addEventListener('keydown', function(event) {
    let duration = Date.now() - timer_beginning;

    let temp = {
        image: current_image,
        duration,
    }

    if (event.keyCode == 37) {
        // left
        temp["word"] = $("#word2").text();
        results.push(temp);

        $("#imagebox").html("+")
        setTimeout(function() {
            show_image();
        }, global_data.times.waiting_slides);

    } else if (event.keyCode == 39) {
        // right
        temp["word"] = $("#word1").text();
        results.push(temp);

        $("#imagebox").html("+")
        setTimeout(function() {
            show_image();
        }, global_data.times.waiting_slides);
    }

    if (event.keyCode == 32) {
        start();
        return
    }


});

function start() {
    // crearting a trial : 2 words, all images (3 times)
    $("#word1").text(global_data.words[current_trial_number].word_one)
    $("#word2").text(global_data.words[current_trial_number].word_two)
    $("#imagebox").text("+")

    setTimeout(function() {
        show_image()
    }, global_data.times.resting_between_trials)

}

function show_image() {
    // console.log("current_trial_number", current_trial_number)

    if (current_image_number < global_data.images.length - 1) {
        current_image_number++;
        // console.log("current_image_number", current_image_number)

        current_image = global_data.images[current_image_number];
        timer_beginning = Date.now();
        $("#imagebox").html(`<img src='data/${global_data.images[current_image_number]}' width="100%" />`)

    } else {
        current_image_number = -1;
        current_trial_number++;
        if (current_trial_number < global_data.words.length) {
            start();
        } else {
            finished();
        }
    }
}

function finished() {
    let report = [];

    global_data.images.forEach(image => {
        global_data.words.forEach(pair_word => {
            let array_word_one = [];
            let array_word_two = [];

            results.forEach(result => {
                if (result.image == image) {
                    if (result.word == pair_word.word_one) array_word_one.push(result.duration);
                    if (result.word == pair_word.word_two) array_word_two.push(result.duration);
                }
            })

            let total_word_one = 0;
            array_word_one.forEach(num => { total_word_one += num })
            if (array_word_one.length != 0) total_word_one = parseInt(total_word_one / array_word_one.length);

            let total_word_two = 0;
            array_word_two.forEach(num => { total_word_two += num })
            if (array_word_two.length != 0) total_word_two = parseInt(total_word_two / array_word_two.length);

            report.push({
                image,
                pair_word,
                avg_word_one: total_word_one,
                avg_word_two: total_word_two,
                tendency: calc_tendency(total_word_two, total_word_one, pair_word)
            })
        })
    })


    const uniqueArray = report.filter((value, index) => {
        const _value = JSON.stringify(value);
        return index === report.findIndex(obj => {
            return JSON.stringify(obj) === _value;
        });
    });

    console.log(uniqueArray);
    // not normilized

    console.log(JSON.stringify(global_data));
    console.log(JSON.stringify(uniqueArray));

    alert("سپاس.");
}

function calc_tendency(avg_word_two, avg_word_one, pair_word) {
    if (avg_word_one == 0) return `word '${pair_word.word_two}' is target. confidence : ${100} `;
    if (avg_word_two == 0) return `word '${pair_word.word_one}' is target. confidence : ${100} `;

    if (avg_word_two > avg_word_one) {
        // tendency : word_one (avg for word one is samller)
        let confidence = 100 - parseInt((avg_word_one / avg_word_two) * 100);
        return `word '${pair_word.word_one}' is target. confidence : ${confidence} `;
    }

    if (avg_word_two < avg_word_one) {
        // tendency : word_two (avg for word two is larger)
        let confidence = 100 - parseInt((avg_word_two / avg_word_one) * 100);
        return `word '${pair_word.word_two}' is target. confidence : ${confidence} `;
    }

    return "suspected to word averages.";
}