let count = 0;
const txt = "Hello, my name is Dan Xu. I am a creative researcher and maker/coder from China and based in the Netherlands.**I am particularly interested in the poetics and creative possibilities of human (and non-human) computer interaction**... as well as how such technologies mediate our embodied and social realities.**I like to blend insights and approaches from different disciplines to explore questions and phenomena that trigger my curiosity.**Besides research, I often make stuff with sound, text, and code.**>>>more>>>**&";
const linkHTML = '<a href="https://danxxxu.github.io/relational-model/" target="_blank">PhD in interactive art @ Leiden University</a><br/><br/><a href="https://medium.com/@ProcessingOrg/meet-our-2024-processing-foundation-fellows-4b7f5ed5d104" target="_blank">(Re-)Imagining accessible web @ Processing Foundation</a><br/><br/><a href="https://digitalsocietyschool.org/digital-to-physical/" target="_blank">Digital transformation projects @ Digital Society School</a><br/><br/><a href="https://docs.google.com/document/d/1Jz5X7UPrQvlGTYuLwxc-Z1WEgav5zZhUWrxRNRbPN8w/view?usp=sharing" target="_blank">CV</a><br/><br/><a href="https://www.youtube.com/@danxu4968" target="_blank">Youtube</a><br/><br/><a href="https://www.instagram.com/danxx_910/" target="_blank">Instagram</a><br/><br/><a href="mailto: danxu0910@gmail.com">Email</a>';
let speed = 0;

function typeWriter() {
    if (count < txt.length) {
        if (txt.charAt(count) == "*") {
            document.querySelector(".content").innerHTML += '<br/>'
        } else if (txt.charAt(count) == "&") {
            setTimeout(document.querySelector(".content").innerHTML += linkHTML, 50);
        }
        else{
            document.querySelector(".content").innerHTML += txt.charAt(count);
        }
        count++;
        speed = Math.random() * 80;
        setTimeout(typeWriter, speed);
    }
}