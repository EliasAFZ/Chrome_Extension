/*
Name: Chrome Extension inspired by the Momentum plugin.
Date: 10/14/2019
Description:

@Author Elias Afzalzada
Copyright © Elias Afzalzada - All Rights Reserved
*/


$(document).ready(function () {
    let username = getCookie('username');

    //check cookie
    if (username) {
        setTimeElement();
        returningUser();
    } else {
        getBackgroundImage();
        setTimeElement();
        fadeInWelcomeElements();
    }

    // Listen for user enter keypress and set cookie/quote
    $('.user_name').keypress(function (e) {
        if (e.which == 13) {
            let username = e.target.value;
            if (!username) return;
            fadeInUserElements(username);
            setQuote();
            //TODO: set later expire time
            setCookie('username', username, 0);
        }
    });
});

function returningUser() {
    let photo_url = getCookie("photo_url");
    let photo_author_url = getCookie("photo_author_url");
    let photo_author = getCookie("photo_author");
    let quote = getCookie("quote");

    if (!photo_url || !photo_author || !photo_author_url) {
        getBackgroundImage();
    } else {
        $('.photoLink').html("Photo by: " + photo_author);
        $('.photoLink').attr('href', photo_author_url);
        $('body').css('background-image', `url(${photo_url})`);
        $('.quote').css('display', 'inline-block');
        $('.quote').html(quote);

        $('.greeting').css('display', 'inline-block');
        $('.user_name').css('display', 'none');
        $('.greeting').html(`Hello there, <span class="stored-name">username</span>.`);
    }
}

function fadeInWelcomeElements() {
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


function setTimeElement() {
    //current time
    setCurrentTime();
    setInterval(function () {
        setCurrentTime();
        //update every 10 seconds;
    }, 10 * 1000);
}

function setQuote() {
    // proxy to get around cors bug?
    let proxy = 'https://cors-anywhere.herokuapp.com/';
    let url = proxy + 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    $.get(url, function (dataJson) {
        let quote = dataJson.quoteText;
        let quote_author = dataJson.quoteAuthor;

        $('.quote').html("\"" + quote + "\"" + " - " + quote_author);

        setCookie("quote", quote, 1);
    });
}


function getBackgroundImage() {
    if (!IMAGE_KEYS.ACCESS_KEY) {
        alert("Unspash Access key is out of date");
        return;
    }

    let url = 'https://api.unsplash.com/photos/random?featured&orientation=landscape&client_id=' + IMAGE_KEYS.ACCESS_KEY;
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
        }
        img.src = photo_url;

        setCookie("photo_url", photo_url, 1);
        setCookie("photo_author", photo_author, 1);
        setCookie("photo_author_url", photo_author_url, 1);
    });
}


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


function setCookie(cookieName, cookieValue, expireHours) {
    let currentTime = new Date();
    currentTime.setTime(currentTime.getTime() + expireHours * 3600 * 1000);
    let expires = "expires=" + currentTime.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}


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