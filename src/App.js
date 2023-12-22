import React from 'react'
// R3F imports
import { Canvas } from '@react-three/fiber'
import { FirstPersonControls } from '@react-three/drei'
import { nanoid } from 'nanoid'
// remirror imports 
import { BoldExtension } from 'remirror/extensions';
import { Remirror, useRemirror } from '@remirror/react';
import { prosemirrorNodeToHtml } from 'remirror';
// local imports
import ThreeDNote from './components/ThreeDNote'
import trash from "./assets/trash.svg"
import pencil from "./assets/pencil.svg"
import threeDots from "./assets/three-dots-vertical.svg"

const extensions = () => [new BoldExtension()];

function App() {
    const [notes, setNotes] = React.useState(JSON.parse(localStorage.getItem('notes')) || getNewNotes())
    const { manager, state, setState } = useRemirror({
        extensions,
    })
    const [controllerEnabled, setControllerEnabled] = React.useState(true)

    // make a new first note if there's bothing in local storage
    function getNewNotes() {
        const newNotes = [{
            id: nanoid(),
            text: `<p>This is your first note! Click me to start editing...</p>`,
            selected: false,
            position: [0,0,80],
            doc: {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: `This is your first note! Click me to start editing...`,
                            },
                        ],
                    },
                ],
            }

        }]
        return newNotes
    }

    // map the note objects in state to 3D note elements
    const noteElements = notes.map(note => {
        return (
            <ThreeDNote
                id={note.id}
                position={note.position}
                content={note.text}
                selected={note.selected}
                onClick={() => handleClick(note.id)}
            />
        )
    })

    // helper function that returns selected note
    function getSelectedNote() {
        const selectedNote = notes.find((note) => note.selected === true)
        return selectedNote
    }

    // onClick function for selecting note - also sets the editor text to the note text
    function handleClick(id) {
        const selectedNote = notes.find((note) => note.id === id)
        manager.view.updateState(manager.createState({ content: selectedNote.doc }))

        setNotes(prevNotes => {
            return prevNotes.map(note => {
                return note.id === id ? { ...note, selected: !note.selected } : { ...note, selected: false }
            })
        })
    }

    function deleteNote() {
        const selectedNote = getSelectedNote()
        setNotes(prevNotes => (
            prevNotes.filter(note => note.id !== selectedNote.id)
        ))
    }

    function createNote() {
        const [x, y, z] = Array(3).fill().map(() => Math.random() * 80 - 40)
        const newNote = {
            id: nanoid(),
            text: `<p>This is your new note!</p>`,
            selected: true,
            position: [x, y, z],
            doc: {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: `This is your new note!`,
                            },
                        ],
                    },
                ],
            }
        }
        // deselect notes 
        setNotes(prevNotes => (
            prevNotes.map(note => (
                { ...note, selected: false }
            ))
        ))
        // create new note
        setNotes(prevNotes => [...prevNotes, newNote])
        //update editor to new note
        manager.view.updateState(manager.createState({ content: newNote.doc }))
    }

    // updates selected note when you type in editor
    React.useEffect(() => {
        
        const selectedNote = getSelectedNote()
        if (selectedNote) {
            console.log(prosemirrorNodeToHtml(state.doc))
            setNotes(prevNotes => {
                return prevNotes.map(note => {
                    return (note.id === selectedNote.id
                        ? { ...note, text: prosemirrorNodeToHtml(state.doc), doc: state.doc }
                        : note
                    )
                })
            })
        }
    }, [state])

    //save notes to localStorage whenever they change
    React.useEffect(() => {
        // set selected to false before saving notes
        // this prevents selected notes from being updated with  
        // empty editor state on a new render
        const notesToSave = notes.map(note =>(
            {...note, selected: false}
        ))
        localStorage.setItem('notes', JSON.stringify(notesToSave))
    }, [notes])

    //enables controller
    function controllerOn() {
        setControllerEnabled(true)
    }

    function controllerOff() {
        setControllerEnabled(false)
    }

    React.useEffect(() => {
        // if editor is in focus turn off controls
        if (document.querySelector(".ProseMirror-focused")) {
            controllerOff()
        }
    }, [state])

    return (
        <>
            <Canvas
                camera={{ position: [0, 0, 100] }}
                onPointerMissed={controllerOn}
            >
                {noteElements}

                <FirstPersonControls
                    movementSpeed={50}
                    lookSpeed={0.0025}
                    activeLook={false}
                    enabled={controllerEnabled}
                />

            </Canvas>

            <div className='editor' style={{ display: getSelectedNote() ? "flex" : "none" }}>
                <div className="editor--header">
                    {/* December 14, 2023 at 9:34pm */}
                    &nbsp;
                    <div className="editor--header-icons">
                        <button id="three-dots">
                            <img src={threeDots} />
                        </button>
                        <button id="trash" onClick={deleteNote}>
                            <img src={trash} />
                        </button>
                    </div>
                </div>
                <div className='editor--body'>
                    <Remirror
                        autoRender={'start'}
                        manager={manager}
                        state={state}
                        onChange={(parameter) => {
                            // Update the state to the latest value.
                            setState(parameter.state);
                        }}
                    />
                </div>
            </div>
            <div className='create-note-button-wrapper'>
                <button className='create-note-button' onClick={createNote}>
                    <img src={pencil} />
                </button>
            </div>
        </>
    )
}

export default App;
