import React from "react";
import {Modal} from "react-bootstrap";
import {connect} from "react-redux";
import {AppState} from "../../AppState/AppState";
import MyHives from "./MyHives";
import {closeMyHivesAction} from "../../AppState/Actions";

class MyHivesModal extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.onHide = this.onHide.bind(this);
    }

    onHide() {
        this.props.closeMyHivesAction();
    }

    render() {
        let header;
        if (this.props.defaultHive) {
            header = (
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div>
                            <span style={{float: 'left'}}><img src="Images/my_saved_hives.svg" style={{height: 45, width: 45}}/></span>
                            <span>My Hives</span>
                        </div>
                    </Modal.Title>
                </Modal.Header>)
        } else {
            header = (
                <Modal.Header>
                    <Modal.Title>
                        <div>
                            <span style={{float: 'left'}}><img src="Images/my_saved_hives.svg" style={{height: 45, width: 45}}/></span>
                            <span>My Hives</span>
                        </div>
                    </Modal.Title>
                </Modal.Header>)
        }
        return (
            <Modal show={this.props.show} onHide={this.onHide} size="lg">
                {header}
                <Modal.Body>
                    <MyHives/>
                </Modal.Body>
            </Modal>
        )
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        show: state.savedHivesOpen,
        defaultHive: state.user.defaultHiveId
    }
}

export default connect(mapStateToProps, {closeMyHivesAction})(MyHivesModal)