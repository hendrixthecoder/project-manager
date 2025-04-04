export const state = () => ({
    boards: [
        {
            id: 1,
            name: "Default Board",
            cards: [
                {
                    id: 1,
                    text: "Default card text, buy new sneakers tomorrow."
                }
            ]
        }
    ],
    darkMode: false,
    draggedCardInfo: {
        cardId: null,
        boardId: null
    }
})

export const actions = {
    async initializeBoards({ commit, state }) {
        const defaultBoard = state.boards[0]
        let boards = localStorage.getItem("boards")
        if (boards) boards = JSON.parse(boards)
        else boards = [defaultBoard]

        commit("setBoards", boards);
    }
}

export const getters = {
    getBoards(state) {
        return state.boards
    },
    getDarkModeState(state) {
        return state.darkMode
    }
}

export const mutations = {
    toggleDarkMode(state, payload) {
        return state.darkMode = payload
    },
    setBoards(state, payload) {
        return state.boards = payload
    },
    addBoard(state, payload) {
        const newBoard = {
            id: Math.floor(Math.random() * 10000000) + 1,
            name: payload.name,
            cards: []
        }

        state.boards.push(newBoard)

        const newBoardState = JSON.stringify(state.boards)
        localStorage.setItem("boards", newBoardState)
    },
    addCardToBoard(state, payload) {
        const { boardId, card } = payload;
        const boardIndex = state.boards.findIndex((board) => board.id == boardId)
        if (boardIndex !== -1) {
            const id = Math.floor(Math.random() * 100000) + 1
            state.boards[boardIndex].cards = [...state.boards[boardIndex].cards, { id, text: card }]
        }

        const newBoardState = JSON.stringify(state.boards);
        localStorage.setItem("boards", newBoardState);
    },
    removeCardFromBoard(state, payload) {
        const { cardId, boardId } = payload;
        state.boards.forEach((board) => {
            if (board.id == boardId) {
                board.cards = board.cards.filter((card) => card.id != cardId)
            }
        })

        const newBoardState = JSON.stringify(state.boards);
        localStorage.setItem("boards", newBoardState);
    },
    removeBoard(state, payload) {
        const { boardId } = payload;
        const indexToRemove = state.boards.findIndex(board => board.id === boardId);

        if (indexToRemove !== -1) {
            state.boards.splice(indexToRemove, 1);

            const newBoardState = JSON.stringify(state.boards);
            localStorage.setItem("boards", newBoardState);
        } 
    },
    changeCardPosition(state, payload) {
        const { cardId, boardId, newBoardId, replacedCardId, indexToShiftBy } = payload;

        const oldBoardIndex = state.boards.findIndex(board => board.id === boardId);
        const newBoardIndex = state.boards.findIndex(board => board.id === newBoardId);
        if (oldBoardIndex === -1 || newBoardIndex === -1) return;

        const oldBoard = state.boards[oldBoardIndex];
        const newBoard = state.boards[newBoardIndex];

        const cardToMoveIndex = oldBoard.cards.findIndex(card => card.id === cardId);
        if (cardToMoveIndex === -1) return;

        const cardToMove = oldBoard.cards[cardToMoveIndex];
        const cardToReplaceIndex = newBoard.cards.findIndex(card => card.id === replacedCardId);
        if (cardToReplaceIndex === -1) return;

        // Prevent redundant move (dragging to its own position)
        if (oldBoardIndex === newBoardIndex && cardToReplaceIndex + indexToShiftBy === cardToMoveIndex) return;

        // Remove card from old board
        oldBoard.cards.splice(cardToMoveIndex, 1);

        // Determine target index for insertion
        let insertIndex = cardToReplaceIndex;
        if (indexToShiftBy === 1) insertIndex += 1;

        // Adjust insert index if card was removed before insertion point on same board
        if (oldBoardIndex === newBoardIndex && cardToMoveIndex < insertIndex) {
            insertIndex -= 1;
        }

        // Insert card at new position
        newBoard.cards.splice(insertIndex, 0, cardToMove);

        // Persist updated state
        const newBoardState = JSON.stringify(state.boards);
        localStorage.setItem("boards", newBoardState);
    },
    changeCardName(state, payload) {
        const { boardId, newName } = payload;
        const oldBoardIndex = state.boards.findIndex(board => board.id === boardId);
        if (oldBoardIndex !== -1) { 
            state.boards[oldBoardIndex].name = newName;

            const newBoardState = JSON.stringify(state.boards);
            localStorage.setItem("boards", newBoardState);
        }
        
    },
    editCardText(state, payload) {
        const { cardId, boardId, text } = payload;
        if (!cardId || !boardId || !text) return;

        const boardIndex = state.boards.findIndex((board) => board.id === boardId)
        const cardIndex = state.boards[boardIndex].cards.findIndex((card) => card.id === cardId)

        if (cardIndex !== -1) {
            state.boards[boardIndex].cards[cardIndex].text = text;

            const newBoardState = JSON.stringify(state.boards);
            localStorage.setItem("boards", newBoardState);
        }

    },
    updateDraggedCardInfo(state, payload) {
        const { cardId, boardId } = payload;

        state.draggedCardInfo = { cardId, boardId }
    },
    pushCardToBoard(state, payload) {
        const { newBoardId, cardId, boardId } = payload;

        const oldBoardIndex = state.boards.findIndex(board => board.id === boardId)
        const newBoardIndex = state.boards.findIndex(board => board.id === newBoardId)
        if (oldBoardIndex === -1 || newBoardIndex === -1) return;

        const oldBoard = state.boards[oldBoardIndex];

        const boardHasCards = oldBoard.cards.length;
        if (boardHasCards && newBoardId === boardId) return;
        
        const cardToMoveIndex = oldBoard.cards.findIndex(card => card.id === cardId)

        if (cardToMoveIndex === -1) return;

        const card = state.boards[oldBoardIndex].cards.splice(cardToMoveIndex, 1)[0]
        state.boards[newBoardIndex].cards.push(card)

        const newBoardState = JSON.stringify(state.boards);
        localStorage.setItem("boards", newBoardState);
    }
}