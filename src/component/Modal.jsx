import { RxCross2 } from "react-icons/rx";
function ModalOverlay({ children }) {
    return (
        <div className="z-20 p-[20px] fixed inset-0 flex justify-center items-center   bg-[#8F8F8F] border-2 border-black">
            {children}
        </div>
    )
}

function ModalButtons({ children }) {
    return (
        <div className="flex gap-[10px] justify-end ">
            {children}
        </div>
    )
}


function Modal({ children }) {
    return (
        <div className=" max-width-[500px]  px-[25px] py-[20px] flex flex-col gap-[20px]  bg-white rounded-md drop-shadow-lg ">
            {children}
        </div>
    )
}

function ModalTitle({ title, setModel }) {

    return (
        <div className="flex justify-between items-center">
            <h2 className="font-bold text-[20px] ">{title}</h2>
            <button onClick={() => setModel({type:""})}>
                <RxCross2 className="w-[20px] h-[20px]" />
            </button>
        </div>
    )
}

function ModalBody({ children }) {
    return (
        <div className="mt-[20px] flex flex-col gap-[20px]">
            {children}
        </div>
    )
}

function ModalField({ fieldValue, fieldName, focus, setField }) {
    return (
        <div className="flex flex-col gap-[10px]">
            <label className=" font-medium text-[16px]" htmlFor="modalfieldinput">{fieldName}</label>
            <input value={fieldValue} onChange={e => setField(e.target.value)} autoFocus={focus} className="w-full px-[10px] py-[12px] rounded-md border-[1px] border-[#EBEBEB]" id="modalfieldinput" type="text" />
        </div>
    )
}

export {ModalOverlay,ModalField,ModalBody,ModalTitle,ModalButtons,Modal}