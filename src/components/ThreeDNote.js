import React from "react";
import { Interweave } from 'interweave'
import { Html } from '@react-three/drei'

export default function ThreeDNote(props) {
    const styles ={
        backgroundColor: props.selected ? "#FFC42B" : "white"
    }

    return (
        <Html
            transform
            position={props.position}
            zIndexRange={[2000,0]}

        >
            <div 
                className='note' 
                style={styles}
                onClick={props.onClick}
            >
                <Interweave content={props.content} disableLineBreaks={true}/>
            </div>
        </Html>
    )
}