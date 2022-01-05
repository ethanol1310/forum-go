# Core

- **Single source of truth**: state of application is saved in tree-object.
- **State is read-only**: action to change state.
- **Changes are made with pure functions**: state tree is changed by action, must implement reducers.

To change the state, we must dispatch a action.

## Action

State $\rightarrow$ View $\rightarrow$ (event) Actions $\rightarrow$ Middlewares ($\rightleftarrows$ Api) $\rightarrow$ Dispatcher (+ State) $\rightarrow$ Reducer.

```
{
	type: "action_type",
	payload: // params
}
```

## Action Types

- Define action

```javascript
export const BEFORE_STATE_COMMENT = "BEFORE_STATE_COMMENT"
export const GET_COMMENTS_SUCCESS = "GET_COMMENTS_SUCCESS"
export const GET_COMMENTS_ERROR = "GET_COMMENTS_ERROR"
export const COMMENT_CREATE_SUCCESS = "COMMENT_CREATE_SUCCESS"
export const COMMENT_CREATE_ERROR = "COMMENT_CREATE_ERROR"
export const COMMENT_DELETE_SUCCESS = "COMMENT_DELETE_SUCCESS"
export const COMMENT_DELETE_ERROR = "COMMENT_DELETE_ERROR"
export const COMMENT_UPDATE_SUCCESS = "COMMENT_UPDATE_SUCCESS"
export const COMMENT_UPDATE_ERROR = "COMMENT_UPDATE_ERROR"
```

## Reducer

- Action just describe action, not describe which state of response change.
- Input: 
  - Previous state
  - Action
- Output:
  - New state

```javascript
export const initState = {
    likeItems: [],
    likesError: null
}

export const likesState = (state = initState, action) => {
	const { payload, type } = action;
    switch(type) {
        case GET_LIKES_SUCCESS:
            return {
                ...state,
                likeItems: [...state.likeItems, {postID: payload.postID, likes: payload.likes}]
                likesError: null
            }
    }
}
```



## Store

- `getState()`: get current state.
- `dispatch(action)`: call action.
- `subscrible(listener)`: listen and update View.

```javascript
const counter = (state = 0, action) => {
	switch(action.type) {
		case(action.type) {
			case "INCREMENT":
				return state + 1;
			case "DECREMENT":
				return state - 1;
			default:
				return state;
		}
	}
}

const {createStore} = 'redux'

// Create store for project, parameter is reducer counter
const store = createStore(counter);

store.subcrible(() => {
    document.body.innerText = store.getState();
});

// If we want to increase 1 -> call action with type INCREMENT, using dispatch function 
document.addEventListener('click', () => {
    store.dispatch({type:"INCREMENT"});
});

// Reducer will return new state

// Subcrible wil update state of View

Dispatch(action) -> reducer -> store -> view
```

```javascript
export const fetchLikes = id => {
    return async dispatch => {
        try {
            const res = await axios.get(`$(API_ROUTE)/likes/${id}`)
            dispatch({
                type: GET_LIKES_SUCCESS,
                payload: {
                    postID: id,
                    likes: res.data.response,
                }
            })
        } catch(err) {
            dispatch({
                type: GET_LIKES_ERROR,
                payload: err.response.data.error,
            })
        }
    }
}

export const createLike = id => {
  return async (dispatch) => {
    try {
      const res  = await axios.post(`${API_ROUTE}/likes/${id}`)
      dispatch({ 
        type: LIKE_CREATE_SUCCESS, 
        payload: {
          postID: id,
          oneLike: res.data.response,
        }
      })
    } catch(err){
      dispatch({ type: LIKE_CREATE_ERROR, payload: err.response.data.error })
    }
  }
}


export const deleteLike = details => {
  return async (dispatch) => {
    try {
      await axios.delete(`${API_ROUTE}/likes/${details.id}`)
      dispatch({ 
        type: LIKE_DELETE_SUCCESS, 
        payload: {
          likeID: details.id,
          postID: details.postID,
        }
      })
    } catch(err){
      dispatch({ type: LIKE_DELETE_ERROR, payload: err.response.data.error })
    }
  }
}
```

