/*
Name: Chrome Extension inspired by the Momentum plugin.
Date: 10/14/2019
Description: Handles all scripting functions for the dashboard
setting user cookies, handling transitioning elements, and interacting with Web APIs.

@Author Elias Afzalzada
Copyright © Elias Afzalzada - All Rights Reserved
*/

// Main script flow starts here
$(document).ready(function () {
    let username = getCookie('username');

    // Check cookie to determine returning or new user then determine program flow.
    if (username) {
        setTimeElement();
        returningUser();
    } else {
        getBackgroundImage();
        setTimeElement();
        fadeInNewUserElements();
    }

    // Listen for user enter keypress and set new user cookie.
    $('.user_name').keypress(function (e) {
        if (e.which == 13) {
            let username = e.target.value;
            if (!username) return;
            fadeInUserElements(username);
            setQuote();
            // 4380 expire is 6 months (1 month = 730 hours)
            setCookie('username', username, 4380);
        }
    });
});

// Fade in stored users elements such as quote/background.
function returningUser() {
    let username = getCookie("username");
    let photo_url = getCookie("photo_url");
    let photo_author_url = getCookie("photo_author_url");
    let photo_author = getCookie("photo_author");
    let quote = getCookie("quote");
    let quote_author = getCookie("quote_author");

    if (!photo_url || !photo_author || !photo_author_url || !quote || !quote_author) {
        getBackgroundImage();
        setQuote();
    }

    $(".time").show();
    $(".top .left ").show();
    $(".top .right").show();

    $('.photoLink').html("Photo by: " + photo_author);
    $('.photoLink').attr('href', photo_author_url);
    $('body').css('background-image', `url(${photo_url})`);
    $('.quote').css('display', 'inline-block');
    $('.quote').html("\"" + quote + "\"" + " - " + quote_author);

    $('.greeting').css('display', 'inline-block');
    $('.user_name').css('display', 'none');
    $('.greeting').html('Hello there, ' + username + '.');
}

// Fade in welcome screen to non-stored users.
function fadeInNewUserElements() {
    let fadeInTime = 2000;

    setTimeElement();
    $('.greeting').html(`Hi there, what's your name?`);

    $(function () {
        $(".time").hide().fadeIn(fadeInTime);
        $(".greeting").hide().fadeIn(fadeInTime);
        $(".user_name").hide().fadeIn(fadeInTime);
        $(".top .left ").hide().fadeIn(fadeInTime);
        $(".top .right").hide().fadeIn(fadeInTime);
    });
}

// Fade in new users elements and quote/background.
function fadeInUserElements(username) {
    let fadeInTime = 1000;
    let fadeOutTime = 500;

    $(function () {
        $('.greeting').fadeOut(fadeOutTime);

        // to prevent user from seeing updated text before its done fading out
        window.setTimeout(function () {
            $('.greeting').html("Enjoy the plugin, " + username + "!");
        }, fadeOutTime);

        $('.greeting').fadeIn(fadeInTime);
        $('.user_name').fadeOut(fadeOutTime);
        $('.quote').fadeIn(fadeInTime * 3);
    });
}

// Set time for clock element.
function setTimeElement() {
    //current time
    setCurrentTime();
    setInterval(function () {
        setCurrentTime();
        //update every 10 seconds;
    }, 10 * 1000);
}

// Grab quote from forimsatic api and set html element.
function setQuote() {
    // proxy to get around cors bug?
    let proxy = 'https://cors-anywhere.herokuapp.com/';
    let url = proxy + 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    $.get(url, function (dataJson) {
        let quote = dataJson.quoteText;
        let quote_author = dataJson.quoteAuthor;

        if (!quote_author) {
            quote_author = "Unknown";
        }

        $('.quote').html("\"" + quote + "\"" + " - " + quote_author);

        setCookie("quote", quote, 1);
        setCookie("quote_author", quote_author, 1);
    });
}

// Grabs featured background image from Unsplash api and sets background.
function getBackgroundImage() {
    if (!IMAGE_KEYS.ACCESS_KEY) {
        alert("Unspash Access key is out of date");
        return;
    }

    let url = 'https://api.unsplash.com/photos/random?featured&orientation=landscape&client_id='
        + IMAGE_KEYS.ACCESS_KEY;
    $.get(url, function (dataJson) {
        let photo_url = dataJson.urls.raw;
        let photo_author = dataJson.user.name;
        let photo_author_url = dataJson.user.links.html;

        // to prevent staggered loading of image from url
        let img = new Image();
        img.onload = function () {
            $('body').css('background-image', `url(${photo_url})`);
            $('.photoLink').html("Photo by: " + photo_author);
            $('.photoLink').attr('href', photo_author_url);
        };
        img.src = photo_url;

        setCookie("photo_url", photo_url, 1);
        setCookie("photo_author", photo_author, 1);
        setCookie("photo_author_url", photo_author_url, 1);
    });
}

// Gets and Sets current time.
function setCurrentTime() {
    // let is in scope of the brackets
    let now = new Date();
    // 24 hour to 12 hour conversion
    let hours = (now.getHours() % 12) || 12;
    let minutes = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    $('.time').html(hours + ":" + minutes);
    $('.date').html(now.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }));
}

// Sets cookies for whatever needing to be stored.
function setCookie(cookieName, cookieValue, expireHours) {
    let currentTime = new Date();
    currentTime.setTime(currentTime.getTime() + expireHours * 3600 * 1000);
    let expires = "expires=" + currentTime.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

// Retrieves stored cookies
function getCookie(cookieName) {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}