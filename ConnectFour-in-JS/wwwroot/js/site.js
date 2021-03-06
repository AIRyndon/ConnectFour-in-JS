﻿// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

$(function () {

    var board = [];
    var turns = 0;
    var gameWon = false;
    var statusText = document.querySelector('h1.display-4');
    var players = {
        playerOne: 'player-one',
        playerTwo: 'player-two'
    };
    var playerTurn = players.playerOne;
    var currentNode = Object;

    //##############################################
    //Register click events

    var buttons = document.querySelectorAll('button.column');

    for (var index = 0; index < buttons.length; index++) {
        buttons[index].addEventListener('click', UpdateBoardState);
    }

    document.getElementById('reset').querySelector('button')
        .addEventListener('click', ResetGame);  

    //##############################################
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

    function CheckRow(board, node) {

        var countLeft = 0;
        var countRight = 0;
        var lastDropped = 1;

        countLeft = CheckLeft(board, node, countLeft);

        if (countLeft < 3) {
            countRight = CheckRight(board, node, countRight);
        }

        return lastDropped + countLeft + countRight;
    }

    function CheckLeft(board, node, count) {
        var columnLeft;

        if (node.column > 0 && count < 3) {

            columnLeft = board[node.row][node.column - 1];

            if (node.piece === columnLeft.piece) {

                ++count;
                return CheckLeft(board, columnLeft, count);
            }
        }

        return count;
    }

    function CheckRight(board, node, count) {
        var columnRight;

        if (node.column < 6 && count < 3) {
            columnRight = board[node.row][node.column + 1];

            if (node.piece === columnRight.piece) {

                ++count;
                return CheckRight(board, columnRight, count);
            }
        }

        return count;
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

    function CheckFwdDiag(board, node) {
        var fwdDiagUp = 0;
        var fwdDiagDown = 0;
        var lastDropped = 1;

        fwdDiagUp = CheckFwdDiagUp(board, node, fwdDiagUp);

        if (fwdDiagUp < 3) {
            fwdDiagDown = CheckFwdDiagDown(board, node, fwdDiagDown);
        }

        return lastDropped + fwdDiagUp + fwdDiagDown;
    }

    function CheckFwdDiagUp(board, node, count) {

        var diagUp;
        if (node.row > 0 && node.column < 6 && count < 3) {
            diagUp = board[node.row - 1][node.column + 1];

            if (node.piece === diagUp.piece) {

                ++count;
                return CheckFwdDiagUp(board, diagUp, count);
            }
        }

        return count;
    }

    function CheckFwdDiagDown(board, node, count) {

        var diagDown;
        if (node.row < 5 && node.column > 0 && count < 3) {
            diagDown = board[node.row + 1][node.column - 1];

            if (node.piece === diagDown.piece) {

                ++count;
                return CheckFwdDiagDown(board, diagDown, count);
            }
        }

        return count;
    }

    function CheckBackDiag(board, node) {
        var backDiagUp = 0;
        var backDiagDown = 0;
        var lastDropped = 1;

        backDiagUp = CheckBackDiagUp(board, node, backDiagUp);

        if (backDiagUp < 3) {
            backDiagDown = CheckBackDiagDown(board, node, backDiagDown);
        }

        return lastDropped + backDiagUp + backDiagDown;
    }

    function CheckBackDiagUp(board, node, count) {

        var nextNode;
        if (node.row > 0 && node.column > 0 && count < 3) {
            nextNode = board[node.row - 1][node.column - 1];

            if (node.piece === nextNode.piece) {

                ++count;
                return CheckBackDiagUp(board, nextNode, count);
            }
        }

        return count;
    }

    function CheckBackDiagDown(board, node, count) {

        var nextNode;
        if (node.row < 5 && node.column < 6 && count < 3) {
            nextNode = board[node.row + 1][node.column + 1];

            if (node.piece === nextNode.piece) {

                ++count;
                return CheckBackDiagDown(board, nextNode, count);
            }
        }

        return count;
    }

    function CheckWinner(board, node) {

        var connectFour = 0;

        connectFour = CheckColumn(board, node);

        if (connectFour < 4) {
            connectFour = CheckRow(board, node);
        }

        if (connectFour < 4) {
            connectFour = CheckFwdDiag(board, node);
        }

        if (connectFour < 4) {
            connectFour = CheckBackDiag(board, node);
        }

        if (connectFour === 4) {

            gameWon = true;
            DisableDiscButtons(true);

            playerTurn === 'player-one' ? statusText.innerHTML = 'Player Two Won!'
                : statusText.innerHTML = 'Player One Won!';
        }
    }

    function DisableDiscButtons(bool) {
        for (var index = 0; index < buttons.length; index++) {
            buttons[index].disabled = bool;
        }
    }

    function UpdateBoardState(event) {

        var button = this;

        for (var row = 5; row >= 0; row--) {

            var node = board[row][button.id];

            if (!node.isFilled) {

                currentNode = node;
                ++turns;

                FillNode(node, true, playerTurn);
                document.getElementById('col' + button.id + 'row' + row).classList.add(playerTurn);

                UpdatePlayerTurn();

                break;
            }
        }

        if (turns > 6 && turns <= 42) {
            CheckWinner(board, currentNode);
        }

        if (turns >= 42 && !gameWon) {          
            statusText.innerHTML = 'Its a tie! No one won this game.';
        }
    }

    function UpdatePlayerTurn() {

        if (playerTurn === 'player-one') {
            statusText.innerHTML = 'Player Two';
            playerTurn = players.playerTwo;
        }
        else {
            statusText.innerHTML = 'Player One';
            playerTurn = players.playerOne;
        }
    }

    function ResetGame() {

        turns = 0;
        gameWon = false;
        playerTurn = players.playerOne;
        currentNode = Object;
        statusText.innerHTML = 'Player One';

        var cells = document.querySelectorAll('div.row');

        for (var index = 0; index < cells.length; index++) {
            cells[index].className = 'row';
        }

        DisableDiscButtons(false);
        LoopThroughBoard(board, InitiateBoard);
    }

    //############################################################
    //Starting board

    LoopThroughBoard(board, InitiateBoard);

});