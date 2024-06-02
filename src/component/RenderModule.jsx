import {ModalField,ModalBody,ModalTitle,ModalButtons,Modal } from "./Modal";
import { IoMdMore } from "react-icons/io"
import { DropDown,DropDownIcon } from "./DropDown"
import { CiEdit } from "react-icons/ci"
import { RiDeleteBinLine } from "react-icons/ri"
import { FaCaretDown, FaCaretUp } from "react-icons/fa"
import Render from "./Render"
import {useDrag, useDrop } from "react-dnd"
import { useState,useRef } from "react";
import update from 'immutability-helper'

function EditModuleModal({data, setModel, setData }) {
    const [modulename, setModuleName] = useState("")

    const handleCreateModule = () => {
        if (modulename) {
            setData(p =>{   
                const ele = p.filter(d=> d.id === data.id)
                ele[0].name = modulename
                return [...p]

            })
            setModel({type:""})
        }
    }
    return (
        <Modal>
            <ModalTitle setModel={setModel} title="Edit module" />
            <ModalBody>
                <ModalField fieldValue={modulename} setField={setModuleName} focus={true} fieldName="Module name" />
            </ModalBody>
            <ModalButtons>
                <button onClick={() => setModel("")} className="px-[16px] py-[13px] font-bold  border-[1px] border-[#EBEBEB] rounded-md ">Cancel</button>
                <button onClick={handleCreateModule} className="px-[16px] py-[13px] font-bold  border-[1px] border-[#EBEBEB] rounded-md bg-[#008392] text-white">Save Changes</button>
            </ModalButtons>
        </Modal>
    )
}


function RenderModule({ index,data, setData,setModel }) {
    const [isDropDown, setDropDown] = useState(false)
    const [isExpanded, setExpanded] = useState(false)

    const ref = useRef(null)

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "module",
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        item: { id: data.id, index: index, type: data.type, name:data.name }
    }))

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ["link", "file","module"],
        drop: (item, monitor) => {
            if (monitor.didDrop()) {
                return monitor.getDropResult()
            }
            if (data.id == item.moduleId || item.type=="module") {
                return { info: false };
            }
            addFile(item)
            return { info: true };
        },
        hover(item,monitor) {
            if (!ref.current) {
              return
            }
            const dragIndex = item.index
            const hoverIndex = index
      
            if (dragIndex === hoverIndex) {
              return
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            if (dragIndex < hoverIndex && hoverClientY > 20 ) {
              return
            }
      
            if (dragIndex > hoverIndex && hoverClientY < (hoverBoundingRect.height - 20)) {
              return
            }
          setData(prev => {
              const module = prev.filter((d) => item.moduleId == d.id && d.type == "module")
              if(module){
                  return update(prev, {
                      $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, prev[dragIndex]],
                      ],
                    })
              }
              module[0].inside = update(module[0].inside, {
                  $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, module[0].inside[dragIndex]],
                  ],
                })
              return [...prev]
            })
  
            item.index = hoverIndex
      
            
      
          },
        collect: (monitor) => ({
            isOver: monitor.isOver({ shallow: true }),
        }),

    }));

    const addFile = (item) => {
        setData(prev => {
            const module = prev.filter((d) => data.id == d.id)
            module[0].inside.push({ ...item, moduleId: module[0].id })
            return [...prev]
        })

    }

    const handleDelete = () => {
        setData(p =>{
            const ele = p.filter(d=> d.id !== data.id)    
            return [...ele]

        })
    }
    drag(drop(ref))
    return (
        <div ref={ref} style={isOver ? data.inside.length == 0 ? { border: "1px solid #008392" } : { borderBottom: "1px solid #008392" } : {}} className="border-[1px] rounded-sm  relative  border-[#EBEBEB] ">
            <div className="flex justify-between items-center p-[10px] ">
                <div className="flex gap-[10px] items-center">
                    <div onClick={() => setExpanded(p => !p)} className=" cursor-pointer p-[5px] flex justify-center items-center border-[1px] border-[#EBEBEB] rounded-full ">
                        {isExpanded ? <FaCaretDown className="w-[20px] h-[20px]" /> : <FaCaretUp className="w-[20px] h-[20px]" />}
                    </div>
                    <div className="flex flex-col gap-[1px]">
                        <span className="font-bold text-[16px]">{data.name}</span>
                        {data.inside.length == 0 ?
                            <span className="text-[#717171] font-semibold text-[12px]">Add item to this module</span>
                            :
                            <span className="text-[#717171] font-medium text-[12px]">{data.inside.length} item</span>
                        }
                    </div>

                </div>
                <div onClick={() => setDropDown(p => !p)} className="relative inline-block">
                    <button style={ isDropDown? {backgroundColor:"#EBEBEB"}:{} } className="rounded-md p-[10px] hover:bg-[#EBEBEB]  ">
                        <IoMdMore className="w-[20px] h-[20px]" />
                    </button>
                    {isDropDown &&
                        <DropDown>
                        <DropDownIcon setModel={() => setModel({type:"editmodule",id:data.id })} text="Edit module name">
                            <CiEdit className="w-[20px] h-[20px]" />
                        </DropDownIcon >
                        <DropDownIcon style={{color:"red"}} setModel={handleDelete} text="Delete">
                            <RiDeleteBinLine className="w-[20px] h-[20px] " />
                        </DropDownIcon>
                    </DropDown>
                    }
                </div>

            </div>
            {isExpanded ?
                <div className="flex flex-col ">
                    {data.inside.map((d, i) => d?<Render setModel={setModel} inside={true} index={i} key={d.id} setData={setData} data={d} />:null)}

                </div>
                :
                null
            }
            {isDragging ? <div className="bg-[#EBEBEB] absolute inset-0"></div>
                :
                null
            }

        </div>
    )
}

export {RenderModule , EditModuleModal}