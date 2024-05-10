import { Remirror, EditorComponent } from "@remirror/react";
import trash from "../assets/trash.svg"
import threeDots from "../assets/three-dots-vertical.svg"

export default function Editor ({manager, state, setState, getSelectedNote, deleteNote}) {
    return(
        <div className="editor" style={{ display: getSelectedNote() ? "flex" : "none" }}>
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