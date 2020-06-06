
let tetrominoI = [];
let tetrominoO = [];
let tetrominoT = [];
let tetrominoS = [];
let tetrominoZ = [];
let tetrominoJ = [];
let tetrominoL = [];

let tetrominoSet = [{ shape: tetrominoI,
                        colour: 'red'
                    },
                    { shape: tetrominoO,
                        colour: 'blue'
                    },
                    { shape: tetrominoT,
                        colour: 'green'
                    },
                    { shape: tetrominoS,
                        colour: 'yellow'
                    },
                    { shape: tetrominoZ,
                        colour: 'purple'
                    },
                    { shape: tetrominoJ,
                        colour: 'orange'
                    },
                    { shape: tetrominoL,
                        colour: 'aqua'
                    }];
                    
//tetromino I 
tetrominoI[0] = [   [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ];                
tetrominoI[1] = [   [0,0,1,0],
                    [0,0,1,0],
                    [0,0,1,0],
                    [0,0,1,0]
                ];
tetrominoI[2] = [   [0,0,0,0],
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0]
                ];
tetrominoI[3] = [   [0,1,0,0],
                    [0,1,0,0],
                    [0,1,0,0],
                    [0,1,0,0]
                ];

//tetromino O 

tetrominoO[0] = [   [0,1,1,0],
                    [0,1,1,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ]; 
                   
tetrominoO[1] = [   [0,1,1,0],
                    [0,1,1,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ];
tetrominoO[2] = [   [0,1,1,0],
                    [0,1,1,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ];
tetrominoO[3] = [   [0,1,1,0],
                    [0,1,1,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ];

//tetromino T  

tetrominoT[0] = [   [0,1,0,0],
                    [1,1,1,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ]; 
                   
tetrominoT[1] = [   [0,1,0,0],
                    [0,1,1,0],
                    [0,1,0,0],
                    [0,0,0,0]
                ];
tetrominoT[2] = [   [0,0,0,0],
                    [1,1,1,0],
                    [0,1,0,0],
                    [0,0,0,0]
                ];
tetrominoT[3] = [   [0,1,0,0],
                    [1,1,0,0],
                    [0,1,0,0],
                    [0,0,0,0]
                ];

//tetromino S  

tetrominoS[0] = [   [0,1,1,0],
                    [1,1,0,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ]; 
                   
tetrominoS[1] = [   [0,1,0,0],
                    [0,1,1,0],
                    [0,0,1,0],
                    [0,0,0,0]
                ];
tetrominoS[2] = [   [0,0,0,0],
                    [0,1,1,0],
                    [1,1,0,0],
                    [0,0,0,0]
                ];
tetrominoS[3] = [   [1,0,0,0],
                    [1,1,0,0],
                    [0,1,0,0],
                    [0,0,0,0]
                ];            

//tetromino Z  

tetrominoZ[0] = [   [1,1,0,0],
                    [0,1,1,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ]; 
                   
tetrominoZ[1] = [   [0,0,1,0],
                    [0,1,1,0],
                    [0,1,0,0],
                    [0,0,0,0]
                ];
tetrominoZ[2] = [   [0,0,0,0],
                    [1,1,0,0],
                    [0,1,1,0],
                    [0,0,0,0]
                ];
tetrominoZ[3] = [   [0,1,0,0],
                    [1,1,0,0],
                    [1,0,0,0],
                    [0,0,0,0]
                ];    

//tetromino J  

tetrominoJ[0] = [   [1,0,0,0],
                    [1,1,1,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ]; 
                   
tetrominoJ[1] = [   [0,1,1,0],
                    [0,1,0,0],
                    [0,1,0,0],
                    [0,0,0,0]
                ];
tetrominoJ[2] = [   [0,0,0,0],
                    [1,1,1,0],
                    [0,0,1,0],
                    [0,0,0,0]
                ];
tetrominoJ[3] = [   [0,1,0,0],
                    [0,1,0,0],
                    [1,1,0,0],
                    [0,0,0,0]
                ];   

//tetromino L  

tetrominoL[0] = [   [0,0,1,0],
                    [1,1,1,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ]; 
                   
tetrominoL[1] = [   [0,1,0,0],
                    [0,1,0,0],
                    [0,1,1,0],
                    [0,0,0,0]
                ];
tetrominoL[2] = [   [0,0,0,0],
                    [1,1,1,0],
                    [1,0,0,0],
                    [0,0,0,0]
                ];
tetrominoL[3] = [   [1,1,0,0],
                    [0,1,0,0],
                    [0,1,0,0],
                    [0,0,0,0]
                ];  