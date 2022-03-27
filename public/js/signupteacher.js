var slideIndex = 1;
var previous = document.getElementById("previous");
var next = document.getElementById("next");
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides((slideIndex += n));
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides((slideIndex = n));
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("my-carousel-item");
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
    if (slideIndex === 1) {
        previous.innerHTML =
            '<button type="button" class="btn btn-primary" onclick="plusSlides(-1)" disabled>Previous</button>';
    } else {
        previous.innerHTML =
            '<button type="button" class="btn btn-primary" onclick="plusSlides(-1)">Previous</button>';
    }
    if (slideIndex === 10) {
        next.innerHTML =
            '<button type="submit" class="btn btn-primary">Submit</button>';
    } else {
        next.innerHTML =
            '<button type="button" class="btn btn-primary" onclick="plusSlides(1)">Next</button>';
    }
}