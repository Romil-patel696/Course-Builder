import { useState, useId, useRef } from "react";
import {ModalField,ModalBody,ModalTitle,ModalButtons,Modal } from "./Modal"
function UploadModal({ setModel, setData }) {
    const [fileName, setFileName] = useState("")
    const fileRef = useRef()

    const id = useId()
    const handleCreateModule = () => {
        if (fileName) {
            setData(p => [...p,
            {
                id: id,
                type: "file",
                fileName: fileName,
                moduleId: null

            }

            ])
            setModel({type:""})
        }
    }

    const handleFileChange =()=>{
        console.log("Calleld")
        if(fileRef.current ){
            setFileName(fileRef.current.files[0].name)
        }
    }

    const openFileUpload =()=>{
        if(fileRef.current){
            fileRef.current.click()
        }
    }

    return (
        <Modal>
            <ModalTitle setModel={setModel} title="Add a file" />
            <ModalBody>
                <ModalField fieldValue={fileName} setField={setFileName} focus={true} fieldName="URL" />
                <button className="p-[10px] rounded-md border-[1px] border-[#EBEBEB]" onClick={openFileUpload}>Upload</button>
                <input onChange={handleFileChange} className="hidden" id="file" ref={fileRef} type="file" />
            </ModalBody>
            <ModalButtons>
                <button onClick={() => setModel({type:""})} className="px-[16px] py-[13px] font-bold  border-[1px] border-[#EBEBEB] rounded-md ">Cancel</button>
                <button onClick={handleCreateModule} className="px-[16px] py-[13px] font-bold  border-[1px] border-[#EBEBEB] rounded-md bg-[#008392] text-white">Add</button>
            </ModalButtons>
        </Modal>
    )
}

export default UploadModal