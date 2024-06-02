import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import { useEffect, useState, useRef } from "react";
import update from 'immutability-helper'


function RenderFile(prop) {
  const ref = useRef(null)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "file",
    item: { id: prop.data.id, index: prop.index, type: prop.data.type, name: prop.data.name, fileName: prop.data.fileName, parentId: prop.parentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      console.log(monitor.getDropResult())
      if (!monitor.getDropResult().info) {
        return
      }

      console.log(monitor.getDropResult())
      prop.setData(prev => {
        let i
        if (Array.isArray(prev)) {
          i = prev.filter((d) => item.id != d.id)
          return [...i]
        } else {
          i = prev.inside.filter((d) => item.id != d.id)
          return { ...prev, inside: [...i] }
        }

      })
    }
  }))


// const ref = useRef(null)
    // const [{ }, drop] = useDrop(() => ({
    //     accept: ["file", "link", "module"],
    //     hover(item,monitor) {
    //       if (!ref.current) {
    //         return
    //       }
    //       const dragIndex = item.index
    //       const hoverIndex = index

    //       if (dragIndex === hoverIndex) {
    //         return
    //       }
    //       const hoverBoundingRect = ref.current?.getBoundingClientRect()
    //       const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    //       const clientOffset = monitor.getClientOffset()
    //       const hoverClientY = clientOffset.y - hoverBoundingRect.top

    //       if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    //         return
    //       }

    //       if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    //         return
    //       }

    //       setData(prev => {
    //         const module = prev.filter((d) => item.moduleId == d.id && d.type == "module")
    //         if(module){
    //             return update(prev, {
    //                 $splice: [
    //                   [dragIndex, 1],
    //                   [hoverIndex, 0, prev[dragIndex]],
    //                 ],
    //               })
    //         }
    //         module[0].inside = update(module[0].inside, {
    //             $splice: [
    //               [dragIndex, 1],
    //               [hoverIndex, 0, module[0].inside[dragIndex]],
    //             ],
    //           })
    //         return [...prev]
    //       })

    //       item.index = hoverIndex

    //       console.log("Hovering on :- ", data.id, " by ", item.id)
    //     }

    //   }))

  const [{ }, drop] = useDrop(() => ({
    accept: ["file", "url", "module"],
    hover(item,monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = prop.index

      console.log(dragIndex, hoverIndex, item)
      if (dragIndex === hoverIndex) {
        return
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      prop.setData(prev => {
        let i
        if (Array.isArray(prev)) {
          return update(prev, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, prev[dragIndex]],
            ],
          })
        } else {
          i = prev.inside.filter((d) => item.id != d.id)
          return {
            ...prev, inside: update(prev.inside, {
              $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, prev.inside[dragIndex]],
              ],
            })
          }
        }

      })

      item.index = hoverIndex

      console.log("Hovering on :- ", prop.data.id, " by ", item.id)
    }

  }))
  drag(drop(ref))
  return (
    <div ref={ref} style={{ backgroundColor: isDragging ? "red" : "" }} className="p-1 border-[1px] border-red-900">
      <p>{prop.data.name}- {prop.data.filename}-{prop.data.id}</p>
    </div>
  )
}

function RenderModule(prop) {
  const [data, setData] = useState(prop.data)

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["url", "file"],
    drop: (item, monitor) => {
      console.log("Caaled", monitor.getDropResult())
      if (monitor.didDrop()) {
        return monitor.getDropResult()
      }
      if (item.parentId == data.id) {
        console.log("cancel")
        return { info: false };
      }

      console.log("Item comes to ", prop.data.name, item)
      addFile(item)
      return { info: true };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),

  }));

  const addFile = (item) => {
    setData((prevData) => ({ ...prevData, inside: [...prevData.inside, (({ parentId, ...o }) => o)(item)] }));

  };


  useEffect(() => {
    setData(prop.data)
  },
    [prop.data])


  return (
    <div style={{ backgroundColor: isOver ? "yellow" : "" }} ref={drop} className="p-2 border-2 border-black ">
      <h2 className=" font-bold ">{data.name}-{data.id}</h2>
      <div className="pl-4">
        {<RenderResources parentId={data.id} setData={setData} data={data.inside} />}
      </div>
    </div>
  )
}

