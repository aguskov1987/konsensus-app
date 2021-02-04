import {YardService} from "../../Services/YardService";
import {
    hiveLoadedAction,
    hiveLoadFailedAction,
    hiveSearchFailedAction,
    newHiveCreatedAction,
    newHiveFailedAction,
    searchedHivesFoundAction,
    userSavedHivesLoaded,
    userSavedHivesLoadFailedAction
} from "../Actions";
import {AxiosError} from "axios";

export function loadUserSavedHives(): any {
    return async function loadUserSavedHivesThunk(dispatch: any, getState: any) {
        YardService.loadUserSavedHives().then((response) => {
            dispatch(userSavedHivesLoaded(response.data));
        }).catch((error: AxiosError) => {
            if (error.response) {
                dispatch(userSavedHivesLoadFailedAction(error.code + ': ' + error.message))
            } else {
                dispatch(userSavedHivesLoadFailedAction(error.message));
            }
        });
    }
}

export function loadHive(id: string): any {
    return async function loadHiveThunk(dispatch: any, getState: any) {
        YardService.loadHive(id).then((hive) => {
            dispatch(hiveLoadedAction(hive.data));
        }).catch((error: AxiosError) => {
            if (error.response) {
                dispatch(hiveLoadFailedAction(error.code + ': ' + error.message))
            } else {
                dispatch(hiveLoadFailedAction(error.message));
            }
        });
    }
}

export function postNewHive(title: string, description: string): any {
    return async function postNewHiveThunk(dispatch: any, getState: any) {
        YardService.createNewHive(title, description).then((response) => {
            dispatch(newHiveCreatedAction(YardService.convertToViewModel(response.data)))
        }).catch((error: AxiosError) => {
            if (error.response) {
                dispatch(newHiveFailedAction(error.code + ': ' + error.message))
            } else {
                dispatch(newHiveFailedAction(error.message));
            }
        });
    }
}

export function searchYard(phrase: string): any {
    return async function searchYardThunk(dispatch: any, getState: any) {
        YardService.loadSearchResults(phrase).then((response) => {
            dispatch(
                searchedHivesFoundAction(
                    response.data
                        .map(
                            (manifest) => YardService.convertToViewModel(manifest)
                        )
                )
            );
        }).catch((error: AxiosError) => {
            if (error.response) {
                dispatch(hiveSearchFailedAction(error.code + ': ' + error.message))
            } else {
                dispatch(hiveSearchFailedAction(error.message));
            }
        })
    }
}

export function loadYardStart(): any {
    return async function loadYardStart(dispatch: any, getState: any) {
        YardService.loadInitialYard().then((response) => {
            dispatch(
                searchedHivesFoundAction(
                    response.data
                        .map(
                            (manifest) => YardService.convertToViewModel(manifest)
                        )
                )
            );
        }).catch((error: AxiosError) => {
            if (error.response) {
                dispatch(hiveSearchFailedAction(error.code + ': ' + error.message))
            } else {
                dispatch(hiveSearchFailedAction(error.message));
            }
        })
    }
}