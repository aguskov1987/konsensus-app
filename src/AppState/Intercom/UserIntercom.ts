import {UserService} from "../../Services/UserService";
import {ApiUser} from "../../ApiModels/ApiUser";
import {HiveService} from "../../Services/HiveService";
import {
    hiveInfoLoadedAction,
    openMyHivesAction,
    userLoadedAction,
    userLoginFailedAction,
    userLoggedInAction
} from "../Actions";

/***
 * This composed function takes in username and password, logs in the user, loads the user
 * and retrieves the default hive overview if one is present on the user
 * @param username
 * @param password
 */
export function loginAndLoadUserAndLoadHive(username: string, password: string) {
    return async function loginThunk(dispatch: any, getState: any) {
        fetchLogin(dispatch, username, password).then(() => {
            fetchUser(dispatch).then((action) => {
                if (action.payload.currentHiveId) {
                    fetchHiveInfo(dispatch, action.payload.currentHiveId).then(() => {})
                } else {
                    dispatch(openMyHivesAction())
                }
            })
        }).catch((reason: any) => {
            dispatch(userLoginFailedAction())
        });
    }
}

/***
 * This composed function loads the user and retrieves the default hive overview if one is present on the user
 */
export function loadUserAndLoadHive() {
    return async function loadUserThunk(dispatch: any, getState: any) {
        fetchUser(dispatch).then((action) => {
            if (action.payload.currentHiveId) {
                fetchHiveInfo(dispatch, action.payload.currentHiveId).then(() => {})
            } else {
                dispatch(openMyHivesAction())
            }
        })
    }
}

async function fetchLogin(dispatch: any, username: string, password: string) {
    let jwt = await UserService.login(username, password);
    UserService.clearJwt();
    UserService.saveJwt(jwt);
    return dispatch(userLoggedInAction());
}

async function fetchUser(dispatch: any) {
    let user: ApiUser = await UserService.loadUser()
    return dispatch(userLoadedAction(user));
}

async function fetchHiveInfo(dispatch: any, hiveId: string) {
    let info = await HiveService.loadHiveOverview(hiveId);
    return dispatch(hiveInfoLoadedAction(info));
}
