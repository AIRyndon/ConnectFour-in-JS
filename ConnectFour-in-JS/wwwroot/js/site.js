// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

$(function () {

    var board = [];
    var turns = 0;
    var winner = 0;
    var players = {
        playerOne: 'player-one',
        playerTwo: 'player-two'
    };

    var playerTurn = players.playerOne;
    var currentNode;

    function InitiateBoard(board, row, column) {

        board[row][column] = new Node(row, column);
        var node = FillNode(board[row][column], false, 'blank');
    }

    function LoopThroughBoard(board, callback) {

        for (var row = 0; row < 6; row++) {
            board[row] = [];

            for (var column = 0; column < 7; column++) {
                callback(board, row, column);
            }
        }
        console.log(board);
    }

    function FillNode(node, isFilled, piece) {

        node.isFilled = isFilled;
        node.piece = piece;
    }

    function Node(row, column) {

        this.row = row;
        this.column = column;
        this.isFilled;
        this.piece;
    }

    function CheckColumn(board, node) {
        var count = 0;
        var lastDropped = 1;

        count = CheckDownward(board, node, count);

        return lastDropped + count;
    }

    function CheckDownward(board, node, count) {

        var rowDown;
        if (node.row < 5 && count < 3) {
            rowDown = board[node.row + 1][node.column];

            if (node.piece === rowDown.piece) {
                ++count;

                return CheckDownward(board, rowDown, count);
            }
        }
    
        return count;
    }

    function CheckWinner(board, node) {

        console.log(board);
        console.log(node);

        var connectFour = 0;
        var gameWon = 0;

        connectFour = CheckColumn(board, node);

        console.log(connectFour);
    }

    function UpdateBoardState(event) {

        var button = this;
        console.log(board);
        for (var row = 5; row >= 0; row--) {
            console.log(board[row][button.id]);
            var node = board[row][button.id];
            
            if (!node.isFilled) {
                currentNode = node;
                ++turns;
                FillNode(node, true,playerTurn);
                var elem = $('#col' + button.id + 'row' + row).addClass(playerTurn);

                if (playerTurn === players.playerOne) {
                    playerTurn = players.playerTwo;
                }
                else {
                    playerTurn = players.playerOne;
                }
                console.log(turns);

                break;
            }
        }

        if (turns > 6) {
            console.log('At turns');
            console.log(turns);
            CheckWinner(board, currentNode);
        }    
    }

    

    //##############Checking functions######################



    //############################################################
    //Initial board

    LoopThroughBoard(board, InitiateBoard);


    //##############################################
    //Register click events
    var buttons = document.querySelectorAll('button.column');
    console.log(buttons);
    for (var index = 0; index < buttons.length; index++) {
        buttons[index].addEventListener('click', UpdateBoardState);
    }

    //#########################################
});