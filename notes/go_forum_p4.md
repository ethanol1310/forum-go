# Building the Frontend

## External packages

```json
{
  "name": "forum-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "autoprefixer": "^9.6.5",
    "axios": "^0.19.0",
    "bootstrap": "^4.3.1",
    "dayjs": "^1.8.16",
    "jsonwebtoken": "^8.5.1",
    "lodash": "^4.17.15",
    "moment": "^2.24.0",
    "postcss-cli": "^6.1.3",
    "prop-types": "^15.7.2",
    "react": "^16.10.2",
    "react-dom": "^16.10.2",
    "react-icons": "^3.7.0",
    "react-moment": "^0.9.6",
    "react-redux": "^7.1.1",
    "react-router": "^5.1.2",
    "react-router-dom": "^5.1.2",
    "react-router-redux": "^4.0.8",
    "react-scripts": "3.1.1",
    "react-thunk": "^1.0.0",
    "reactstrap": "^8.0.1",
    "redux": "^4.0.4",
    "redux-react-hook": "^3.4.0",
    "redux-thunk": "^2.3.0",
    "tailwindcss": "^1.1.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^4.1.2",
    "@testing-library/react": "^9.3.0",
    "check-prop-types": "^1.1.2",
    "enzyme": "^3.10.0",
    "enzyme-adapter-react-16": "^1.15.1",
    "enzyme-to-json": "^3.4.2",
    "husky": "^3.0.9",
    "jest": "^24.8.0",
    "jest-enzyme": "^7.1.1",
    "moxios": "^0.4.0",
    "redux-mock-store": "^1.5.3"
  }
}
```



## API Url

```
src
	- apiRoute.js
```

```javascript
let API_ROUTE

process.env.NODE_ENV === 'development'
  ? API_ROUTE = 'http://127.0.0.1:8888/api/v1'
  : API_ROUTE = 'https://chodapi.com/api/v1'

export default API_ROUTE
```

## Authorization

- Since **axios** is used for **api calls**(sending requests to the backend).
- We need to send the authenticated user's **authorization token** to each request they make. Instead of adding the **authorization token** manually, let's do it automatically.

```
authorization
	- authorization.js
```

```javascript
import axios from 'axios';

export default function  setAuthorizationToken(token){
  if (token) {
    axios.defaults.headers.common['Authorization'] =`Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}
```

## History

- We may need to call redirection from our redux action. 
- This is what I mean: When a user creates a post, redirect him to the list of posts available.
- To achieve this, we will use the **createBrowserHistory** function from the history package.

```
src
	- history.js
```

```javascript
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();
```



# Store

```
Assets
authorization
components
store
	- modules
		- likes/posts/comments...
			- action
			- reducer
			- [model]Types
			- index.js
		- index.js
```

## Example posts

### Step 1: Action types

```javascript
export const CREATE_POST_SUCCESS = "CREATE_POST_SUCCESS"
export const CREATE_POST_ERROR = "CREATE_POST_ERROR"
export const FETCH_POSTS = "FETCH_POSTS"
export const FETCH_POSTS_ERROR = "FETCH_POSTS_ERROR"
export const BEFORE_STATE_POST = "BEFORE_STATE_POST"
export const BEFORE_AVATAR_STATE = "BEFORE_AVATAR_STATE"
export const FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS"
export const FORGOT_PASSWORD_ERROR = "FORGOT_PASSWORD_ERROR"
export const RESET_PASSWORD_SUCCESS = "RESET_PASSWORD_SUCCESS"
export const RESET_PASSWORD_ERROR = "RESET_PASSWORD_ERROR"
export const SINGLE_POST_SUCCESS = "SINGLE_POST_SUCCESS"
export const GET_POST_SUCCESS = "GET_POST_SUCCESS"
export const GET_POST_ERROR = "GET_POST_ERROR"
export const UPDATE_POST_SUCCESS = "UPDATE_POST_SUCCESS"
export const UPDATE_POST_ERROR = "UPDATE_POST_ERROR"
export const DELETE_POST_SUCCESS = "DELETE_POST_SUCCESS"
export const DELETE_POST_ERROR = "DELETE_POST_ERROR"
export const FETCH_AUTH_POSTS = "FETCH_AUTH_POSTS"
export const FETCH_AUTH_POSTS_ERROR = "FETCH_AUTH_POSTS_ERROR"
```



### Step 2: Reducer

- Update state when action is detected.

```javascript
import { BEFORE_STATE_POST, FETCH_POSTS, FETCH_POSTS_ERROR, CREATE_POST_SUCCESS, UPDATE_POST_SUCCESS, CREATE_POST_ERROR, UPDATE_POST_ERROR, GET_POST_SUCCESS, GET_POST_ERROR, DELETE_POST_SUCCESS, DELETE_POST_ERROR, FETCH_AUTH_POSTS, FETCH_AUTH_POSTS_ERROR } from '../postsTypes'

