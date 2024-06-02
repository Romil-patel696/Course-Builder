import { useState, useId} from "react"
import {ModalField,ModalBody,ModalTitle,ModalButtons,Modal } from "./Modal"
function CreateModuleModal({ setModel, setData }) {
    const [modulename, setModuleName] = useState("")
    const id = useId()
    const handleCreateModule = () => {
        if (modulename) {
            setData(p => [...p,
            {
                id: id,
                type: "module",
                name: modulename,
                inside: []

            }

            ])
            setModel({type:""})
        }
    }

    return (
        <Modal>
            <ModalTitle setModel={setModel} title="Create a new module" />
            <ModalBody>
                <ModalField fieldValue={modulename} setField={setModuleName} focus={true} fieldName="Module name" />
            </ModalBody>
            <ModalButtons>
                <button onClick={() => setModel({type:""})} className="px-[16px] py-[13px] font-bold  border-[1px] border-[#EBEBEB] rounded-md ">Cancel</button>
                <button onClick={handleCreateModule} className="px-[16px] py-[13px] font-bold  border-[1px] border-[#EBEBEB] rounded-md bg-[#008392] text-white">Create</button>
            </ModalButtons>
        </Modal>
    )
}

export default CreateModuleModal