// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

$(function () {

    var board = [];
    var players = {
        playerOne: 'player-one',
        playerTwo: 'player-two'
    };

    var playerTurn = players.playerOne;

    function InitiateBoard(board, row, column) {

        board[column][row] = new Node(row, column);
        var node = FillNode(board[column][row], false, 'white');
    }

    function LoopThroughBoard(board, callback) {

        for (var column = 0; column < 7; column++) {
            board[column] = [];

            for (var row = 0; row < 6; row++) {
                callback(board, row, column);
            }
        }
    }

    function FillNode(node, isFilled, color) {

        node.isFilled = isFilled;
        node.color = color;

        return node;
    }

    function Node(row, column) {

        this.row = row;
        this.column = column;
        this.isFilled;
        this.color;
    }

    function UpdateBoardState(event) {

        var button = this;
        console.log(board);
        for (var row = 5; row >= 0; row--) {
            var node = board[row][button.id];

            if (!node.isFilled) {

                FillNode(node, true);
                var elem = $('#col' + button.id + 'row' + row).addClass(playerTurn);

                if (playerTurn === players.playerOne) {
                    playerTurn = players.playerTwo;
                }
                else {
                    playerTurn = players.playerOne;
                }
                break;
            }
        }
    }

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
});