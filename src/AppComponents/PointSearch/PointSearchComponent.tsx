import React from "react";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import {Button, InputGroup} from "react-bootstrap";
import {LoadingStatus} from "../../AppState/LoadingStatus";
import {FoundPoint} from "../../AppState/FoundPoint";
import {ActiveHiveState} from "../../AppState/State";
import {concat, Subscription} from "rxjs";
import {History} from "history";
import {withRouter} from "react-router-dom";

class InternalState {
    public query: string = '';
    public loadingStatus: LoadingStatus = LoadingStatus.Ready;
    public found: FoundPoint[] = [];
}


// The component uses react-bootstrap-typeahead
// https://github.com/ericgio/react-bootstrap-typeahead
class PointSearchComponent extends React.Component<any, InternalState> {
    private timer: any;
    private foundSub: Subscription = new Subscription();
    private foundStatusSub: Subscription = new Subscription();
    private history: History;

    private textSub: Subscription = new Subscription();
    private graphSub: Subscription = new Subscription();

    constructor(props: any) {
        super(props);

        this.state = new InternalState();
        this.history = this.props.history;

        this.dummy = this.dummy.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
        this.loadPoint = this.loadPoint.bind(this);
        this.createPoint = this.createPoint.bind(this);
    }

    public componentDidMount() {
        this.foundSub = ActiveHiveState.foundPoints.valueUpdatedEvent.subscribe((points) => {
            if (!points) {
                return;
            }

            this.setState({
                found: points
            })
        });
        this.foundStatusSub = ActiveHiveState.foundPoints.statusUpdatedEvent.subscribe((status) => {
            if (!status) {
                return;
            }

            this.setState({
                loadingStatus: status
            })
        });
    }

    private dummy(query: string) {
    }

    private handleLoadSearchResults() {
        ActiveHiveState.searchPoints(this.state.query);
    }

    public componentWillUnmount() {
        this.foundSub.unsubscribe();
        this.foundStatusSub.unsubscribe();
        this.textSub.unsubscribe();
        this.graphSub.unsubscribe();
    }

    render() {
        const filterBy = () => true;
        return (
            <div>
                <InputGroup className="mb-3" size="sm">
                    <AsyncTypeahead
                        emptyLabel="No Results"
                        id="search-point-typeahead"
                        size="small"
                        isLoading={this.state.loadingStatus === LoadingStatus.Pending}
                        onSearch={this.dummy}
                        options={this.state.found}
                        filterBy={filterBy}
                        onInputChange={this.updateQuery}
                        onChange={this.loadPoint}
                        renderMenuItemChildren={(option: FoundPoint) => (
                            <React.Fragment>{option.label}</React.Fragment>
                        )}>
                    </AsyncTypeahead>
                    <InputGroup.Append>
                        <Button variant="secondary" onClick={this.createPoint}>New</Button>
                    </InputGroup.Append>
                </InputGroup>
            </div>
        )
    }

    private updateQuery(event: any) {
        this.setState({query: event});

        clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            this.handleLoadSearchResults();
            this.timer = null;
        }, 1000)
    }

    private createPoint() {
        this.textSub = ActiveHiveState.newPointText.onStash.subscribe(() => {
            ActiveHiveState.newPointText.put(this.state.query);
        });

        this.graphSub = concat(ActiveHiveState.newPointText.onStashed, ActiveHiveState.graphStash.onStashed)
            .subscribe((a, b) => {
                this.history.push('new-point');
            })

        ActiveHiveState.newPointText.stash();
        ActiveHiveState.graphStash.stash();
    }

    private loadPoint(event: FoundPoint[]) {
        if (event && event.length && event.length === 1) {
            ActiveHiveState.loadSubgraph(event[0].id);
        }
    }
}

export default withRouter(PointSearchComponent);