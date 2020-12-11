

// const Matrix = require("./matrix_lib.js");


//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------

class neuralNetwork
{

  // class variables
  //---------------------------------
  net_structure = [];

  lRate;



  //the activation_function
  //---------------------------------
  activation_function;
  d_activation_function;



  // weight matrices
  //---------------------------------
  weights_matrices = [];


  //---------------------------------
  final_outputs;

  final_error;




  //the activation functions for the nn
  static sigmoid = (x)=>
  {
    return 1/(1+Math.pow(Math.E, -x));
  }

  static deriv_sigmoid = (x)=>
  {
    let sig = neuralNetwork.sigmoid(x);
    return sig * (1 - sig);
  }




  //---------------------------------
  static tanh(x)
  {
    var y = Math.tanh(x);
    return y;
  }

  static dtanh(x)
  {
    var y = 1 / (Math.pow(Math.cosh(x), 2));
    return y;
  }


  // initialize the network
  // set the number of input, hidden and output layer nodes.
  // also the learning rate
  //------------------------------
  constructor(network_structure,l_rate = 0.1, from_file = false, weights_data = [], activation_func = "sigmoid")
  {

    
    this.net_structure = network_structure;
    this.lRate = l_rate;

    // console.log(weights_data[i]);
    

    // initialize the weights randomly or load from file
    if(from_file === true)
    {
      for(let i = 0 , len = weights_data.length; i < len ; i++)
      {
          let m = new Matrix(weights_data[i].rows, weights_data[i].cols);
          
          for(let j = 0; j < m.rows; j++)
          {
            for(let k = 0; k < m.cols; k++)
            {
              m.data[j][k] = weights_data[i].data[j][k];
              // console.log(weights_data[i].data[j][k]);
            }
          }
          // console.log(m);
          this.weights_matrices.push(m); 
      }
    }
    else
    {
      for(let i = 0, len = network_structure.length -1; i < len; i++)
      {
        this.weights_matrices.push(new Matrix(network_structure[i+1],network_structure[i]).randomize());
      }
    }



    if(activation_func === "sigmoid")
    {
      //set the activation function
      this.activation_function = neuralNetwork.sigmoid;
      this.d_activation_function = neuralNetwork.deriv_sigmoid;
    }
    else if(activation_func === "tanh")
    {
      //set the activation function
      this.activation_function = neuralNetwork.tanh;
      this.d_activation_function = neuralNetwork.dtanh;
    }


  }




  // get output from an input value
  // (or set of values)
  // input must be an 1d array
  //------------------------------
  get_result(input_vector)
  {

    let input = Matrix.fromArray(input_vector);

    for(let i = 0 , len = this.weights_matrices.length; i < len; i++)
    {
      input = Matrix.multiply(this.weights_matrices[i], input);
      input.map(this.activation_function);
    }

    return input.toArray();
  }




  //train the network
  //------------------------------
  train(input_vector, target_vector)
  {

    //-----
    let input = Matrix.fromArray(input_vector);
    let target = Matrix.fromArray(target_vector);
    let output = Matrix.fromArray(this.get_result(input_vector));

    //-----
    let w_len = this.weights_matrices.length;
    
    let outputs_arr = [];
    
    //-----
    for(let i = 0; i < w_len; i++)
    {
      outputs_arr.push(input);
      input = Matrix.multiply(this.weights_matrices[i], input);
      input.map(this.activation_function);
    }
    

    //-----
    this.final_outputs = output;

    // CALCULATE THE ERROR 
    // ERROR = target - final_output
    let output_errors = Matrix.subtract(target, output);//reemplazar con outputs
    this.final_error = output_errors;

    

    // So we have what we need to refine the weights at each layer.
    // For the weights between the hidden and final layers, we use the ​output_errors​
    // For the weights between the input and hidden layers, we use the ​hidden_errors​
    //----------------------------------------------------------------------------
    //update the weights for the links between the layers using the formula :

    // delta_jk = lrate * error_k * sig(O_k) * (1-sigmoid(O_k)) . (O_j)^T 

    // where . represent matrix multiplication and ()^T means the matrix transposed

    //-------------------------------------------------------------------
    //  UPDATING THE WEIGTHS BETWEEN THE HIDDEN AND OUTPUT LAYERS
    
    // final_outputs = sig(O_k) * (1-sigmoid(O_k))
    let gradient =  Matrix.map(output,this.d_activation_function);
    
    // error_f_o = error_k * final_outputs
    gradient.multiply(output_errors);
    
    // error_f_o  * lRate
    gradient.multiply(this.lRate);


    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    
    //-------------------------------------------------------------------
    //  UPDATING THE WEIGTHS BETWEEN THE INPUT AND HIDDEN LAYERS
    
    let o_len = outputs_arr.length -1;
    
    for(let i = o_len; i >= 0; i--)
    {
      
      // the matrix multiplication between the values calculated previously
      // and the correspondig output for the current layer
      let delta_w = Matrix.multiply(gradient,Matrix.transpose(outputs_arr[i]));
      
      // finally, update the weight
      this.weights_matrices[i].add(delta_w);

      // error_f_o = error_k * gradient
      output_errors = Matrix.multiply(Matrix.transpose(this.weights_matrices[i]),output_errors);
      
      // hidden_l_out_final = sig(O_k) * (1-sigmoid(O_k)) // gradient
      gradient =  Matrix.map(outputs_arr[i],this.d_activation_function);

      gradient.multiply(output_errors);
      
      // error_f_h  * lRate
      gradient.multiply(this.lRate);
      
      // this.W_hidden_output.print();
    }
    
    
  }

}




//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------


// if(typeof exports === 'object')
// {
//   module.exports = neuralNetwork;
// }

