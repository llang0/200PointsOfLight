import { Remirror, EditorComponent } from "@remirror/react";

import Menu from "./Menu";

export default function Editor ({manager, state, setState, getSelectedNote, deleteNote}) {
    return(
        <div className="editor" style={{ display: getSelectedNote() ? "flex" : "none" }}>
                 <Menu deleteNote={deleteNote}/>
             <div className="editor--body">
                <Remirror
                    manager={manager}
                    state={state}
                    onChange={(parameter) => {setState(parameter.state);}}
                >
                    <EditorComponent/>
                </Remirror>
            </div>
        </div>
    );
}