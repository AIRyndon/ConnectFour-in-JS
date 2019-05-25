// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

var board = [];

function InitialBoard(board, row, column) {

    board[column][row] = new Node(row, column);
    var node = FillNode(board[column][row], 0, 'white');
    console.log(node);
}

function LoopThroughBoard(board, callback) {

    for (var column = 0; column < 7; column++) {
        board[column] = [];

        for (var row = 0; row < 6; row++) {
            InitialBoard(board, row, column);
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

LoopThroughBoard(board,InitialBoard);