function RenderUrl(prop) {
  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "url",
    item: { id: prop.data.id, index: prop.index, type: prop.data.type, name: prop.data.name, parentId: prop.parentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.getDropResult().info) {
        return
      }
      console.log(monitor.getDropResult())
      prop.setData(prev => {
        let i
        if (Array.isArray(prev)) {
          i = prev.filter((d) => item.id != d.id)
          return [...i]
        } else {
          i = prev.inside.filter((d) => item.id != d.id)
          return { ...prev, inside: [...i] }
        }

      })
    }
  }));

  const [{ }, drop] = useDrop(() => ({
    accept: ["file", "url", "module"],
    hover(item,monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = prop.index

      console.log(dragIndex, hoverIndex, item)
      if (dragIndex === hoverIndex) {
        return
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      prop.setData(prev => {
        let i
        if (Array.isArray(prev)) {
          return update(prev, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, prev[dragIndex]],
            ],
          })
        } else {
          i = prev.inside.filter((d) => item.id != d.id)
          return {
            ...prev, inside: update(prev.inside, {
              $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, prev.inside[dragIndex]],
              ],
            })
          }
        }

      })

      item.index = hoverIndex

      console.log("Hovering on :- ", prop.data.id, " by ", item.id)
    }

  }))
  drag(drop(ref))
  const opacity = isDragging ? 0 : 1

  return (
    <div style={{ backgroundColor: isDragging ? "pink" : "", opacity: opacity }} ref={ref} className="p-1 border-[1px] border-purple-900">
      <p>{prop.data.name}-{prop.data.url}-{prop.data.id}</p>
    </div>
  )
}


function RenderResources(prop) {
  const [data, setData] = useState(prop.data)


  useEffect(() => {
    setData(prop.data)
  }, [prop.data])

  return (
    <div className="p-4 flex gap-3 flex-col ">
      {
        data.map((res, i) => {
          if (res.type == "module") {
            return <RenderModule index={i} parentId={prop.parentId} key={res.id} data={res} />
          } else if (res.type == "url") {
            return <RenderUrl index={i} parentId={prop.parentId} key={res.id} setData={prop.setData ? prop.setData : setData} data={res} />
          }
          return <RenderFile index={i} parentId={prop.parentId} key={res.id} setData={prop.setData ? prop.setData : setData} data={res} />

        })
      }
    </div>
  )
}


const r = [
  {
    type: "module",
    name: "Abdsd sfdsfs",
    id: 123,
    inside: [
      {
        type: "url",
        id: 124,
        name: "indie url1",
        url: "http://fdsfs"
      },
      {
        type: "url",
        id: 125,
        name: "inside url2",
        url: "http://fdsfs"
      },
      {
        type: "module",
        id: 127,
        name: "Inside module",
        inside: [
          {
            type: "url",
            id: 128,
            name: "indie url1",
            url: "http://fdsfs"
          },
          {
            type: "url",
            id: 129,
            name: "inside url2",
            url: "http://fdsfs"
          },
          {
            type: "url",
            id: 190,
            name: "indie url3",
            url: "http://fdsfs"
          },
          {
            type: "url",
            id: 189,
            name: "inside url4",
            url: "http://fdsfs"
          },
        ]
      },
    ]
  },
  {
    type: "url",
    id: 133,
    name: "url1",
    url: "http://fdsfs"
  },
  {
    type: "file",
    id: 143,
    name: "file1",
    filename: "dfsdf"
  }
]


function App() {

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <RenderResources parentId={-1} data={r} />
      </DndProvider>

    </div>
  )
}

export default App


