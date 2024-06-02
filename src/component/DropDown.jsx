function DropDownIcon({ text, setModel, children ,...other}) {

    return (
        <>
            <button {...other} onClick={() => setModel(true)} className=" abc z-10 w-full py-[10px] px-[16px] flex gap-[8px] items-center text-[#717171] font-medium text-[14px]  hover:bg-[#F2F2F2] ">
                {children}
                <span>{text}</span>
            </button>
        </>
    )
}

function DropDown({ children }) {
    return (
        <div className=" z-10  rounded-md shadow-xl absolute py-[6px]  bg-white  text-black  right-0 min-w-[200px] flex flex-col items-start translate-y-[5%]  ">
            {children}
        </div>
    )
}

export {DropDown,DropDownIcon}