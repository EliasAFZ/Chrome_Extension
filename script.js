
/*
Name: Chrome Extension inspired by the Momentum plugin.
Date: 10/14/2019
Description:

@Author Elias Afzalzada
Copyright © Elias Afzalzada - All Rights Reserved
*/

let greeting = $('.greeting');
let user_name = $('.user-name');
let mantra = $('.mantra');
let time = $('.time');
let date = $('.date');


$(document).ready(function(){
    //current time
    //update every 10 seconds;
    setCurrentTime();
    setBackground();
    setInterval(function(){
        setCurrentTime();
    },10*1000);

    // var is in scope of the function
    var username = getCookie('username');
    //check cookie
    if(username){
        $('.greeting').css('display','inline-block');
        $('.user-name').css('display','none');
        $('.greeting').html(`Hey again, <span class="stored-name">${username}</span>.`)
        setQuote();
    }else{
        $('.greeting').css('display');
        $('.user-name').css('display','inline-block');
        $('.greeting').html(`Hi there, what's your name?`);
    }

    $('.user-name').keypress(function (e) {
        if (e.which == 13) {
            var username = e.target.value;
            if (!username) return;
            $('.user-name').fadeOut(function () {
                $('.greeting').html(`Hello there, ${username}!`);
                $('.greeting').fadeIn(function () {
                    setQuote();
                    setCookie('username', username, 365);
                });
            });
        }
    });
});


function setQuote(){
    let quotesArr = [
        "Knowing is not enough, we must apply. Willing is not enough, we must do.",
        "Be an encourager, the world has enough critics already.",
        "The past has no power over the present moment.",
        "We are what we repeatedly do. Excellence then, is not an act, but a habit.",
        "Nothing is particularly hard if you divide it into small jobs.",
        "You can't climb the ladder of success with your hands in your pockets.",
        "Make the most of the best and the least of the worst.",
        "People are smarter than you think. Give them a chance to prove themselves.",
        "You are awesome.",
        "Life is a succession of lessons which must be lived to be understood."
    ];

    let randomQuote = quotesArr[Math.floor(Math.random() * quotesArr.length)];


    $('.mantra').css('display', 'inline-block');
    $('.mantra').html(randomQuote);
}

function setBackground(){
    let backgroundsArr = [
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1952&q=80",
        "https://images.unsplash.com/photo-1564610142447-883026a1a857?ixlib=rb-1.2.1&auto=format&fit=crop&w=2002&q=80"
    ];

    let background = backgroundsArr[Math.floor(Math.random() * backgroundsArr.length)];

    $('.photoLink').attr('href', background);
    $('html').css({'background-image': 'url(' + background + ')'});
}

function setCurrentTime(){
    // let is in scope of the brackets
    let now = new Date();
    // 24 hour to 12 hour conversion
    let hours = (now.getHours() % 12) || 12;
    let minutes = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    $('.time').html(hours+":"+minutes);
    $('.date').html(now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }));
}

function setCookie(cname,cvalue,exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}