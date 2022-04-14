// the architecture of this code is procedural 
// there is no await async in this code

let global_data = null;
let results = [];

let current_trial_number = 0;
let current_image_number = -1;
let current_image = null;
let timer_beginning = 0;

function loading_data() {
    $.get(
        "data.json",
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
        temp["word"] = $("#word2").text();
        results.push(temp);

        $("#imagebox").html("+")
        setTimeout(function() {
            show_image();
        }, global_data.times.waiting_slides);

    } else if (event.keyCode == 39) {
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
    console.log("current_trial_number", current_trial_number)

    if (current_image_number < global_data.images.length - 1) {
        current_image_number++;
        console.log("current_image_number", current_image_number)

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
    console.log(JSON.stringify(global_data));
    console.log(JSON.stringify(results));

    alert("سپاس.");
}