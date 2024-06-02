import {ModalField,ModalBody,ModalTitle,ModalButtons,Modal } from "./Modal";
import { IoMdMore } from "react-icons/io"
import { DropDown,DropDownIcon } from "./DropDown"
import { CiEdit } from "react-icons/ci"
import { RiDeleteBinLine } from "react-icons/ri"
import { CiFileOn } from "react-icons/ci"
import { useDrag,useDrop } from "react-dnd"
import { useState,useRef} from "react";
import update from 'immutability-helper'


function RenameFileModal({data, setModel, setData }) {
    const [fileName, setFileName] = useState("")

    const handleCreateModule = () => {
        if (fileName) {
            setData(p =>{
                if( data.moduleId){
                    p.forEach(ele=>{
                        if(ele.id == data.moduleId){
                            ele.inside.forEach(c=>{
                                if(c.id == data.id){
                                    c.fileName = fileName
                                }
                            })
                        }
                    })
                    return [...p]
                }
                p.forEach(ele=>{
                    if(ele.id == data.id){
                        ele.fileName = fileName
                    }
                })
                console.log(p)
                return [...p]

            })
            setModel({type:""})
        }
    }
    return (
        <Modal>
            <ModalTitle setModel={setModel} title="Rename File" />
            <ModalBody>
                <ModalField fieldValue={fileName} setField={setFileName} focus={true} fieldName="File Name" />
            </ModalBody>
            <ModalButtons>
                <button onClick={() => setModel("")} className="px-[16px] py-[13px] font-bold  border-[1px] border-[#EBEBEB] rounded-md ">Cancel</button>
                <button onClick={handleCreateModule} className="px-[16px] py-[13px] font-bold  border-[1px] border-[#EBEBEB] rounded-md bg-[#008392] text-white">Save Changes</button>
            </ModalButtons>
        </Modal>
    )
}

function RenderFile({ index, data, setData, inside ,setModel}) {
    const [isDropDown, setDropDown] = useState(false)
    const ref = useRef(null)

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "file",
        item: { id: data.id, index: index, type: data.type, fileName: data.fileName, moduleId: data.moduleId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            if(monitor.getDropResult() == null){
                setData(prev => {
                    const module = prev.filter((d) => item.moduleId == d.id && d.type == "module")
                    if(module.length === 0){
                        return [...prev]
                    } 
                    const elements = module[0].inside.filter(d => item.id != d.id)
                    module[0].inside = [...elements]
                    
                    prev.push({...item,moduleId:null})
                    return [...prev]
                })
                return 
            }
            if (monitor.getDropResult() && !monitor.getDropResult().info) {
                return
            }
            setData(prev => {
                console.log("Entered end")
                const module = prev.filter((d) => item.moduleId == d.id && d.type == "module")
                console.log("this is before  the module", item.moduleId, module)
                if (module.length == 0) {
                    const elements = prev.filter(d => item.id != d.id)
                    return [...elements]
                }
                console.log("this is the module", module)
                const elements = module[0].inside.filter(d => item.id != d.id)
                module[0].inside = [...elements]
                return [...prev]
            })
        }
    }))

    const [{ }, drop] = useDrop(() => ({
        accept: ["file", "url", "module"],
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
    
        }
    
      }))

    drag(drop(ref))
    const handleDelete = () => {
            setData(p =>{
                if( data.moduleId){
                    const module = p.filter(d => d.id === data.moduleId)
                    const ele = module[0].inside.filter(d=> d.id !== data.id)
                    module[0].inside =  [...ele]
                    return [...p]
                }
                const ele = p.filter(d=> d.id !== data.id)    
                return [...ele]

            })
    }
    return (
        <div ref={ref} style={inside ? {} : { borderRadius: "6px" }} className="border-[1px] relative p-[10px] flex justify-between items-center border-[#EBEBEB] ">

            <div className="flex gap-[10px] items-center">
                <div className=" bg-[#5dc074] flex justify-center items-center border-[1px] border-[#EBEBEB] rounded-md p-[5px] ">
                    <CiFileOn className="w-[20px] h-[20px]" />
                </div>
                <div className="flex flex-col gap-[1px]">
                    <span className="font-bold text-[16px]">{data.fileName}</span>

                    <span className="text-[#717171] font-medium text-[12px]">File</span>

                </div>

            </div>
            <div onClick={() => setDropDown(p => !p)} className="relative inline-block">
                    <button style={ isDropDown? {backgroundColor:"#EBEBEB"}:{} } className="rounded-md p-[10px] hover:bg-[#EBEBEB]  ">
                        <IoMdMore className="w-[20px] h-[20px]" />
                    </button>
                    {isDropDown &&
                        <DropDown>
                            <DropDownIcon setModel={() => setModel({type:"renamefile",id:data.id , moduleId:data.moduleId})} text="Rename">
                                <CiEdit className="w-[20px] h-[20px]" />
                            </DropDownIcon >
                            <DropDownIcon style={{color:"red"}} setModel={handleDelete} text="Delete">
                                <RiDeleteBinLine className="w-[20px] h-[20px] " />
                            </DropDownIcon>
                        </DropDown>
                    }
                </div>

            {isDragging ? <div className="bg-[#EBEBEB] absolute inset-0"></div>
                :
                null
            }
        </div>
    )
}

export {RenameFileModal , RenderFile}