import { FiPlus } from "react-icons/fi";
import { FaCaretDown } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import { TfiUpload } from "react-icons/tfi";
import { LuRows } from "react-icons/lu";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ModalOverlay } from "./component/Modal"
import { DropDown,DropDownIcon } from "./component/DropDown"
import Render from "./component/Render"
import CreateModuleModal from "./component/CreateModule"
import AddLinkModuleModal from "./component/AddLinkModule"
import UploadModal from "./component/UploadModule"
import {EditModuleModal} from "./component/RenderModule"
import {EditLinkModal} from "./component/RenderLink"
import {RenameFileModal} from "./component/RenderFile"
import img from "./assets/image.png"


function AddButton({ setModel }) {
    const [isDropDown, setDropDown] = useState(false)
    return (
        <div onClick={() => setDropDown(p => !p)} className="relative inline-block">
            <button className=" drop-shadow-lg active:drop-shadow-none text-white  flex items-center gap-[8px] rounded-md px-[13px] py-[8px] bg-[#AF273E]">
                <FiPlus className=" w-[20px] h-[20px]" />
                <span className=" font-semibold ">Add</span>
                <FaCaretDown className=" w-[20px] h-[20px]" />
            </button>
            {isDropDown &&
                <DropDown>
                    <DropDownIcon setModel={() => setModel({type:"module"})} text="Create Module">
                        <LuRows className="w-[20px] h-[20px]" />
                    </DropDownIcon >
                    <DropDownIcon setModel={() => setModel({type:"link"})} text="Add a link">
                        <IoIosLink className="w-[20px] h-[20px]" />
                    </DropDownIcon>
                    <DropDownIcon setModel={() => setModel({type:"file"})} text="Upload">
                        <TfiUpload className="w-[20px] h-[20px]" />
                    </DropDownIcon>
                </DropDown>
            }
        </div>
    )
}

function RenderComponents({data,setModel,setData}){
    return (
        <div className=" mt-[40px] flex flex-col gap-[20px]">
                    {data.map((d, i) => d? <Render setModel={setModel} index={i} key={d.id} setData={setData} data={d} />:null)}
        </div>
    )
}




function App() {
    
    const [OpenModel, setModel] = useState({type:""})

    const [data, setData] = useState([
    ])

    let model
    switch (OpenModel.type) {
        case "module":
            model = <CreateModuleModal setData={setData} setModel={setModel} />
            break
        case "link":
            model = <AddLinkModuleModal setData={setData} setModel={setModel} />
            break
        case "file":
            model = <UploadModal setData={setData} setModel={setModel} />
            break
        case "editlink":
                model = <EditLinkModal data={OpenModel} setData={setData} setModel={setModel} />
                break
        case "editmodule":
                model = <EditModuleModal data={OpenModel} setData={setData} setModel={setModel} />
                break
        case "renamefile":
                model = <RenameFileModal data={OpenModel} setData={setData} setModel={setModel} />
                break
        default:
            model = null
            break
    }
    return (
        <div className=" mt-[50px] mx-[20px] max-w-[700px] md:mx-auto ">
            <div className="flex items-center justify-between">
                <h2 className="kbc  font-extrabold text-xl">Course Builder</h2>

                <AddButton setModel={setModel} />
                {OpenModel.type != "" &&
                    <ModalOverlay>
                        {model}
                    </ModalOverlay>}
            </div>
            <DndProvider  backend={HTML5Backend}>
                <RenderComponents setData={setData} setModel={setModel} data={data} />
            </DndProvider>
            { data.length == 0?
            <div className="mt-[200px] flex flex-col items-center">
                <img src={img} />
                <span className="font-extrabold text-xl ">Nothing added here</span>
                <span>Click on the [+] Add button to add items to this course</span>
            </div>
            :null
            }

        </div>
    )
}
export default App