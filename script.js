/*
Name: Chrome Extension inspired by the Momentum plugin.
Date: 10/14/2019
Description:

@Author Elias Afzalzada
Copyright © Elias Afzalzada - All Rights Reserved
*/


$(document).ready(function(){
    //current time
    //update every 10 seconds;
    setCurrentTime();
    setInterval(function(){
        setCurrentTime();
    },10*1000);

    // var is in scope of the function
    var username = getCookie('username');
    //check cookie
    if(username){
        $('.greeting').css('display','inline-block');
        $('.user-name').css('display','none');
        $('.greeting').html(`Hey again, <span class="stored-name">${username}</span>.`);
    }else{
        $('.greeting').css('display');
        $('.user-name').css('display','inline-block');
        $('.greeting').html(`Hi there, what's your name?`);
    }

    $('.user-name').keypress(function(e) {
        if(e.which == 13) {
            var username = e.target.value;
            if(!username) return;
            $('.user-name').fadeOut(function(){
                $('.greeting').html(`Hello there, ${username}!`);
                $('.greeting').fadeIn(function(){
                    setCookie('username', username,365);
                });
            });
        }
    });

});

function setCurrentTime(){
    // let is in scope of the brackets
    let now = new Date();
    // 24 hour to 12 hour conversion
    let hours = (now.getHours() % 12) || 12;
    let minutes = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    $('.time').html(hours+":"+minutes)
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