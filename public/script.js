document.addEventListener('DOMContentLoaded', () => {
    console.log('loaded');
    const canvas = document.getElementById('drawingCanvas');
    const context = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let tool="pencil";
    context.lineWidth = 5; 
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let history=[];
    let index=0;
    history.push(canvas.toDataURL());
    let snapshot;
    let fontFamily="Roboto";
    let myFontSize=20;
    let fontColor="black";
    let buttons=document.querySelectorAll('button');

    
    
    function draw(e) 
    {
        if (!isDrawing) return;
        let img=new Image();
        img.src=snapshot;
        context.strokeStyle = fontColor;
        if(tool==="pencil")
        {
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.beginPath();
            context.moveTo(lastX, lastY);
            context.lineTo(e.offsetX, e.offsetY);
            context.stroke();
            [lastX, lastY] = [e.offsetX, e.offsetY];
        }
        else if(tool==="eraser")
        {
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.globalCompositeOperation = "destination-out";
            context.beginPath();
            let dx = e.offsetX - lastX;
            let dy = e.offsetY - lastY;
            let radius = Math.sqrt(dx * dx + dy * dy);
            context.arc(lastX, lastY, radius, 0, Math.PI * 2);
            context.fill();
            context.globalCompositeOperation = "source-over";
            [lastX, lastY] = [e.offsetX, e.offsetY];
        }
        else if(tool==="circle")
        {
            
            let temp=new Image();
            temp.src=snapshot;
            temp.onload = function() {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(temp, 0, 0);
                context.beginPath();
                let dx = parseInt(e.offsetX- lastX);
                let dy = parseInt(e.offsetY - lastY);
                let radius=Math.sqrt(dx*dx+dy*dy);
                context.arc(lastX,lastY,radius,0 , 2 * Math.PI); // (x, y, radius, startAngle, endAngle)
                context.stroke();
            }
        }
        else if(tool==="triangle")
        {
            let temp = new Image();
            temp.src = snapshot;
            temp.onload = function() {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(temp, 0, 0);
                context.beginPath();
                let dx = parseInt(e.offsetX- lastX);
                let dy = parseInt(e.offsetY - lastY);
                let x1=lastX;let y1=lastY+dy;
                let x2=lastX+dx/2;let y2=lastY;
                let x3=lastX+dx;let y3=lastY+dy;
                context.moveTo(x1,y1);
                context.lineTo(x2,y2);
                context.lineTo(x3,y3);
                context.closePath(); 
                context.stroke(); 
            }
            
        }   
        else if(tool==="rectangle")
        {
            let temp = new Image();
            temp.src = snapshot;
            temp.onload=()=>{
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(temp, 0, 0);
                context.beginPath();
                let dx= parseInt(e.offsetX - lastX);
                let dy= parseInt(e.offsetY - lastY);
                let x1=lastX;let y1=lastY;
                let x2=lastX+dx;let y2=lastY;
                let x3=lastX;let y3=lastY+dy;
                let x4=lastX+dx;let y4=lastY+dy;
                context.moveTo(x1,y1);
                context.lineTo(x2,y2); //up left side
                context.lineTo(x4,y4); //down right side
                context.lineTo(x3,y3); //down left side
                context.closePath();
                context.stroke();
                
            }
        }
        else if(tool==="star") 
        {
                let temp = new Image();
                temp.src = snapshot;
                temp.onload=()=>{
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(temp, 0, 0);
                    let dx=parseInt(e.offsetX-lastX);
                    let dy=parseInt(e.offsetY-lastY);
                    let outerRadius=Math.sqrt(dx*dx+dy*dy);
                    let innerRadius=outerRadius/2;
                    let rot=Math.PI/2*3;
                    let centerX=lastX;
                    let centerY=lastY;
                    let x=centerX;
                    let y=centerY;
                    let step=Math.PI/5;
                    context.beginPath();
                    context.moveTo(centerX,centerY-outerRadius)
                    for(i=0;i<5;i++){
                        x=centerX+Math.cos(rot)*outerRadius;
                        y=centerY+Math.sin(rot)*outerRadius;
                        context.lineTo(x,y)
                        rot+=step;
                        x=centerX+Math.cos(rot)*innerRadius;
                        y=centerY+Math.sin(rot)*innerRadius;
                        context.lineTo(x,y)
                        rot+=step;
                    }
                    context.lineTo(centerX,centerY-outerRadius);
                    context.closePath();
                    context.stroke();
                }
        }
        else if(tool==="hexagon")
        {
            const angle=2*Math.PI/6;
            let temp = new Image();
            temp.src = snapshot;
            temp.onload=()=>{
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(temp, 0, 0);
                context.beginPath();
                let dx=parseInt(e.offsetX-lastX);
                let dy=parseInt(e.offsetY-lastY);
                let radius=Math.sqrt(dx*dx+dy*dy);
                for(let i=0;i<6;i++) context.lineTo(lastX+radius*Math.cos(angle*i),lastY+radius*Math.sin(angle*i));
                context.closePath();
                context.stroke();
            }
        }
        else if(tool==="line")
        {
            let temp = new Image();
            temp.src = snapshot;
            temp.onload=()=>{
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(temp, 0, 0);
                context.beginPath();
                context.moveTo(lastX,lastY);
                context.lineTo(e.offsetX,e.offsetY);
                context.stroke();
            }
        }
        // else if(tool==="rainbow")
        // {
        //     let grad=context.createLinearGradient(lastX,lastY,e.offsetX,e.offsetY);
        //     grad.addColorStop(0, "red");
        //     grad.addColorStop(0.1, "orange");
        //     grad.addColorStop(0.2, "yellow");
        //     grad.addColorStop(0.3, "green");
        //     grad.addColorStop(0.4, "blue");
        //     grad.addColorStop(0.5, "indigo");
        //     grad.addColorStop(0.6, "violet");
        //     grad.addColorStop(0.7, "red");
        //     grad.addColorStop(0.8, "orange");
        //     grad.addColorStop(0.9, "yellow");
        //     grad.addColorStop(1, "green");
        //     context.strokeStyle=grad;
        //     context.beginPath();
        //     context.moveTo(lastX, lastY);
        //     context.lineTo(e.offsetX, e.offsetY);
        //     context.stroke();
        //     [lastX, lastY] = [e.offsetX, e.offsetY];
        // }
    };

    canvas.addEventListener('mousedown', (e) => {
        snapshot=canvas.toDataURL();
        if(tool==="text")
        {
            createTextInput(e.offsetX,e.offsetY);
        }
        else {
            isDrawing=true;
            context.lineWidth=document.getElementById('brushSize').value;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        }
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => {
        if(isDrawing)
        {
            saveState();
            // console.log(index);
            isDrawing = false;
        }
    });

    canvas.addEventListener('mouseout', () => isDrawing = false);
    document.getElementById('clearButton').addEventListener('click', clearCanvas);
    document.getElementById('pencil').addEventListener('click', () => {
        canvas.style.cursor = "url(./pictures/pencil.png), auto";
        tool='pencil';
        changeButtonState('pencil');
    });
    document.getElementById('eraser').addEventListener('click', () => {
        canvas.style.cursor = "url(./pictures/eraser.png), auto";
        tool='eraser';
        changeButtonState('eraser');
    });
    document.getElementById('text').addEventListener('click', () => {
        tool='text';
        canvas.style.cursor = "url(./pictures/text.png), auto";
        changeButtonState('text');
    });
    document.getElementById('circle').addEventListener('click', (e) => {
        canvas.style.cursor = "url(./pictures/circle.png), auto";
        tool='circle';
        changeButtonState('circle');
    });
    document.getElementById('triangle').addEventListener('click', () => {
        canvas.style.cursor = "url(./pictures/triangle.png), auto";
        tool='triangle';
        changeButtonState('triangle');
    });
    document.getElementById('rectangle').addEventListener('click', () => {
        canvas.style.cursor = "url(./pictures/rectangle.png), auto";
        tool='rectangle';
        changeButtonState('rectangle');
    });


    document.getElementById('redo').addEventListener('click',redo);

    document.getElementById('undo').addEventListener('click', undo);
    
    //Notice: upload function doesn't let canvas size become the same as the uploaded image
    document.getElementById('upload').addEventListener('click', () => {
        let inputFile = document.getElementById('input-file');
        inputFile.click();
    });

    document.getElementById('download').addEventListener('click', () => {
        let picture=canvas.toDataURL();
        let link=document.createElement('a');
        link.href=picture;
        link.download="image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    document.getElementById('input-file').addEventListener('change', (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
            let image = new Image();
            image.onload = () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    

    document.getElementById('brushSize').addEventListener('change',()=>{
        context.lineWidth=document.getElementById('brushSize').value;
    });


    document.getElementById('star').addEventListener('click',()=>{
        canvas.style.cursor = "url(./pictures/star.png), auto";
        tool='star';
        changeButtonState('star');
    });

    document.getElementById('hexagon').addEventListener('click',()=>{
        canvas.style.cursor = "url(./pictures/hexagon.png), auto";
        tool='hexagon';
        changeButtonState('hexagon');
    });

    document.getElementById('line').addEventListener('click',()=>{
        canvas.style.cursor = "url(./pictures/remove.png), auto";
        tool='line';
        changeButtonState('line');
    });

    document.getElementById('font-type').addEventListener('change',()=>{
        fontFamily=document.getElementById('font-type').value;
    });

    document.getElementById('number').addEventListener('change',()=>{
        myFontSize=document.getElementById('number').value;
    });


    function saveState()
    {
        let temp=canvas.toDataURL();
        history.push(temp);
        snapshot=temp;
        index++;
    }

    function redo() {
        console.log(index);
        if (index <history.length-1) {
            index++;
            let image = new Image();
            image.src = history[index]; 
            image.onload = () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
            };
            
        }
    }
    

    function undo() {
        console.log(index);
        if (index >0) {
            index--;
            let image = new Image();
            image.src = history[index];
            image.onload = () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
            };
            
        }
    }
    
    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        saveState();
    };

    function createTextInput(x, y) {
        let textInput = document.createElement("input");
        textInput.style.position = "absolute";
        textInput.style.left = `${x}px`;
        textInput.style.top = `${y}px`;
        textInput.style.padding = '5px';
        textInput.style.border = "1px solid black";
        textInput.style.fontFamily = fontFamily;
        document.getElementById("whiteboard").appendChild(textInput);
        textInput.focus();
        textInput.addEventListener("keydown", (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                textInput.setAttribute("readonly", 'true');
                let inputText = textInput.value; 
                context.font = `${myFontSize}px ${fontFamily}`;
                context.fillStyle = fontColor;
                context.fillText(inputText, x, y);
                textInput.parentNode.removeChild(textInput);
                saveState();
            }
        });
    }


    function changeButtonState(id)
    {
        buttons.forEach((button)=>{
            button.classList.remove('active');
        })
        let button=document.getElementById(id);
        button.classList.add('active');
    }

    class Picker {
        constructor(target, width, height) {
            this.target = target;
            this.width = width;
            this.height = height;
            this.target.width = width;
            this.target.height = height;
            this.context = this.target.getContext('2d');
            this.onChangeCallback = () => {};
            this.pickerCircle = { x: 10, y: 10, width: 10, height: 10 };
            this.listenForEvents();
        }
    
        draw() {
            this.build();
        }
    
        build() {
            let gradient = this.context.createLinearGradient(0, 0, this.width, this.height);
            gradient.addColorStop(0, "rgb(255,0,0)"); 
            gradient.addColorStop(0.15, "rgb(255,0,255)"); 
            gradient.addColorStop(0.25, "rgb(0,0,255)"); 
            gradient.addColorStop(0.35, "rgb(0,255,255)"); 
            gradient.addColorStop(0.45, "rgb(0,255,0)"); 
            gradient.addColorStop(0.55, "rgb(255,255,0)"); 
            gradient.addColorStop(0.65, "rgb(255,125,0)"); 
            gradient.addColorStop(0.75, "rgb(255,0,0)"); 
            gradient.addColorStop(0.85, "rgb(255,0,255)"); 
            gradient.addColorStop(1, "rgb(0,0,255)"); 
            this.context.fillStyle = gradient;
            this.context.fillRect(0, 0, this.width, this.height);
            
            //black and white
            gradient = this.context.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
            gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
            gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
            gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
            this.context.fillStyle = gradient;
            this.context.fillRect(0, 0, this.width, this.height);

            // Circle
            this.context.beginPath();
            this.context.arc(this.pickerCircle.x, this.pickerCircle.y, 5, 0, Math.PI * 2);
            this.context.strokeStyle = "black";
            this.context.stroke();
            this.context.closePath();
        }
    
        listenForEvents() {
            let isMouseDown = false;
    
            const onMouseDown = (e) => {
                let currentX = e.clientX - this.target.offsetLeft;
                let currentY = e.clientY - this.target.offsetTop;
                if (currentY > this.pickerCircle.y && currentY < this.pickerCircle.y + this.pickerCircle.height && currentX > this.pickerCircle.x && currentX < this.pickerCircle.x + this.pickerCircle.width) {
                    isMouseDown = true;
                } else {
                    this.pickerCircle.x = currentX; 
                    this.pickerCircle.y = currentY; 
                    this.onChangeCallback(this.getPickedColor());
                }
            };
    
            const onMouseMove = (e) => {
                if (isMouseDown) {
                    let currentX = e.clientX - this.target.offsetLeft;
                    let currentY = e.clientY - this.target.offsetTop;
                    this.pickerCircle.x = currentX; 
                    this.pickerCircle.y = currentY; 
                }
            };
    
            const onMouseUp = () => {
                isMouseDown = false;
            };
    
            this.target.addEventListener('mousedown', onMouseDown);
            this.target.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('mousemove', () => { this.onChangeCallback(this.getPickedColor()) });
        }
    
        getPickedColor() {
            let imageData = this.context.getImageData(this.pickerCircle.x, this.pickerCircle.y, 1, 1).data;
            return { r: imageData[0], g: imageData[1], b: imageData[2] };
        }
    
        onChange(callback) {
            this.onChangeCallback = callback;
        }
    }
    const colorPickerCanvas = document.getElementById("colorPicker");
    let picker = new Picker(colorPickerCanvas, 250, 250);
    try
    {
        
        picker.draw();
        console.log(picker);
    }
    catch(e)
    {
        console.log(e);
    }
    
    
    setInterval(() => {
            picker.draw();
    }, 1);
    
    picker.onChange((color) => {
        fontColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
    });
});
