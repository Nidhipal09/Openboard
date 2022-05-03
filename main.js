let optionsContainer = document.querySelector(".options-container")
let toolsContainer = document.querySelector(".tools-container")
let pencil = toolsContainer.querySelector("#pencil")
let eraser = toolsContainer.querySelector("#eraser")
let shapes = toolsContainer.querySelector("#shapes")
let notes = toolsContainer.querySelector("#notes")
let upload = toolsContainer.querySelector("#upload")
let download = document.querySelector("#download")
let pencilToolContainer = document.querySelector(".pencil-tool-container")
let eraserToolContainer = document.querySelector(".eraser-tool-container")
let shapesToolContainer = document.querySelector(".shapes-tool-container")
let template = document.querySelector("template")
let body = document.querySelector("body")


let pencilFlag = false
let eraserFlag = false
let shapesFlag = false

optionsContainer.addEventListener("click", toggleOptionsContainer)
pencil.addEventListener("click", togglePencilToolContainer)
eraser.addEventListener("click", toggleEraserToolContainer)
shapes.addEventListener("click", toggleShapesToolContainer)
notes.addEventListener("click", showNotes)
upload.addEventListener("click", uploadImage)



function toggleOptionsContainer() {
    let menu = optionsContainer.querySelector("span")
    if (menu.innerHTML == "menu") {
        menu.innerHTML = "close"
        openToolsBar()
    }
    else {
        menu.innerHTML = "menu"
        closeToolsBar()
    }
}

function openToolsBar() {
    toolsContainer.style.display = "flex"
}

function closeToolsBar() {
    toolsContainer.style.display = "none"

    pencilFlag = false
    pencilToolContainer.style.display = "none"
    eraserFlag = false
    eraserToolContainer.style.display = "none"
    shapesFlag = false
    shapesToolContainer.style.display = "none"
}

function togglePencilToolContainer() {
    pencilFlag = !pencilFlag

    if (pencilFlag){
        pencilToolContainer.style.display = "block"
    } 
    else pencilToolContainer.style.display = "none"
}

function toggleEraserToolContainer() {
    eraserFlag = !eraserFlag

    if (eraserFlag) eraserToolContainer.style.display = "flex"
    else eraserToolContainer.style.display = "none"


}

function toggleShapesToolContainer(){
    shapesFlag = !shapesFlag

    if(shapesFlag) shapesToolContainer.style.display = "block"
    else shapesToolContainer.style.display = "none"
}



function showNotes() {
    let notesTemplate = template.content.querySelector(".notes-container")
    let notesDiv = document.importNode(notesTemplate, true)

    let notesMinimizeSpan = notesDiv.querySelector("#minimize")
    let notesRemoveSpan = notesDiv.querySelector("#close")

    console.log(notesRemoveSpan)

    notesRemoveSpan.addEventListener("click", function(){
        console.log("remove")
        notesDiv.remove()
    })


    notesMinimizeSpan.addEventListener("click", function(){
        let notesBody = notesDiv.querySelector(".notes-body")
        let displayNotesBody = getComputedStyle(notesBody).getPropertyValue("display")
        console.log(displayNotesBody)

        if (displayNotesBody == "block") notesBody.style.display = "none"
        else notesBody.style.display = "block"
    })

    notesDiv.onmousedown = function (event) {
        dragAndDrop(notesDiv, event)
    };

    notesDiv.ondragStart = function () {
        return false
    }

    body.appendChild(notesDiv)
}



function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    // (1) prepare to moving: make absolute and on top by z-index
    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    // move it out of any current parents directly into body
    // to make it positioned relative to the body
    document.body.append(element);

    // centers the element at (pageX, pageY) coordinates
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    // move our absolutely positioned element under the pointer
    moveAt(event.pageX, event.pageY);

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // (2) move the element on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // (3) drop the element, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}



function uploadImage() {
    //open file explorer
    let input = document.createElement("input")
    input.setAttribute("type", "file")
    input.click()

    input.addEventListener("change", function () {
        let file = input.files[0]
        let fileUrl = URL.createObjectURL(file)

        let imageDiv = document.createElement("div")
        imageDiv.setAttribute("class", "notes-container")
        imageDiv.innerHTML = `
          <img src="${fileUrl}" id="uploadedImg"/>
        `

        document.body.append(imageDiv)

        imageDiv.onmousedown = function (event) {
            dragAndDrop(imageDiv, event)
        };

        imageDiv.ondragStart = function () {
            return false
        }
    })


}


