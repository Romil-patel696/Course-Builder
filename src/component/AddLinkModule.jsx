import { useState, useId } from "react"
import {ModalField,ModalBody,ModalTitle,ModalButtons,Modal } from "./Modal"
function AddLinkModuleModal({ setModel, setData }) {
    const [url, setUrl] = useState("")
    const [displayName, setDisplayName] = useState("")

    const id = useId()
    const handleCreateModule = () => {
        if (url && displayName) {
            setData(p => [...p,
            {
                id: id,
                type: "link",
                url: url,
                displayName: displayName,
                moduleId: null

            }

            ])
            setModel({type:""})
        }
    }
    return (
        <Modal>
            <ModalTitle setModel={setModel} title="Add a link" />
            <ModalBody>
                <ModalField fieldValue={url} setField={setUrl} focus={true} fieldName="URL" />
                <ModalField fieldValue={displayName} setField={setDisplayName} fieldName="Display name" />
            </ModalBody>
            <ModalButtons>
                <button onClick={() => setModel({type:""})} className="px-[16px] py-[13px] font-bold  border-[1px] border-[#EBEBEB] rounded-md ">Cancel</button>
                <button onClick={handleCreateModule} className="px-[16px] py-[13px] font-bold  border-[1px] border-[#EBEBEB] rounded-md bg-[#008392] text-white">Add</button>
            </ModalButtons>
        </Modal>
    )

}

export default AddLinkModuleModal