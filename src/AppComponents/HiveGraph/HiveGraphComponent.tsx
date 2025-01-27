import React from "react";
import PointSearchComponent from "../PointSearch/PointSearchComponent";
import GraphCanvasComponent from "../GraphCanvas/GraphCanvasComponent";
import {withRouter} from "react-router-dom";
import {History} from 'history'
import {UserState} from "../../AppState/UserState";
import {Subscription} from "rxjs";
import {UserService} from "../../Services/UserService";
import {User} from "../../AppState/User";
import {LoadingStatus} from "../../AppState/LoadingStatus";
import {HiveManifest} from "../../AppState/HiveManifest";
import './HiveGraphStyle.scss';
import {ActiveHiveState} from "../../AppState/ActiveHiveState";


class HiveGraphComponent extends React.Component<any, any> {
    private history: History;
    private statusSub: Subscription = new Subscription();
    private userSub: Subscription = new Subscription();
    private hiveSub: Subscription = new Subscription();

    constructor(props: any) {
        super(props);
        this.history = props.history;

        this.state = {
            userLoadingStatus: LoadingStatus.Ready,
            user: new User(),
            activeHiveName: ''
        }
    }

    componentDidMount() {
        this.statusSub = UserState.user.statusUpdatedEvent.subscribe((status) => {
            this.setState({
                userLoadingStatus: status
            })
        })

        this.userSub = UserState.user.valueUpdatedEvent.subscribe((user: User) => {
            if (!user) {
                return;
            }

            this.setState({
                user: user
            });
            if (!user.defaultHiveId) {
                this.history.push("/yard");
            } else {
                ActiveHiveState.loadDefaultHive(user.defaultHiveId);
            }
        });

        this.hiveSub = ActiveHiveState.activeHiveManifest.valueUpdatedEvent.subscribe((manifest: HiveManifest) => {
            if (!manifest) {
                return;
            }
            this.setState({
                activeHiveName: manifest.title
            })
        })

        if (!UserService.isJwtValid()) {
            this.history.push("/enter");
        } else {
            UserState.loadUser();
        }
    }

    componentWillUnmount() {
        this.statusSub.unsubscribe();
        this.userSub.unsubscribe();
        this.hiveSub.unsubscribe();
    }

    render() {
        return (
            <React.Fragment>
                <div className='details-panel'>
                    <div className='hive-name-container'>{this.state.activeHiveName}</div>
                    <div className='search-container'><PointSearchComponent/></div>
                </div>
                <GraphCanvasComponent/>
            </React.Fragment>
        )
    }
}

export default withRouter(HiveGraphComponent);