// home image slider
generateHomeImg = () => {
    let $imgElm = $("#hero-img");
    // random num 0-12 (13 images);
    let ran = Math.floor(Math.random() * 12); 

    // assigns the random number as the image name in the src for the html image
    $imgElm.attr("src", `assets/img/${ran}.png`); 
    // show the image on the page 
    $imgElm.removeClass('hide'); 
}

setInterval(()=>{ 
    generateHomeImg();
 }, 3000);


let stepCount = 1;
let progress = 0;
let newFriend = {
    image: "",
    name: "",
    userScores: []
}

reset = () => {
    stepCount = 1;
    progress = 0;
    newFriend = {
        image: "",
        name: "",
        userScores: []
    }
    
    $("section.step").each((i, elm)=>{
        elm.classList.add("hide");
    });

    $("#user-info").removeClass('hide');

    $(".step-btn").addClass("disabled").attr("disabled", true);

    progress = 0;
    $("#progress").css("width", `0%`);
}

// next, back, submit 
$(".question").on("change", (e) => {
    let elm = e.target.name;
    let val = e.target.value

    if(elm !== "userScores") {
        newFriend[elm] = val;
    } else {
        let index =  parseInt(e.target.getAttribute("data-index"));

        if(val === "Choose...") {
            return
        }

        newFriend[elm].splice(index, 1, parseInt(val));
    }

    stepBtnCheck();
});

// render question
stepBtnCheck = () => { 
    if(stepCount === 1 &&  newFriend.image.length > 0 &&  newFriend.name.length > 0) {
        $(".step1").removeClass("disabled").attr("disabled", false)
    } 
    
    if(stepCount > 1 && newFriend.userScores.length === (stepCount-1)){
        $(`.step${stepCount}`).removeClass("disabled").attr("disabled", false);
    }
}

$(".step-btn").click((e) => {
    e.preventDefault();
   
    let elm = e.target
    let btn =  elm.textContent.toLowerCase()
    let step = parseInt(elm.getAttribute("data-step"))

    switch(btn){
        case "next":
            handleNext(step, elm);
        break;
        case "back":
        break;
    }
})

handleNext = (step, elm) => {
    if(step <= 10) {
        stepCount ++
        progress = progress + 9.09;
        $("#progress").css("width", `${progress}%`);
        let $currentStepElm = $(`[data-stepcount='${step}']`);
        $currentStepElm.addClass("hide");

        let $nextStepElm = $(`[data-stepcount='${stepCount}']`);
        $nextStepElm.removeClass("hide");
    }
   
}

handleBack = (step, elm) => {}

$("#submit").click((e) => {
    e.preventDefault();

    let isValid = $("#survey-form")[0].checkValidity();

    if(isValid) { 
        stepCount ++
        progress = progress + 9.09;
        $("#progress").css("width", `${progress}%`);
        let $currentStepElm = $(`[data-stepcount='${stepCount-1}']`);
        $currentStepElm.addClass("hide");

        let $nextStepElm = $(`[data-stepcount='${stepCount}']`);
        $nextStepElm.removeClass("hide");

        let image = $('#user-image').prop('files')[0];
        let name = $("#user-name").val().trim();
        let userScores = []

        let userData = new FormData();

        $('#user-image, #user-name').val("");

        $('select.question').each((i, elm)=>{
            if(Element.value === "Choose...") {
                return
            }
            userScores.splice(i, 1, parseInt(elm.value))
            elm.value = "";
        })

        userData.append("file", image);
        userData.append("name", name);
        userData.append("scores", userScores);

        getMatch(userData)
          
    } else {
        alert("eerrrrr")
        reset();
        $(".modal-body").empty()
        $(".modal-body").text("Uht Oh! please check your survey and try again");
        $("#myModal").modal("show")
        alert("form is not complete")
        return false
    }
});

getMatch = (userData) => {

    $.ajax({
        type: "POST",
        url: "/api/friends",
        data: userData,
        processData: false,
        contentType: false,
        dataType: "json",
        success: (data, textStatus, jqXHR) => {
            if(data === null) {
                // show in model
                $(".modal-body").empty()
                $(".modal-body").text("sorry no match was found :(")
                $("#myModal").modal("show")
                reset()
            } else {
                // show in model
                $(".modal-body").empty()
                let imageSrc = data.image;
                let image = $("<img>").attr("src", `assets/img/uploads/${imageSrc}.jpg`).attr("alt", "match")

                let name = $("<h2>").text(data.name)
                $(".modal-body").append(image, name)
                $("#myModal").modal("show")
                reset()

            }
        },
        error: (data, textStatus, jqXHR) => {
            reset()
            $(".modal-body").empty()
            $(".modal-body").text("OOPS!! something went wrong. please try again")
            $("#myModal").modal("show")
            reset()
        },
    });
}


