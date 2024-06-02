import {RenderModule} from "./RenderModule"
import {RenderLink} from "./RenderLink"
import {RenderFile} from "./RenderFile"

function Render({ inside, index, data, setData ,setModel }) {
    let component
    switch (data.type) {
        case "module":
            component = <RenderModule setModel={setModel} inside={inside} index={index} setData={setData} data={data} />
            break
        case "link":
            component = <RenderLink setModel={setModel} inside={inside} index={index} setData={setData} data={data} />
            break
        case "file":
            component = <RenderFile setModel={setModel} inside={inside} index={index} setData={setData} data={data} />
            break
        default:
            component = null
            break
    }
    return component
}
export default Render