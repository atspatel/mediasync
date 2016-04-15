import { handleActions } from 'redux-actions'

const initialState = {
  display: {
    openPanel: 0,
    chat: [],
    searchResults: {
      items: []
    }
  },
  roomDetails: {
    name: '',
    connectedUsers: [],
    controllers: [],
    queue: [],
    playing: true,
    played: 0,
    seeking: false,
    clientAction: false
  },
  connectedCredentials: {},
  player: {}
}

var colors = ['#111', '#ab0', '#d3a', '#22d']
var randomColor = function () {
  return colors[Math.floor(Math.random() * colors.length)]
}

export default handleActions({
  'HANDLE_PANEL_CLICK' (state, action) {
    if (action.payload !== state.openPanel) {
      return {
        ...state,
        display: {
          ...state.display,
          openPanel: action.payload
        }
      }
    }

    return state
  },

  'RECEIVED_CHAT_MESSAGE' (state, action) {
    var chat = state.display.chat
    chat.push(action.payload)
    return {
      ...state,
      display: {
        ...state.display,
        chat: chat
      }
    }
  },

  'ENTER_ROOM' (state, action) {
    action.payload.connectedUsers.forEach(function (elem) {
      elem.color = randomColor()
    })
    action.payload.played = 0
    action.payload.playing = false
    return {
      ...state,
      roomDetails: action.payload
    }
  },

  'LEAVE_ROOM' (state, action) {
    return {
      display: {
        openPanel: 0,
        chat: [],
        searchResults: {
          items: []
        }
      },
      roomDetails: {
        name: '',
        connectedUsers: [],
        controllers: [],
        queue: [],
        playing: true,
        played: 0,
        seeking: false,
        clientAction: false
      },
      connectedCredentials: {}
    }
  },

  'USER_JOINED_ROOM' (state, action) {
    var connectedUsers = state.roomDetails.connectedUsers
    var chat = state.display.chat
    if (!connectedUsers.some(function (elem, ind) {
      if (elem.name === action.payload.name && elem.username === action.payload.username) {
        return true
      }
    })) {
      action.payload.color = randomColor()
      connectedUsers.push(action.payload)
      chat.push({ roomMessage: true, messageType: 'userJoined', user: action.payload.username })
    }
    return {
      ...state,
      display: {
        ...state.display,
        chat: chat
      },
      roomDetails: {
        ...state.roomDetails,
        connectedUsers: connectedUsers
      }
    }
  },

  'USER_LEFT_ROOM' (state, action) {
    var connectedUsers = state.roomDetails.connectedUsers
    var i = -1
    if (connectedUsers.some(function (elem, ind) {
      if (elem.name === action.payload.name && elem.username === action.payload.username) {
        i = ind
        return true
      }
    })) {
      connectedUsers.splice(i, 1)
    }
    return {
      ...state,
      roomDetails: {
        ...state.roomDetails,
        connectedUsers: connectedUsers
      }
    }
  },

  'PLAY_MEDIA' (state, action) {
    return {
      ...state,
      roomDetails: {
        ...state.roomDetails,
        playing: true,
        clientAction: action.payload || false
      }
    }
  },

  'PAUSE_MEDIA' (state, action) {
    return {
      ...state,
      roomDetails: {
        ...state.roomDetails,
        playing: false,
        clientAction: action.payload || false
      }
    }
  },

  'SKIP_MEDIA' (state, action) {
    var queue = state.roomDetails.queue
    queue.push(queue.shift())
    return {
      ...state,
      roomDetails: {
        ...state.roomDetails,
        queue: queue,
        playing: true,
        played: 0,
        clientAction: action.payload || false
      }
    }
  },

  'BACK_MEDIA' (state, action) {
    var queue = state.roomDetails.queue
    queue.unshift(queue.pop())
    return {
      ...state,
      roomDetails: {
        ...state.roomDetails,
        queue: queue,
        playing: true,
        played: 0,
        clientAction: action.payload || false
      }
    }
  },

  'SEEKING' (state, action) {
    return {
      ...state,
      roomDetails: {
        ...state.roomDetails,
        seeking: true
      }
    }
  },

  'SEEK_TO' (state, action) {
    return {
      ...state,
      roomDetails: {
        ...state.roomDetails,
        played: action.payload
      }
    }
  },

  'SEEKING_DONE' (state, action) {
    return {
      ...state,
      roomDetails: {
        ...state.roomDetails,
        seeking: false,
        clientAction: true
      }
    }
  },

  'DURATION' (state, action) {
    return {
      ...state,
      roomDetails: {
        ...state.roomDetails,
        duration: action.payload
      }
    }
  },

  'SEARCH_RESULTS' (state, action) {
    return {
      ...state,
      display: {
        ...state.display,
        searchResults: action.payload
      }
    }
  },

  'SEARCHING' (state, action) {
    return {
      ...state,
      display: {
        ...state.display,
        searchedFor: action.payload
      }
    }
  },

  'DELETE_FROM_QUEUE' (state, action) {
    var q = state.roomDetails.queue
    q.splice(action.playload, 1)
    return {
      ...state,
      roomDetails: {
        ...state.roomDetails,
        queue: q
      }
    }
  },

  'ADD_TO_QUEUE' (state, action) {
    var q = state.roomDetails.queue
    q.push(action.playload)
    return {
      ...state,
      roomDetails: {
        ...state.roomDetails,
        queue: q
      }
    }
  },

  'CURRENT_QUEUE' (state, action) {
    return {
      ...state,
      roomDetails: {
        ...state.roomDetails,
        queue: action.payload
      }
    }
  },

  'RECEIVED_ROOM_CREDENTIALS' (state, action) {
    return {
      ...state,
      connectedCredentials: action.payload
    }
  }
}, initialState)
