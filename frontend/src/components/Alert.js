import React from 'react';

function Alert(props) {
    return (

        // if props.alert exist then return the template
        props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show text-center`} role="alert">
            <strong>{props.alert.msg}</strong>
            <button type="button" className="btn-close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
}

export default Alert;