export const initState = {
  posts: [],
  authPosts: [],
  post: {},
  postsError: null,
  isLoading: false,
}

export const postsState = (state = initState, action) => {

  const { payload, type } = action
  switch(type) {

    case BEFORE_STATE_POST:
      return {
        ...state,
        postsError: null,
        isLoading: true,
      }
    case FETCH_POSTS:
      return { 
        ...state, 
        posts: payload,
        isLoading: false,
      }
      
    case FETCH_POSTS_ERROR:
      return { 
        ...state, 
        postsError: payload,
        isLoading: false 
      }

    case FETCH_AUTH_POSTS:
      return { 
        ...state, 
        authPosts: payload,
        isLoading: false,
      }

    case FETCH_AUTH_POSTS_ERROR:
      return { 
        ...state, 
        postsError: payload,
        isLoading: false 
      }

    case GET_POST_SUCCESS:
      return { 
        ...state, 
        post: payload,
        postsError: null,
        isLoading: false  
      }

    case GET_POST_ERROR:
      return { 
        ...state, 
        postsError: payload,
        isLoading: false 
      }

    case CREATE_POST_SUCCESS:
      return { 
        ...state, 
        posts: [payload, ...state.posts],
        authPosts: [payload, ...state.authPosts],
        postsError: null,
        isLoading: false  
      }

    case CREATE_POST_ERROR:
      return { 
        ...state, 
        Implementation spostsError: payload,
        isLoading: false  
      }
action
    case UPDATE_POST_SUCCESS:
      return { 
        ...state, 
        posts: state.posts.map(post => 
          post.id === payload.id ? 
          {...post, title: payload.title, content: payload.content } : post
        ),
        authPosts: state.authPosts.map(post => 
          post.id === payload.id ? 
          {...post, title: payload.title, content: payload.content } : post
        ),
        post: payload,
        postsError: null,
        isLoading: false 
      }

    case UPDATE_POST_ERROR:
      return { 
        ...state, 
        postsError: payload,
        isLoading: false  
      }

     case DELETE_POST_SUCCESS:
      return { 
        ...state, 
        posts: state.posts.filter(post => post.id !== payload.deletedID),
        authPosts: state.authPosts.filter(post => post.id !== payload.deletedID),
        postsError: null,
        isLoading: false   
      }

    case DELETE_POST_ERROR:
      return { 
        ...state, 
        postsError: payload,
        isLoading: false  
      }

    default:
      return state
  }
}
```



### Step 3: Action

```javascript
import API_ROUTE from "../../../../apiRoute";
import axios from 'axios'
import { BEFORE_STATE_POST, FETCH_POSTS, FETCH_POSTS_ERROR, GET_POST_SUCCESS, GET_POST_ERROR, CREATE_POST_SUCCESS, CREATE_POST_ERROR, UPDATE_POST_SUCCESS, UPDATE_POST_ERROR, DELETE_POST_SUCCESS, DELETE_POST_ERROR, FETCH_AUTH_POSTS, FETCH_AUTH_POSTS_ERROR  } from '../postsTypes'
import  {history} from '../../../../history'

 
export const fetchPosts = () => {

  return async (dispatch) => {

    dispatch({ type: BEFORE_STATE_POST })

    try {
      const res  = await axios.get(`${API_ROUTE}/posts`)
      // console.log("these are the post: ", res.data.response)
      dispatch({ type: FETCH_POSTS, payload: res.data.response })
    } catch(err){
      dispatch({ type: FETCH_POSTS_ERROR, payload: err.response ? err.respons.data.error : "" })
    }
  }
}

