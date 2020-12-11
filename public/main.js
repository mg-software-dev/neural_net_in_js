

let url = "http://localhost:3001/get_trained_data";
let n_net = {};

fetch(url)
.then(response => response.json())
.then((data) =>
{
    sessionStorage.setItem("trained_data",JSON.stringify(data));

    let temp = sessionStorage.getItem("trained_data");

    let trained_net_data = JSON.parse(temp);

    n_net = new neuralNetwork(trained_net_data.net_structure,trained_net_data.l_rate,true,trained_net_data.weights);
});






document.addEventListener("DOMContentLoaded" ,() =>
{
    
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------

    //get the div to put the elements inside it
    let mainGrid = document.getElementById("drawing_grid");
    

    // here we generate the grid reference data
    let gridData = [];

    for (let row = 0; row < 28; row++)
    {
        let temp = [];

        for (let col = 0; col < 28; col++)
        {
            temp.push(0);
        }  

        gridData.push(temp);
    }



    //----------------------------------------------------
    //----------------------------------------------------
    // DRAWING EVENT HANDLERS

    //--------------------------
    const mousedown = ()=>
    {
        isMouseDown=true;
    }
    
    
    //--------------------------
    const mouseup = ()=>
    {
        isMouseDown=false;
    }

    let isMouseDown=false;
    document.addEventListener('mousedown', mousedown);
    document.addEventListener('mouseup',mouseup);

    

    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    const paintBlock = (e)=>
    {
        if(isMouseDown)
        {
            if(e.path[0].classList.contains("selected"))
            {
                return
            }
            else
            {
                e.path[0].classList.add("selected");
            }
        }
        else
        {
            return;
        }
    }


    const paintBlock2 = (e)=>
    {
        if(e.path[0].classList.contains("selected"))
        {
            return
        }
        else
        {
            e.path[0].classList.add("selected");
        }
    }

    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    



    
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    const drawGrid = (gridData)=>
    {
        //the grid is 28x28 just like the mnist dataset images
        let grid_size = 28;
        document.getElementById("drawing_grid").style.gridTemplateRows = `repeat(${grid_size},1fr)`;
        document.getElementById("drawing_grid").style.gridTemplateColumns = `repeat(${grid_size},1fr)`;

        //here we put the css styles corresponding to player, wall, exit and key
        for (let row = 0; row < grid_size; row++)
        {
            for (let col = 0, col_len = gridData[row].length; col < col_len; col++)
            {
                let block = document.createElement("div");
                block.classList.add("block");

                // QQQ add event listener to click and draw
                block.addEventListener("mouseover",paintBlock);
                block.addEventListener("click", paintBlock2);


                mainGrid.appendChild(block);
                gridData[row][col] = block; 
            }  
        }

    }



    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    const clearGrid = (grid_data,gridDiv)=>
    {
        try
        {
            // erase the references of the maze blocks
            // from the div that contains them
            while(gridDiv.firstChild)
            {
                gridDiv.removeChild(gridDiv.firstChild);
            }

            // remove all the divs from the array
            grid_data.length = 0;

            for (let row = 0; row < 28; row++)
            {
                let temp = [];

                for (let col = 0; col < 28; col++)
                {
                    temp.push(0);
                }  

                grid_data.push(temp);
            }

            drawGrid(grid_data);
        }
        catch(e)
        {}
    }




    let btn_clear_canvas = document.getElementById("btn_clear_canvas");
    btn_clear_canvas.addEventListener("click",()=> clearGrid(gridData,mainGrid));







    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    
    // render a first grid
    drawGrid(gridData);


    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    // to sort the net answer and display the highest value
    const quickSort = (arrToSort) =>
    {
    
        if(arrToSort.length < 2 ) 
        {
            return arrToSort;
        }
        else
        {
            let lessArr = [];
            let eqArr = [];
            let greaterArr = [];

            let pivot = (arrToSort.length / 2) | 0;
        
            for (let i = 0, len = arrToSort.length; i < len; i++)
            {
            if(arrToSort[i] < arrToSort[pivot])
            {
                lessArr.push(arrToSort[i]);
            }
            else if(arrToSort[i] === arrToSort[pivot])
            {
                eqArr.push(arrToSort[i]);
            }
            else if(arrToSort[i] > arrToSort[pivot])
            {
                greaterArr.push(arrToSort[i]);
            }

            }
            return quickSort(lessArr).concat(eqArr, quickSort(greaterArr));
        }
    }




    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    const getTargetArr = (target)=>
    {
        switch(parseInt(target))
        {
            case 0:
            return [0.99,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1];
            
            case 1:
            return [0.1,0.99,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1];

            case 2:
            return [0.1,0.1,0.99,0.1,0.1,0.1,0.1,0.1,0.1,0.1];

            case 3:
            return [0.1,0.1,0.1,0.99,0.1,0.1,0.1,0.1,0.1,0.1];

            case 4:
            return [0.1,0.1,0.1,0.1,0.99,0.1,0.1,0.1,0.1,0.1];

            case 5:
            return [0.1,0.1,0.1,0.1,0.1,0.99,0.1,0.1,0.1,0.1];

            case 6:
            return [0.1,0.1,0.1,0.1,0.1,0.1,0.99,0.1,0.1,0.1];

            case 7:
            return [0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.99,0.1,0.1];

            case 8:
            return [0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.99,0.1];

            case 9:
            return [0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.99];
            
            default:
            break;

        }
    }



    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    //---------------------------------------------------------------------
    const getAnswer = (isTrainData)=>
    {
        let grid_size = gridData.length;
        let feedArr = [];

        for (let row = 0; row < grid_size; row++)
        {
            for (let col = 0, col_len = gridData[row].length; col < col_len; col++)
            {
                if(gridData[row][col].classList.contains("selected"))
                {
                    feedArr.push(0.99);
                }
                else
                {
                    feedArr.push(0.1);
                }
            }  
        }

        // console.log(feedArr);


        if(isTrainData)
        {
            let label = document.getElementById("input_train").value;
            
            if(label === "")
            {
                return;
            }
            
            //parsing the target vector
            let targetArr = getTargetArr(label);

            n_net.train(feedArr,targetArr);

        }
        



        let ans = document.getElementById("label_answer");
        let ans_2 = document.getElementById("label_answer2");

        let result = n_net.get_result(feedArr);

        let sort_result = quickSort(result);

        let num_1 = sort_result.pop();
        let num_2 = sort_result.pop();

        result.map((val,index)=>
        {
            if(val === num_1)
            {
                ans.innerText = `The answer is : ${index}`;
            }
            else if(val === num_2)
            {
                ans_2.innerText = `Second guess is : ${index}`;
            }
        });
    }



    let btn_guess_num = document.getElementById("btn_guess_num");
    btn_guess_num.addEventListener("click",()=> getAnswer(false));



    let btn_train = document.getElementById("btn_train");
    btn_train.addEventListener("click",()=> getAnswer(true));

});
















