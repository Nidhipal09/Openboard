(function () {
    let pencilToolContainer = document.querySelector(".pencil-tool-container")
    let pencilWidthInput = pencilToolContainer.querySelector("input")
    let pencilColorDivs = pencilToolContainer.querySelectorAll(".pencil-color")
    let pencil = document.querySelector("#pencil")
    let shapesToolContainer = document.querySelector(".shapes-tool-container")
    let rectangle = shapesToolContainer.querySelector("#rectangle")
    let line = shapesToolContainer.querySelector("#line")

    
    //canvas
    let canvas = document.querySelector("canvas")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let tool = canvas.getContext("2d")
    let cTool = "pencil";

    let mouseDown = false


    // tool.beginPath()  // new path
    // tool.strokeStyle = "red"
    // tool.lineWidth = "10"
    // tool.moveTo(300,100)  // start from this top-left x-y
    // tool.lineTo(1000,100)  // end here
    // tool.stroke()  // fill color in the line
    // tool.fillRect(0,0,100,100) //wrt the canvas  area
    // tool.fillStyle(0,0,200,200) // perimeter

    // tool.lineTo(1000, 400)
    // tool.stroke()

    //mouseDown- start new path, mouseMove- path fill

    let ix, iy, fx, fy;

    tool.lineWidth = pencilWidthInput.value
    tool.strokeStyle = "black"

    rectangle.addEventListener("click", function(){
        cTool = "rectangle";
    })

    line.addEventListener("click", function(){
        cTool = "line";
        console.log("line")
    })

    canvas.addEventListener("mousedown", (e) => {
        ix = e.clientX
        iy = e.clientY
        startPath(ix, iy)
    })

    function startPath(x, y) {
        mouseDown = true
        tool.beginPath()
        tool.moveTo(x, y)
    }

    canvas.addEventListener("mousemove", (e) => {
        if(cTool == "pencil" || cTool == "eraser")
          drawStroke(e.clientX, e.clientY)
    })

    function drawStroke(x, y) {
        if (mouseDown) {
            tool.lineTo(x, y)
            tool.stroke()
        }
    }


    canvas.addEventListener("mouseup", (e) => {
        mouseDown = false

        fx = e.clientX; //final x
        fy = e.clientY; //final y
        if(cTool == "rectangle"){
            let rectWidth = fx-ix;
            let rectHeight = fy-iy;

            tool.strokeStyle = "black"
            tool.lineWidth = "7"
            tool.strokeRect(ix,iy,rectWidth,rectHeight)
        }
        else if(cTool == "line"){
            console.log("in line")
            tool.beginPath()
            tool.moveTo(ix,iy)
            tool.lineTo(fx,fy)
            tool.strokeStyle = "black"
            tool.lineWidth = "7"
            tool.stroke()
        }


        let state = canvas.toDataURL()
        canvasStates.push(state)
        undoRedoTracker = canvasStates.length - 1
        console.log(canvasStates)
    })

    let pencilWidth
    let pencilColor


    //pencil
    pencil.addEventListener("click", (e) => {
        cTool = "pencil";
        tool.strokeStyle = pencilColor
        tool.lineWidth = pencilWidth
    })

    pencilColorDivs.forEach((colorDiv) => {
        colorDiv.addEventListener("click", (e) => {
            pencilColor = colorDiv.getAttribute("id")
            tool.strokeStyle = pencilColor
        })
    })

    pencilWidthInput.addEventListener("change", (e) => {
        pencilWidth = pencilWidthInput.value
        tool.lineWidth = pencilWidth
    })

   
    //eraser
    let eraserToolContainer = document.querySelector(".eraser-tool-container")
    let eraserWidthInput = eraserToolContainer.querySelector("input")
    let eraser = document.querySelector("#eraser")

    let eraserWidth

    eraser.addEventListener("click", (e) => {
        pencil = "eraser";
        tool.strokeStyle = "white"
        tool.lineWidth = eraserWidth
    })

    eraserWidthInput.addEventListener("change", (e) => {
        eraserWidth = eraserWidthInput.value
        tool.lineWidth = eraserWidth
    })



    //download canvas
    download.addEventListener("click", downloadDrawing)

    function downloadDrawing() {
        let a = document.createElement("a")
        a.download = "boardDrawing.jpg"
        a.href = canvas.toDataURL()

        a.click()
    }


    //undo and redo
    let canvasStates = []
    let undoRedoTracker = 0;

    let undo = document.querySelector("#undo")
    let redo = document.querySelector("#redo")

    undo.addEventListener("click", undoChanges)
    redo.addEventListener("click", redoChanges)

    function undoChanges() {
        if (undoRedoTracker >= 0) undoRedoTracker--;
        canvasChanges()
    }

    function redoChanges() {
        if (undoRedoTracker <= canvasStates.length - 1) undoRedoTracker++;
        canvasChanges()
    }

    function canvasChanges() {

        let url = canvasStates[undoRedoTracker]
        let img = new Image()
        img.src = url

        img.onload = (e) => {
            tool.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
    }




})()