export const fetchPost = id => {

  return async (dispatch) => {

    dispatch({ type: BEFORE_STATE_POST })

    try {
      const res  = await axios.get(`${API_ROUTE}/posts/${id}`)
      dispatch({ type: GET_POST_SUCCESS, payload: res.data.response })
    } catch(err){
      dispatch({ type: GET_POST_ERROR, payload: err.response.data.error })
      history.push('/'); //incase the user manually enter the param that dont exist
    }
  }
}

export const fetchAuthPosts = id => {

  return async (dispatch) => {

    dispatch({ type: BEFORE_STATE_POST })

    try {
      const res  = await axios.get(`${API_ROUTE}/user_posts/${id}`)
      dispatch({ type: FETCH_AUTH_POSTS, payload: res.data.response })
    } catch(err){
      dispatch({ type: FETCH_AUTH_POSTS_ERROR, payload: err.response.data.error })
    }
  }
}

export const createPost = (createPost) => {
  return async (dispatch) => {

    dispatch({ type: BEFORE_STATE_POST })

    try {
      const res = await axios.post(`${API_ROUTE}/posts`, createPost)
      dispatch({ 
        type: CREATE_POST_SUCCESS,  
        payload: res.data.response
      })
      history.push('/');
    } catch(err) {
      dispatch({ type: CREATE_POST_ERROR, payload: err.response.data.error })
    }
  }
}

export const updatePost = (updateDetails, updateSuccess) => {

  return async (dispatch) => {

    dispatch({ type: BEFORE_STATE_POST })

    try {
      const res = await axios.put(`${API_ROUTE}/posts/${updateDetails.id}`, updateDetails)
      dispatch({ 
        type: UPDATE_POST_SUCCESS,
        payload: res.data.response
      })
      updateSuccess()
    } catch(err) {
      dispatch({ type: UPDATE_POST_ERROR, payload: err.response.data.error })
    }
  }
}

export const deletePost = (id) => {

  return async (dispatch) => {

    dispatch({ type: BEFORE_STATE_POST })

    try {
      const res = await axios.delete(`${API_ROUTE}/posts/${id}`)
      dispatch({ 
        type: DELETE_POST_SUCCESS,
        payload: {
          deletedID: id,
          message: res.data.response
        } 
      })
      history.push('/');
    } catch(err) {
      dispatch({ type: DELETE_POST_ERROR, payload: err.response.data.error })
    }
  }
}
```



### Step 4: Combine into store

- `index.js` combine reducers $\rightarrow$ reducer $\rightarrow$ store

```javascript
import { combineReducers } from "redux"
import authReducer  from './auth/reducer/authReducer'
import { postsState }  from "./posts/reducer/postsReducer";
import { likesState } from './likes/reducer/likesReducer'
import { commentsState } from './comments/reducer/commentsReducer'


const reducer = combineReducers({
  Auth: authReducer,
  PostsState: postsState,
  LikesState: likesState,
  CommentsState: commentsState
})

export default reducer
```

- Create store

```javascript
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducer from './modules/index'


// FOR LOCAL BUILD
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore(
//   reducer,  
//   composeEnhancers(
//     applyMiddleware(thunk)
//   )
// );

// FOR PRODUCTION BUILD
const store = createStore(
    reducer,  
      applyMiddleware(thunk)
  );

export default store;
```

# Components

```
components
	- Dashboard.js
	- Navigation.js
	- Navigation.css
	- auth/
	- comments/
	- likes/
	- posts/
	- users/
	- utils/
```

# Wiring up the route

```
Route.js
```



# Wiring up the app main entry

```
index.js
```







