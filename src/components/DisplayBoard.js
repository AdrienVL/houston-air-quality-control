import React from 'react'

export const DisplayBoard = ({ getPing}) => {

    const headerStyle = {

        width: '100%',
        padding: '2%',
        backgroundColor: "red",
        color: 'white',
        textAlign: 'center'
    }
    
    return(
        <div style={{backgroundColor:'green'}} className="display-board">
            <h4 style={{color: 'white'}}>Ping Created</h4>
            <div className="btn">
                <button type="button" onClick={(e) => getPing()} className="btn btn-warning">Get Ping</button>
            </div>
        </div>
    )
}